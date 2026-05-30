import { signOut } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";

export function BoardsPage() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My boards</h1>
        <button
          onClick={() => signOut()}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
        >
          Sign out
        </button>
      </div>
      <p className="mt-4 text-slate-600">Logged in as {user?.email}</p>
    </div>
  );
}
