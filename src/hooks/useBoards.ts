import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getBoards,
  createBoard,
  deleteBoard,
  getBoard,
} from "@/services/boards";

export function useBoards() {
  return useQuery({ queryKey: ["boards"], queryFn: getBoards });
}

export function useCreateBoard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["boards"] });
      toast.success("Board created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteBoard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["boards"] });
      toast.success("Board deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useBoard(id: string) {
  return useQuery({ queryKey: ["board", id], queryFn: () => getBoard(id) });
}
