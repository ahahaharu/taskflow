import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getColumns,
  createColumn,
  renameColumn,
  deleteColumn,
} from "@/services/columns";

export function useColumns(boardId: string) {
  return useQuery({
    queryKey: ["columns", boardId],
    queryFn: () => getColumns(boardId),
  });
}

export function useCreateColumn(boardId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ title, position }: { title: string; position: number }) =>
      createColumn(boardId, title, position),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["columns", boardId] }),
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRenameColumn(boardId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      renameColumn(id, title),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["columns", boardId] }),
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteColumn(boardId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteColumn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["columns", boardId] });
      qc.invalidateQueries({ queryKey: ["tasks", boardId] });
      toast.success("Column deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
