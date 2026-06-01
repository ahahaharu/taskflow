import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

export function useRealtimeBoard(boardId: string) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!boardId) return;

    const invalidateTasks = () =>
      qc.invalidateQueries({ queryKey: ["tasks", boardId] });
    const invalidateColumns = () =>
      qc.invalidateQueries({ queryKey: ["columns", boardId] });

    const channel = supabase
      .channel(`board:${boardId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        invalidateTasks,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "columns",
          filter: `board_id=eq.${boardId}`,
        },
        invalidateColumns,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardId, qc]);
}
