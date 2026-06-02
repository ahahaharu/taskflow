import type { Priority } from "@/types";

export interface BoardFilters {
  query: string;
  priority: Priority | "all";
  assignee: string | "all";
}

export const emptyFilters: BoardFilters = {
  query: "",
  priority: "all",
  assignee: "all",
};
