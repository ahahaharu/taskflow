import { Search, X, SlidersHorizontal } from "lucide-react";
import type { Profile } from "@/types";
import type { BoardFilters } from "@/types/filters";

const selectClass =
  "rounded-control border border-line bg-card px-2.5 py-1.5 text-sm text-ink outline-none transition-colors duration-150 hover:border-line-strong focus:border-accent";

export function BoardToolbar({
  filters,
  onChange,
  onReset,
  members,
  total,
  shown,
}: {
  filters: BoardFilters;
  onChange: (f: BoardFilters) => void;
  onReset: () => void;
  members: Profile[];
  total: number;
  shown: number;
}) {
  const active =
    filters.query.trim() !== "" ||
    filters.priority !== "all" ||
    filters.assignee !== "all";

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative min-w-0 flex-1 sm:max-w-xs">
        <Search
          size={15}
          strokeWidth={2}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="Search tasks…"
          className="w-full rounded-control border border-line bg-card py-1.5 pl-8 pr-8 text-sm text-ink outline-none transition-colors duration-150 hover:border-line-strong focus:border-accent placeholder:text-ink-muted"
        />
        {filters.query && (
          <button
            onClick={() => onChange({ ...filters, query: "" })}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-muted hover:text-ink"
          >
            <X size={14} strokeWidth={2} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-ink-muted">
        <SlidersHorizontal size={15} strokeWidth={2} aria-hidden="true" />
      </div>

      <select
        value={filters.priority}
        onChange={(e) =>
          onChange({
            ...filters,
            priority: e.target.value as BoardFilters["priority"],
          })
        }
        className={selectClass}
        aria-label="Filter by priority"
      >
        <option value="all">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        value={filters.assignee}
        onChange={(e) => onChange({ ...filters, assignee: e.target.value })}
        className={selectClass}
        aria-label="Filter by assignee"
      >
        <option value="all">All assignees</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name?.trim() || "Unnamed"}
          </option>
        ))}
      </select>

      {active && (
        <>
          <button
            onClick={onReset}
            className="rounded-control px-2.5 py-1.5 text-sm text-ink-2 transition-colors duration-150 hover:bg-surface-2 hover:text-ink"
          >
            Reset
          </button>
          <span className="text-xs text-ink-muted">
            {shown} / {total}
          </span>
        </>
      )}
    </div>
  );
}
