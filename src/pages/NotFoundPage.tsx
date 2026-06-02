import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-4 text-center">
      <h1 className="font-serif text-6xl font-semibold tracking-tight text-ink">
        404
      </h1>
      <p className="text-sm text-ink-2">This page doesn't exist.</p>
      <Link
        to="/"
        className="rounded-control bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-hover"
      >
        Go home
      </Link>
    </div>
  );
}
