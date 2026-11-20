import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-medium text-amber-300 shadow-lg border border-slate-700"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>Modo sin conexión · Menú guardado en caché</span>
    </div>
  );
};
