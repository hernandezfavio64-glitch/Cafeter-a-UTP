import React, { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        aria-label="Instalar aplicación PWA"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Instalar App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Instalar</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Instalar en iPhone / iPad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                  aria-label="Cerrar guía"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ol className="space-y-2.5 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="font-mono-num font-bold text-purple-700">1.</span>
                  <span>
                    Toca el botón <strong className="inline-flex items-center gap-1 text-slate-900"><Share className="w-3.5 h-3.5" /> Compartir</strong> en la barra inferior de Safari.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono-num font-bold text-purple-700">2.</span>
                  <span>
                    Desliza hacia abajo y selecciona <strong className="text-slate-900">Agregar a inicio</strong>.
                  </span>
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full min-h-[44px] rounded-xl bg-purple-700 py-2.5 text-sm font-semibold text-white hover:bg-purple-800 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
