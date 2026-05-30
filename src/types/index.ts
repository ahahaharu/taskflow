export type Priority = "low" | "medium" | "high";
export type BoardRole = "owner" | "member";

export interface Board {
  id: string;
  title: string;
  owner_id: string;
  created_at: string;
}

export interface Column {
  id: string;
  board_id: string;
  title: string;
  position: number;
}

export interface Task {
  id: string;
  column_id: string;
  title: string;
  description: string | null;
  priority: Priority;
  due_date: string | null;
  assignee_id: string | null;
  position: number;
  created_by: string;
  created_at: string;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
}
