function initials(name: string | null | undefined) {
  const n = name?.trim();
  if (!n) return "?";
  return n
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

const sizes = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-20 w-20 text-xl",
};

export function Avatar({
  name,
  url,
  size = "md",
}: {
  name?: string | null;
  url?: string | null;
  size?: keyof typeof sizes;
}) {
  if (url) {
    return (
      <img
        src={url}
        alt={name ?? "avatar"}
        className={`${sizes[size]} shrink-0 rounded-full object-cover ring-1 ring-line`}
      />
    );
  }
  return (
    <div
      className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-full bg-surface-2 font-medium text-ink-2 ring-1 ring-line`}
    >
      {initials(name)}
    </div>
  );
}
