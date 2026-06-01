import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getBoardMembers,
  getBoardMembersDetailed,
  inviteMember,
  removeMember,
} from "@/services/members";

export function useMembers(boardId: string) {
  return useQuery({
    queryKey: ["members", boardId],
    queryFn: () => getBoardMembers(boardId),
  });
}

export function useBoardMembersDetailed(boardId: string) {
  return useQuery({
    queryKey: ["members-detailed", boardId],
    queryFn: () => getBoardMembersDetailed(boardId),
  });
}

export function useInviteMember(boardId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => inviteMember(boardId, email),
    onSuccess: (result) => {
      if (result === "ok") {
        toast.success("Member added");
        qc.invalidateQueries({ queryKey: ["members-detailed", boardId] });
        qc.invalidateQueries({ queryKey: ["members", boardId] });
      } else if (result === "user_not_found") {
        toast.error("No user with that email (they must sign up first)");
      } else if (result === "already_member") {
        toast.error("Already a member");
      } else if (result === "not_owner") {
        toast.error("Only the owner can invite");
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRemoveMember(boardId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeMember,
    onSuccess: () => {
      toast.success("Member removed");
      qc.invalidateQueries({ queryKey: ["members-detailed", boardId] });
      qc.invalidateQueries({ queryKey: ["members", boardId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
