import React, { useState } from 'react';
import { MapPin, Store, User, ChevronDown, Check, X } from 'lucide-react';
import { DeliveryMode, UserAccount } from '../types/cafeteria';
import { CAMPUS_BUILDINGS } from '../data/menuData';
import { PWAInstallButton } from './PWAInstallButton';

interface TopBarProps {
  deliveryMode: DeliveryMode;
  deliveryLocation: string;
  onChangeDelivery: (mode: DeliveryMode, location: string) => void;
  user: UserAccount | null;
  onOpenAuthOrAccount: () => void;
  onGoHome: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  deliveryMode,
  deliveryLocation,
  onChangeDelivery,
  user,
  onOpenAuthOrAccount,
  onGoHome,
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto h-full px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Zone */}
          <button
            type="button"
            onClick={onGoHome}
            className="min-h-[44px] flex items-center gap-2 text-left cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-700 flex items-center justify-center text-amber-300 font-display font-extrabold text-sm shadow-xs border border-purple-800">
              UTP
            </div>
            <span className="font-display font-bold text-sm sm:text-base tracking-tight text-slate-900 whitespace-nowrap">
              Cafetería Veraguas
            </span>
          </button>

          {/* Retirar o enviar selector */}
          <button
            type="button"
            onClick={() => setShowLocationModal(true)}
            className="min-h-[40px] max-w-[175px] sm:max-w-xs flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-xs font-medium text-slate-800 transition-colors cursor-pointer"
            aria-label="Seleccionar retirar o enviar pedido"
          >
            {deliveryMode === 'pickup' ? (
              <Store className="w-3.5 h-3.5 text-purple-700 shrink-0" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-purple-700 shrink-0" />
            )}
            <span className="truncate">
              {deliveryMode === 'pickup' ? 'Retirar en Barra' : `Enviar · ${deliveryLocation}`}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          </button>

          {/* Right actions: PWA install + User icon */}
          <div className="flex items-center gap-1.5 shrink-0">
            <PWAInstallButton />
            <button
              type="button"
              onClick={onOpenAuthOrAccount}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 px-2 sm:px-3 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              aria-label={user ? `Cuenta de ${user.name}` : 'Iniciar sesión o registrarse'}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                  user
                    ? 'bg-purple-700 text-white border-purple-800'
                    : 'bg-amber-100 text-purple-800 border-amber-300'
                }`}
              >
                {user ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <span className="hidden md:inline text-xs font-semibold text-slate-800 whitespace-nowrap">
                {user ? user.name.split(' ')[0] : 'Ingresar'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal Retirar o Enviar */}
      {showLocationModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/50 backdrop-blur-sm p-0 sm:p-4"
          onClick={() => setShowLocationModal(false)}
        >
          <div
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  ¿Cómo deseas tu pedido?
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Campus Centro Regional de Veraguas · UTP
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
                aria-label="Cerrar selector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segmented Mode Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-5">
              <button
                type="button"
                onClick={() => {
                  onChangeDelivery('pickup', 'Cafetería Central · Retiro en Barra');
                  setShowLocationModal(false);
                }}
                className={`min-h-[44px] flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  deliveryMode === 'pickup'
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Retirar</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onChangeDelivery(
                    'delivery',
                    deliveryMode === 'delivery'
                      ? deliveryLocation
                      : CAMPUS_BUILDINGS[0]
                  )
                }
                className={`min-h-[44px] flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  deliveryMode === 'delivery'
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Enviar en Campus</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-slate-500 mb-2">
                {deliveryMode === 'pickup'
                  ? 'Retiro directo sin filas en la cafetería o elige un punto de entrega:'
                  : 'Selecciona tu edificio o salón en el campus:'}
              </p>
              {CAMPUS_BUILDINGS.map((building) => {
                const isPickupRow = building.includes('Retiro');
                const isSelected =
                  (isPickupRow && deliveryMode === 'pickup') ||
                  (!isPickupRow &&
                    deliveryMode === 'delivery' &&
                    deliveryLocation === building);
                return (
                  <button
                    key={building}
                    type="button"
                    onClick={() => {
                      onChangeDelivery(isPickupRow ? 'pickup' : 'delivery', building);
                      setShowLocationModal(false);
                    }}
                    className={`w-full min-h-[48px] flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-left text-sm transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 text-purple-900 font-semibold'
                        : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      {isPickupRow ? (
                        <Store className="w-4 h-4 text-purple-700 shrink-0" />
                      ) : (
                        <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <span className="truncate">{building}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-purple-700 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
