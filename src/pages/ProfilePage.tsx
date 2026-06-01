import { useRef } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useProfile,
  useUpdateProfileName,
  useUploadAvatar,
} from "@/hooks/useProfile";
import { Avatar } from "@/components/shared/Avatar";
import { Spinner } from "@/components/shared/Spinner";
import type { Profile } from "@/types";

export function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id);

  if (isLoading || !user) return <Spinner fullScreen />;

  return (
    <div className="mx-auto max-w-md p-6">
      <Link to="/" className="text-sm text-slate-500 hover:underline">
        ← Back to boards
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-900">Profile</h1>
      <ProfileForm
        key={profile?.id ?? user.id}
        userId={user.id}
        profile={profile ?? null}
        email={user.email}
      />
    </div>
  );
}

function ProfileForm({
  userId,
  profile,
  email,
}: {
  userId: string;
  profile: Profile | null;
  email?: string;
}) {
  const updateName = useUpdateProfileName(userId);
  const uploadAvatar = useUploadAvatar(userId);
  const fileInput = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(profile?.name ?? "");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadAvatar.mutate(file);
  }

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <Avatar name={profile?.name} url={profile?.avatar_url} size="lg" />
        <button
          onClick={() => fileInput.current?.click()}
          disabled={uploadAvatar.isPending}
          className="text-sm text-slate-600 hover:underline disabled:opacity-50"
        >
          {uploadAvatar.isPending ? "Uploading…" : "Change avatar"}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      <div className="mt-6">
        <label className="mb-1 block text-xs font-medium text-slate-500">
          Name
        </label>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
          <button
            onClick={() => updateName.mutate(name.trim())}
            disabled={updateName.isPending || !name.trim()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">{email}</p>
    </>
  );
}
