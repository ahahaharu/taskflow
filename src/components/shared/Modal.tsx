import type { ReactNode } from "react";
import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-card border border-line bg-card p-6 shadow-paper-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded p-1.5 text-ink-muted transition-colors duration-150 hover:bg-surface-2 hover:text-ink"
        >
          <X size={16} strokeWidth={2} />
        </button>
        {title && (
          <h2 className="mb-4 pr-8 text-base font-semibold text-ink">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
