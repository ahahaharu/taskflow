import { useQuery } from "@tanstack/react-query";
import { getBoardMembers } from "@/services/members";

export function useMembers(boardId: string) {
  return useQuery({
    queryKey: ["members", boardId],
    queryFn: () => getBoardMembers(boardId),
  });
}
