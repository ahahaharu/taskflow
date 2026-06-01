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
  lg: "h-16 w-16 text-lg",
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
        className={`${sizes[size]} shrink-0 rounded-full object-cover`}
      />
    );
  }
  return (
    <div
      className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-full bg-slate-300 font-medium text-slate-700`}
    >
      {initials(name)}
    </div>
  );
}
