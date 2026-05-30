import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getTasks,
  createTask,
  deleteTask,
  moveTasks,
  updateTask,
} from "@/services/tasks";
import type { TaskPositionUpdate, TaskUpdate } from "@/services/tasks";
import type { Task } from "@/types";

export function useTasks(boardId: string) {
  return useQuery({
    queryKey: ["tasks", boardId],
    queryFn: () => getTasks(boardId),
  });
}

export function useCreateTask(boardId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      columnId,
      title,
      position,
    }: {
      columnId: string;
      title: string;
      position: number;
    }) => createTask(columnId, title, position),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks", boardId] }),
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateTask(boardId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: TaskUpdate }) =>
      updateTask(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", boardId] });
      toast.success("Task updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteTask(boardId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks", boardId] }),
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useMoveTasks(boardId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (updates: TaskPositionUpdate[]) => moveTasks(updates),
    onMutate: async (updates) => {
      await qc.cancelQueries({ queryKey: ["tasks", boardId] });
      const prev = qc.getQueryData<Task[]>(["tasks", boardId]);
      qc.setQueryData<Task[]>(["tasks", boardId], (old) => {
        if (!old) return old;
        const map = new Map(updates.map((u) => [u.id, u]));
        return old.map((t) => {
          const u = map.get(t.id);
          return u ? { ...t, column_id: u.column_id, position: u.position } : t;
        });
      });
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["tasks", boardId], ctx.prev);
      toast.error("Failed to move task");
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["tasks", boardId] }),
  });
}
