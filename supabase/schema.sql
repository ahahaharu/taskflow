-- ============================================================
-- TaskFlow — schema, helpers, triggers, RLS
-- Run once in Supabase SQL Editor on a fresh project
-- ============================================================

-- ---------- 1. TABLES ----------
create table boards (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  owner_id    uuid not null references auth.users(id) on delete cascade default auth.uid(),
  created_at  timestamptz default now()
);

create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  avatar_url text
);

create table board_members (
  id        uuid primary key default gen_random_uuid(),
  board_id  uuid not null references boards(id) on delete cascade,
  user_id   uuid not null references auth.users(id) on delete cascade,
  role      text not null default 'member' check (role in ('owner', 'member')),
  unique(board_id, user_id),
  -- link to profiles (same id as auth.users) so we can join member -> profile
  constraint board_members_profile_fk
    foreign key (user_id) references profiles(id) on delete cascade
);

create table columns (
  id        uuid primary key default gen_random_uuid(),
  board_id  uuid not null references boards(id) on delete cascade,
  title     text not null,
  position  integer not null default 0
);

create table tasks (
  id          uuid primary key default gen_random_uuid(),
  column_id   uuid not null references columns(id) on delete cascade,
  title       text not null,
  description text,
  priority    text default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date    date,
  assignee_id uuid references auth.users(id),
  position    integer not null default 0,
  created_by  uuid not null references auth.users(id) default auth.uid(),
  created_at  timestamptz default now()
);

create table comments (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null references tasks(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade default auth.uid(),
  content    text not null,
  created_at timestamptz default now()
);

-- Indexes for FKs / common queries
create index idx_board_members_user  on board_members(user_id);
create index idx_board_members_board on board_members(board_id);
create index idx_columns_board       on columns(board_id);
create index idx_tasks_column        on tasks(column_id);
create index idx_comments_task       on comments(task_id);

-- ---------- 2. HELPER FUNCTIONS (security definer = bypass RLS, break recursion) ----------
create or replace function public.is_board_member(_board_id uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from board_members
    where board_id = _board_id and user_id = (select auth.uid())
  );
$$;

create or replace function public.is_board_owner(_board_id uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from boards
    where id = _board_id and owner_id = (select auth.uid())
  );
$$;

create or replace function public.can_access_column(_column_id uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from columns c
    join board_members bm on bm.board_id = c.board_id
    where c.id = _column_id and bm.user_id = (select auth.uid())
  );
$$;

create or replace function public.can_access_task(_task_id uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from tasks t
    join columns c        on c.id = t.column_id
    join board_members bm on bm.board_id = c.board_id
    where t.id = _task_id and bm.user_id = (select auth.uid())
  );
$$;

-- ---------- 3. TRIGGERS ----------
-- Auto-create a profile row on signup (name comes from signUp metadata)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data ->> 'name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- On board creation: add owner membership + 3 default columns (atomic)
create or replace function public.handle_new_board()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into board_members (board_id, user_id, role)
  values (new.id, new.owner_id, 'owner');

  insert into columns (board_id, title, position) values
    (new.id, 'To Do', 0),
    (new.id, 'In Progress', 1),
    (new.id, 'Done', 2);

  return new;
end;
$$;

create trigger on_board_created
  after insert on boards
  for each row execute function public.handle_new_board();

-- ---------- 4. ENABLE RLS ----------
alter table boards        enable row level security;
alter table board_members enable row level security;
alter table columns       enable row level security;
alter table tasks         enable row level security;
alter table comments      enable row level security;
alter table profiles      enable row level security;

-- ---------- 5. POLICIES ----------

-- profiles: any authenticated user can read (needed for names/avatars); edit own only
create policy "profiles_select" on profiles for select
  to authenticated using (true);
create policy "profiles_insert_own" on profiles for insert
  to authenticated with check (id = (select auth.uid()));
create policy "profiles_update_own" on profiles for update
  to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- boards (owner sees own board directly; members see boards they belong to)
create policy "boards_select_member" on boards for select
  to authenticated using (owner_id = (select auth.uid()) or is_board_member(id));
create policy "boards_insert_own" on boards for insert
  to authenticated with check (owner_id = (select auth.uid()));
create policy "boards_update_owner" on boards for update
  to authenticated using (owner_id = (select auth.uid()));
create policy "boards_delete_owner" on boards for delete
  to authenticated using (owner_id = (select auth.uid()));

-- board_members
create policy "members_select" on board_members for select
  to authenticated using (is_board_member(board_id));
create policy "members_insert_owner" on board_members for insert
  to authenticated with check (is_board_owner(board_id));
create policy "members_delete_owner" on board_members for delete
  to authenticated using (is_board_owner(board_id));

-- columns
create policy "columns_select" on columns for select
  to authenticated using (is_board_member(board_id));
create policy "columns_insert" on columns for insert
  to authenticated with check (is_board_member(board_id));
create policy "columns_update" on columns for update
  to authenticated using (is_board_member(board_id));
create policy "columns_delete" on columns for delete
  to authenticated using (is_board_member(board_id));

-- tasks (access resolved via column -> board)
create policy "tasks_select" on tasks for select
  to authenticated using (can_access_column(column_id));
create policy "tasks_insert" on tasks for insert
  to authenticated with check (can_access_column(column_id) and created_by = (select auth.uid()));
create policy "tasks_update" on tasks for update
  to authenticated using (can_access_column(column_id)) with check (can_access_column(column_id));
create policy "tasks_delete" on tasks for delete
  to authenticated using (can_access_column(column_id));

-- comments (access resolved via task -> column -> board)
create policy "comments_select" on comments for select
  to authenticated using (can_access_task(task_id));
create policy "comments_insert" on comments for insert
  to authenticated with check (can_access_task(task_id) and user_id = (select auth.uid()));
create policy "comments_delete_own" on comments for delete
  to authenticated using (user_id = (select auth.uid()));

-- ---------- 6. REALTIME ----------
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table columns;
alter publication supabase_realtime add table comments;

-- ---------- 7. RPC ----------
-- Invite a user to a board by email. Returns a status string.
-- security definer: needs to read auth.users (email) and insert membership.
create or replace function public.invite_member(_board_id uuid, _email text)
returns text
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  _caller uuid := auth.uid();
  _target uuid;
begin
  -- only the board owner may invite
  if not exists (
    select 1 from boards where id = _board_id and owner_id = _caller
  ) then
    return 'not_owner';
  end if;

  -- find the user by email (case-insensitive)
  select id into _target from auth.users where lower(email) = lower(_email);
  if _target is null then
    return 'user_not_found';
  end if;

  -- already a member?
  if exists (
    select 1 from board_members where board_id = _board_id and user_id = _target
  ) then
    return 'already_member';
  end if;

  insert into board_members (board_id, user_id, role)
  values (_board_id, _target, 'member');

  return 'ok';
end;
$$;