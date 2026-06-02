import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { getActivity } from "@/services/activity";

export function useActivity(boardId: string) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!boardId) return;
    const channel = supabase
      .channel(`activity:${boardId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity",
          filter: `board_id=eq.${boardId}`,
        },
        () => qc.invalidateQueries({ queryKey: ["activity", boardId] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardId, qc]);

  return useQuery({
    queryKey: ["activity", boardId],
    queryFn: () => getActivity(boardId),
  });
}
