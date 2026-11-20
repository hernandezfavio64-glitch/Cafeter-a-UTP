import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md transition-all duration-200"
    >
      <div
        className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-xl border ${
          isError
            ? 'bg-red-800 text-white border-red-900'
            : 'bg-slate-900 text-white border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {isError ? (
            <AlertCircle className="w-5 h-5 text-amber-300 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <p className="text-sm font-medium leading-snug truncate">{toast.message}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {toast.actionLabel && toast.onAction && (
            <button
              type="button"
              onClick={() => {
                toast.onAction?.();
                onDismiss();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-amber-400 text-slate-900 text-xs font-bold hover:bg-amber-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              {toast.actionLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
