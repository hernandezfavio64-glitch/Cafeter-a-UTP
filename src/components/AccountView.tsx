import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  History,
  LogOut,
  Settings,
  ShoppingBag,
  Ticket,
  User,
} from 'lucide-react';
import { CAMPUS_BUILDINGS } from '../data/menuData';
import { UserAccount } from '../types/cafeteria';

interface AccountViewProps {
  user: UserAccount | null;
  onOpenAuth: () => void;
  onUpdateProfile: (updates: {
    name: string;
    faculty: string;
    defaultBuilding: string;
  }) => void;
  onLogout: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  user,
  onOpenAuth,
  onUpdateProfile,
  onLogout,
}) => {
  const [activeTool, setActiveTool] = useState<'history' | 'settings'>('history');
  const [historyFilter, setHistoryFilter] = useState<'orders' | 'movements'>('orders');

  const [editName, setEditName] = useState(user?.name ?? '');
  const [editFaculty, setEditFaculty] = useState(
    user?.faculty ?? 'Ingeniería en Sistemas Computacionales'
  );
  const [editBuilding, setEditBuilding] = useState(
    user?.defaultBuilding ?? CAMPUS_BUILDINGS[0]
  );
  const [savedNotice, setSavedNotice] = useState(false);

  if (!user) {
    return (
      <div className="max-w-lg mx-auto py-6">
        <div className="rounded-3xl bg-white border border-slate-200 p-8 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-purple-700 flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h1 className="font-display text-2xl font-extrabold text-slate-900">
              Mi Cuenta UTP
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Regístrate o inicia sesión con tu correo electrónico para guardar tus pedidos, acumular el 10% en puntos y votar en los Miércoles Novedosos.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-full min-h-[48px] rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            Iniciar Sesión o Registrarme
          </button>
        </div>
      </div>
    );
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim().length < 2) return;
    onUpdateProfile({
      name: editName.trim(),
      faculty: editFaculty,
      defaultBuilding: editBuilding,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Profile Header Card */}
      <section className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-700 text-amber-300 font-display font-extrabold text-xl flex items-center justify-center shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-xl font-bold text-slate-900 truncate">
                {user.name}
              </h1>
              <p className="text-xs text-slate-500 truncate">
                {user.email} · {user.faculty}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                Punto frecuente: {user.defaultBuilding}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div>
              <p className="text-[11px] font-medium text-slate-500">Puntos acumulados</p>
              <p className="font-mono-num text-xl font-extrabold text-purple-700">
                {user.pointsBalance.toFixed(2)} pts
              </p>
              <p className="font-mono-num text-[11px] text-amber-700 font-semibold">
                Equivale a B/. {user.pointsBalance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Tool Buttons: Configuración, Historial, Cerrar Sesión */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTool('history')}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTool === 'history'
                ? 'bg-purple-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <History className="w-4 h-4 shrink-0" />
            <span>Historial</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditName(user.name);
              setEditFaculty(user.faculty);
              setEditBuilding(user.defaultBuilding);
              setActiveTool('settings');
            }}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTool === 'settings'
                ? 'bg-purple-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Configuración</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </section>

      {/* Active Tool Area */}
      {activeTool === 'history' ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Actividad de tu cuenta
            </h2>
            <div className="inline-flex p-1 bg-slate-200/70 rounded-xl">
              <button
                type="button"
                onClick={() => setHistoryFilter('orders')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  historyFilter === 'orders'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pedidos ({user.orders.length})
              </button>
              <button
                type="button"
                onClick={() => setHistoryFilter('movements')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  historyFilter === 'movements'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Puntos ({user.movements.length})
              </button>
            </div>
          </div>

          {historyFilter === 'orders' ? (
            user.orders.length === 0 ? (
              <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center space-y-2">
                <ShoppingBag className="w-7 h-7 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-800">
                  Sin pedidos realizados todavía
                </p>
                <p className="text-xs text-slate-500">
                  Tus compras aparecerán aquí con su detalle de puntos acumulados.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {user.orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl bg-white border border-slate-200 p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-display text-sm font-bold text-slate-900">
                          Orden #{order.id}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.date} ·{' '}
                          {order.deliveryMode === 'pickup'
                            ? 'Retiro en Barra'
                            : order.deliveryLocation}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700">
                        {order.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(' · ')}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-mono-num font-bold text-amber-700">
                        +{order.pointsEarned.toFixed(2)} pts ganados
                        {order.discountApplied > 0 &&
                          ` · Canjeó B/. ${order.discountApplied.toFixed(2)}`}
                      </span>
                      <span className="font-mono-num font-bold text-sm text-purple-700">
                        B/. {order.totalPaid.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : user.movements.length === 0 ? (
            <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center space-y-2">
              <Ticket className="w-7 h-7 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">
                Aún no hay movimientos de puntos
              </p>
              <p className="text-xs text-slate-500">
                Cada compra suma automáticamente el 10% en puntos canjeables.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100">
              {user.movements.map((mov) => {
                const isCredit = mov.amount >= 0;
                return (
                  <div
                    key={mov.id}
                    className="p-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isCredit
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {isCredit ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {mov.description}
                        </p>
                        <p className="text-xs text-slate-500">{mov.date}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={`font-mono-num text-sm font-bold ${
                          isCredit ? 'text-emerald-700' : 'text-purple-700'
                        }`}
                      >
                        {isCredit ? '+' : ''}
                        {mov.amount.toFixed(2)} pts
                      </p>
                      <p className="font-mono-num text-[11px] text-slate-400">
                        Saldo: {mov.balanceAfter.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        <section className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs">
          <h2 className="font-display text-lg font-bold text-slate-900 mb-4">
            Configuración de perfil
          </h2>
          <form onSubmit={handleSaveSettings} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Facultad / Carrera
              </label>
              <select
                value={editFaculty}
                onChange={(e) => setEditFaculty(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
              >
                <option>Ingeniería en Sistemas Computacionales</option>
                <option>Ingeniería Civil</option>
                <option>Ingeniería Industrial</option>
                <option>Ingeniería Mecánica</option>
                <option>Ingeniería Eléctrica</option>
                <option>Ciencias y Tecnología / Docente</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Edificio predeterminado de entrega
              </label>
              <select
                value={editBuilding}
                onChange={(e) => setEditBuilding(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
              >
                {CAMPUS_BUILDINGS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Guardar cambios
              </button>
              {savedNotice && (
                <span className="text-xs font-semibold text-emerald-700">
                  Cambios guardados correctamente
                </span>
              )}
            </div>
          </form>
        </section>
      )}
    </div>
  );
};
