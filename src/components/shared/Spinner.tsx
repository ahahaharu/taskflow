export function Spinner({ fullScreen = false }: { fullScreen?: boolean }) {
  const wrapper = fullScreen
    ? "flex min-h-screen items-center justify-center"
    : "flex items-center justify-center py-12";
  return (
    <div className={wrapper}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
    </div>
  );
}
