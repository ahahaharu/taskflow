# TaskFlow

A real-time Kanban task manager (Jira-lite) built with React, TypeScript and Supabase. Create boards, organize work into columns, drag tasks around, collaborate with teammates, and watch changes sync live across everyone on the board.

<img width="1470" height="739" alt="image" src="https://github.com/user-attachments/assets/b2451cdb-d8c5-4983-a321-e94a90867f5a" />

**Live demo:** https://taskflow-gamma-vert.vercel.app/

### Demo account

```
Email:    test_user@gmail.com
Password: test_password
```

The demo account already has a board with tasks so you can explore right away.

---

## Tech stack
 
| Area | Choice |
| --- | --- |
| Framework | React 19 (Vite 8) |
| Language | TypeScript 6 (strict mode) |
| Backend / DB | Supabase (Postgres, Auth, Realtime, Storage) — `@supabase/supabase-js` 2 |
| Styling | Tailwind CSS v4 (custom "Warm Paper" design system) |
| Server state | TanStack React Query 5 |
| Drag & drop | @dnd-kit (core 6 / sortable 10) |
| Routing | React Router 7 |
| Icons | lucide-react |
| Notifications | react-hot-toast |
| Tests | Vitest 4 + React Testing Library |
 
---

## Implemented levels

### Level 1 — MVP (complete)

- **Auth** — email + password sign up / sign in / sign out, Supabase Auth. Protected routes redirect unauthenticated users to the login page.
- **Boards** — list of your boards, create, delete, open. Three default columns are created automatically on board creation.
- **Columns** — add, delete, rename (inline).
- **Tasks** — create within a column, drag-and-drop between columns and reorder within a column, delete.
- **Base UI** — responsive (desktop + mobile), loading states (spinners), error handling via toasts.

### Level 2 — Full functionality (complete)

- **Task details** — modal with view / edit modes: title, description, priority (low / medium / high), due date, assignee (chosen from board members).
- **Comments** — list with author and timestamp, add / delete.
- **Realtime** — boards update automatically when others make changes (tasks, columns, comments) via Supabase Realtime. No reload needed.
- **Collaboration** — invite users to a board by email, roles owner / member (enforced at the database level via RLS), owner can manage members and delete the board.
- **Profile** — name and avatar (uploaded to Supabase Storage); avatars shown on task cards and comments.

### Level 3 — Bonus

- **Search** — filter tasks by title (client-side, instant).
- **Filters** — by priority and assignee.
- **Activity log** — a board activity feed ("X moved task Y to Done"), recorded by database triggers and streamed live.
- **File attachments** — attach any file to a task (Supabase Storage), secured at the storage level by board membership.
- **Dark mode** — manual toggle, remembered across sessions, with a warm dark palette (no flash of light theme on reload).
- **Google OAuth** — sign in with Google.
- **Keyboard shortcuts** — Esc closes modals.

---

## Running locally

```bash
git clone https://github.com/ahahaharu/taskflow
cd taskflow
npm install
cp .env.example .env   # fill in your Supabase keys (see below)
npm run dev
```

The app runs on http://localhost:5173 by default.

### Environment variables

`.env.example` documents what you need:

```
VITE_SUPABASE_URL=        # Settings -> API -> Project URL
VITE_SUPABASE_ANON_KEY=   # Settings -> API -> anon / publishable key
```

### Other scripts

```bash
npm run build   # type-check + production build
npm test        # run the test suite
```

---

## Supabase setup (for a fresh project)

If you want to run this against your own Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL in [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor. It creates all tables, helper functions, triggers, RLS policies and realtime publications in one pass.
3. **Auth** — enable the Email provider under Authentication → Sign In / Providers. For convenient testing, create a user via Authentication → Users → Add user with "Auto Confirm User".
4. **Storage** — create two buckets:
   - `avatars` — public.
   - `attachments` — private.
   - The storage access policies are included in `schema.sql`.
5. **Google OAuth (optional)** — register an OAuth client in Google Cloud Console and add the Client ID / Secret under Authentication → Sign In / Providers → Google. Add your local and deployed URLs to Authentication → URL Configuration → Redirect URLs.
6. Copy your Project URL and anon key into `.env`.

---

## Architecture & key decisions

The code follows a layered structure: `services/` (Supabase calls), `hooks/` (React Query wrappers), `components/`, `pages/`, `providers/`, `types/`, `utils/`.

**State management.** A deliberate split: server state lives in React Query (boards, tasks, members, comments, profiles, activity), UI state in local `useState` (open modals, filter values, form drafts), global client state in Context (`AuthProvider` for the session, `ThemeProvider` for dark mode). The theme preference is persisted in `localStorage` since it's a device-specific UI setting, not server data.

**Row Level Security.** Every table has RLS enabled. Membership checks (who can see/edit a board) are done through `SECURITY DEFINER` helper functions (`is_board_member`, `is_board_owner`, `can_access_task`). This deliberately avoids the classic infinite-recursion problem you hit when a policy on `board_members` queries `board_members`. Ownership fields (`owner_id`, `created_by`, `user_id`) default to `auth.uid()` so the client never sends them and can't spoof them.

**Realtime.** Subscriptions to `tasks`, `columns`, `comments` and `activity` don't patch the cache by hand — they call React Query's `invalidateQueries`, keeping React Query the single source of truth and avoiding drift.

**Drag & drop.** Reordering updates the React Query cache optimistically during the drag (cards reflow live), then persists positions on drop. The DnD reorder uses the full cached task list, so it stays correct even while a filter is active.

**Search & filters.** Done entirely client-side over the already-loaded board tasks. A Kanban board loads all of a board's tasks anyway (they have to be laid out into columns), so filtering in memory is instant and needs no extra requests or debouncing. A server-side search would only make sense for a global search across many boards.

**Activity log.** Recorded by database triggers on `tasks` (insert / column-change / delete), not by client code. Triggers can't be "forgotten" and capture every change regardless of where it originated.

**Attachments security.** Three layers: the `attachments` table is under RLS by board membership, the storage objects are under RLS that checks membership via the `board_id` embedded in the file path, and the bucket is private (files are served through time-limited signed URLs). A non-member can't reach a file through any path.

---

## What I'd improve with more time

- **Email invitations for non-registered users.** Inviting currently adds an already-registered user (looked up by email via a secured RPC). A full invite flow — an `invitations` table with pending state, an email with a link, acceptance after sign-up — would need Supabase Edge Functions and an email provider.
- **More tests.** There's a small smoke-test suite (a query hook, a mutation hook, the Avatar component); broader coverage of the DnD and realtime logic would be valuable.
- **Global server-side search** across all boards (with debouncing and pagination) as a complement to the in-board client-side search.

---

## Author

Andrei Bogdanovich
