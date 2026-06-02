import { useRef } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, Camera } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  useProfile,
  useUpdateProfileName,
  useUploadAvatar,
} from "@/hooks/useProfile";
import { Avatar } from "@/components/shared/Avatar";
import { Spinner } from "@/components/shared/Spinner";
import { ButtonSpinner } from "@/components/shared/ButtonSpinner";
import type { Profile } from "@/types";

export function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id);

  if (isLoading || !user) return <Spinner fullScreen />;

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
          <Link
            to="/"
            aria-label="Back to boards"
            className="flex h-9 w-9 items-center justify-center rounded-control text-ink-2 transition-colors duration-150 hover:bg-surface-2 hover:text-ink"
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </Link>
          <h1 className="font-serif text-xl font-semibold tracking-tight text-ink">
            Profile
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-md px-6 py-12">
        <ProfileForm
          key={profile?.id ?? user.id}
          userId={user.id}
          profile={profile ?? null}
          email={user.email}
        />
      </main>
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
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => fileInput.current?.click()}
        disabled={uploadAvatar.isPending}
        className="group relative rounded-full focus:outline-none disabled:cursor-wait"
        aria-label="Change avatar"
      >
        <Avatar name={profile?.name} url={profile?.avatar_url} size="lg" />
        <span
          className={`absolute inset-0 flex items-center justify-center gap-1.5 rounded-full bg-black/55 text-xs font-medium text-white transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 ${
            uploadAvatar.isPending ? "opacity-100" : "opacity-0"
          }`}
        >
          {uploadAvatar.isPending ? (
            <ButtonSpinner />
          ) : (
            <Camera size={14} strokeWidth={2} />
          )}
          {uploadAvatar.isPending ? "Uploading…" : "Change"}
        </span>
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      <p className="mt-3 text-xs text-ink-muted">{email}</p>

      <div className="mt-10 w-full">
        <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-ink-muted">
          Name
        </label>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={updateName.isPending}
            placeholder="Your name"
            className="flex-1 rounded-control border border-line bg-card px-3 py-2 text-sm text-ink placeholder:text-ink-muted outline-none transition-colors duration-150 focus:border-line-strong focus:ring-2 focus:ring-accent/15 disabled:opacity-50"
          />
          <button
            onClick={() => updateName.mutate(name.trim())}
            disabled={updateName.isPending || !name.trim()}
            className="flex items-center gap-1.5 rounded-control bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-hover disabled:opacity-50"
          >
            {updateName.isPending && <ButtonSpinner />}
            {updateName.isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
