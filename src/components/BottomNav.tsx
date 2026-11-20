import React from 'react';
import { Home, Ticket, ShoppingBag, User } from 'lucide-react';
import { AppTab } from '../types/cafeteria';

interface BottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
}) => {
  const items: { id: AppTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: <Home className="w-[22px] h-[22px]" />,
    },
    {
      id: 'cupones',
      label: 'Cupones',
      icon: <Ticket className="w-[22px] h-[22px]" />,
    },
    {
      id: 'pedido',
      label: 'Mi Pedido',
      icon: <ShoppingBag className="w-[22px] h-[22px]" />,
      badge: cartCount,
    },
    {
      id: 'cuenta',
      label: 'Mi Cuenta',
      icon: <User className="w-[22px] h-[22px]" />,
    },
  ];

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe"
    >
      <div className="max-w-3xl mx-auto grid grid-cols-4 items-center h-16">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`relative min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
                isActive ? 'text-purple-700' : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative flex items-center justify-center">
                {item.icon}
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    aria-label={`${item.badge} productos en el carrito`}
                    className="font-mono-num absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-slate-900 border border-white text-[10px] font-bold flex items-center justify-center leading-none shadow-xs"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] tracking-tight whitespace-nowrap ${
                  isActive ? 'font-bold text-purple-700' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-purple-700" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
