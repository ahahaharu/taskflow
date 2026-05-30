import { useParams, Link } from "react-router-dom";

export function BoardPage() {
  const { boardId } = useParams();
  return (
    <div className="p-6">
      <Link to="/" className="text-sm text-slate-500 hover:underline">
        ← Back to boards
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">
        Board {boardId}
      </h1>
      <p className="mt-2 text-slate-500">Columns and tasks coming next.</p>
    </div>
  );
}
