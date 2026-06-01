import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

export function useRealtimeComments(taskId: string) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!taskId) return;

    const channel = supabase
      .channel(`comments:${taskId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `task_id=eq.${taskId}`,
        },
        () => qc.invalidateQueries({ queryKey: ["comments", taskId] }),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId, qc]);
}
