import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex h-9 w-9 items-center justify-center rounded-control text-ink-2 transition-colors duration-150 hover:bg-surface-2 hover:text-ink"
    >
      {isDark ? (
        <Sun size={16} strokeWidth={2} />
      ) : (
        <Moon size={16} strokeWidth={2} />
      )}
    </button>
  );
}
