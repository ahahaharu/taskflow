import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getProfile,
  updateProfileName,
  uploadAvatar,
} from "@/services/profile";

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfile(userId!),
    enabled: Boolean(userId),
  });
}

export function useUpdateProfileName(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => updateProfileName(userId, name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", userId] });
      toast.success("Profile updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUploadAvatar(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadAvatar(userId, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", userId] });
      toast.success("Avatar updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
