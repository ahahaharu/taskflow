import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/shared/Modal";
import { ButtonSpinner } from "@/components/shared/ButtonSpinner";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onClose,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-prio-high-bg text-prio-high-ink">
          <AlertTriangle size={18} strokeWidth={2} />
        </div>
        <p className="pt-1 text-sm text-ink-2">{message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onClose}
          disabled={loading}
          className="rounded-control px-4 py-2 text-sm text-ink-2 transition-colors duration-150 hover:bg-surface-2 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-control bg-danger px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-danger-hover disabled:opacity-50"
        >
          {loading && <ButtonSpinner />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
