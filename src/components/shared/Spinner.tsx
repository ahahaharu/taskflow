export function Spinner({ fullScreen = false }: { fullScreen?: boolean }) {
  const wrapper = fullScreen
    ? "flex min-h-screen items-center justify-center bg-paper"
    : "flex items-center justify-center py-12";
  return (
    <div className={wrapper}>
      <div className="h-7 w-7 animate-spin rounded-full border-[2.5px] border-line border-t-accent" />
    </div>
  );
}
