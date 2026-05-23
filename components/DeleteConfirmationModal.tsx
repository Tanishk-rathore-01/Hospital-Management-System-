import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  itemLabel?: string;
  confirmLabel?: string;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmationModal({
  isOpen,
  title,
  description,
  itemLabel,
  confirmLabel = 'Delete',
  isDeleting = false,
  onCancel,
  onConfirm,
}: DeleteConfirmationModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isDeleting) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDeleting, isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirmation-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onCancel();
        }
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-700/80 bg-[#101d21] text-slate-100 shadow-2xl">
        <div className="flex items-start gap-4 border-b border-slate-700/70 p-5">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-rose-400/12 text-rose-300">
            <AlertTriangle className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="delete-confirmation-title" className="text-base font-bold text-slate-50">
              {title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close delete confirmation"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {itemLabel && (
          <div className="mx-5 mt-5 rounded-xl border border-slate-700/70 bg-[#071214]/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Selected item</p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-100">{itemLabel}</p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition-colors hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
