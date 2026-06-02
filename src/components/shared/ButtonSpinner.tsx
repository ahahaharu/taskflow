import { Loader2 } from "lucide-react";

/**
 * Tiny inline spinner for use inside buttons during a pending mutation.
 * Inherits color from the parent (currentColor) and is sized to sit next to
 * button text without shifting layout.
 */
export function ButtonSpinner({ size = 14 }: { size?: number }) {
  return <Loader2 size={size} strokeWidth={2.25} className="animate-spin" />;
}
