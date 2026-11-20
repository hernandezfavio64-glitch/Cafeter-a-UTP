/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AccountView } from './components/AccountView';
import { AuthModal } from './components/AuthModal';
import { BottomNav } from './components/BottomNav';
import { CartView } from './components/CartView';
import { CouponsVotingView } from './components/CouponsVotingView';
import { HomeView } from './components/HomeView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Toast, ToastData } from './components/Toast';
import { TopBar } from './components/TopBar';
import { CAMPUS_BUILDINGS, WEDNESDAY_VOTE_OPTIONS } from './data/menuData';
import {
  AppTab,
  CartItem,
  DeliveryMode,
  OrderRecord,
  PointsMovement,
  Product,
  UserAccount,
} from './types/cafeteria';

const LS_KEYS = {
  accounts: 'utp_veraguas_accounts_v1',
  activeEmail: 'utp_veraguas_active_email_v1',
  cart: 'utp_veraguas_cart_v1',
  delivery: 'utp_veraguas_delivery_v1',
  votes: 'utp_veraguas_votes_v1',
  userVote: 'utp_veraguas_user_vote_v1',
};

function safeReadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('inicio');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authReason, setAuthReason] = useState<string | undefined>(undefined);
  const [toast, setToast] = useState<ToastData | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  // Persisted accounts & active session
  const [accounts, setAccounts] = useState<Record<string, UserAccount>>(() =>
    safeReadJSON<Record<string, UserAccount>>(LS_KEYS.accounts, {})
  );
  const [activeEmail, setActiveEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LS_KEYS.activeEmail);
    } catch {
      return null;
    }
  });

  // Persisted cart
  const [cart, setCart] = useState<CartItem[]>(() =>
    safeReadJSON<CartItem[]>(LS_KEYS.cart, [])
  );

  // Persisted delivery preference
  const [deliveryState, setDeliveryState] = useState<{
    mode: DeliveryMode;
    location: string;
  }>(() =>
    safeReadJSON(LS_KEYS.delivery, {
      mode: 'pickup',
      location: 'Cafetería Central · Retiro en Barra',
    })
  );

  // Persisted Wednesday voting
  const [votes, setVotes] = useState<Record<string, number>>(() => {
    const defaults: Record<string, number> = {};
    WEDNESDAY_VOTE_OPTIONS.forEach((o) => {
      defaults[o.id] = o.initialVotes;
    });
    return safeReadJSON<Record<string, number>>(LS_KEYS.votes, defaults);
  });
  const [userVotedId, setUserVotedId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LS_KEYS.userVote);
    } catch {
      return null;
    }
  });

  const currentUser: UserAccount | null = useMemo(() => {
    if (!activeEmail) return null;
    return accounts[activeEmail] ?? null;
  }, [accounts, activeEmail]);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEYS.accounts, JSON.stringify(accounts));
    } catch {
      // Ignore storage quota errors
    }
  }, [accounts]);

  useEffect(() => {
    try {
      if (activeEmail) {
        localStorage.setItem(LS_KEYS.activeEmail, activeEmail);
      } else {
        localStorage.removeItem(LS_KEYS.activeEmail);
      }
    } catch {
      // Ignore storage errors
    }
  }, [activeEmail]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEYS.cart, JSON.stringify(cart));
    } catch {
      // Ignore storage errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEYS.delivery, JSON.stringify(deliveryState));
    } catch {
      // Ignore storage errors
    }
  }, [deliveryState]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEYS.votes, JSON.stringify(votes));
    } catch {
      // Ignore storage errors
    }
  }, [votes]);

  useEffect(() => {
    try {
      if (userVotedId) {
        localStorage.setItem(LS_KEYS.userVote, userVotedId);
      } else {
        localStorage.removeItem(LS_KEYS.userVote);
      }
    } catch {
      // Ignore storage errors
    }
  }, [userVotedId]);

  const showToast = (
    message: string,
    type: ToastData['type'] = 'success',
    actionLabel?: string,
    onAction?: () => void
  ) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({
      id: Date.now(),
      message,
      type,
      actionLabel,
      onAction,
    });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, 3600);
  };

  const handleOpenAuth = (reason?: string) => {
    setAuthReason(reason);
    setIsAuthOpen(true);
  };

  const handleAuthenticate = (payload: {
    name: string;
    email: string;
    faculty: string;
    defaultBuilding: string;
  }) => {
    const existing = accounts[payload.email];
    if (!existing) {
      const newUser: UserAccount = {
        name: payload.name,
        email: payload.email,
        faculty: payload.faculty,
        defaultBuilding: payload.defaultBuilding || CAMPUS_BUILDINGS[0],
        pointsBalance: 0,
        orders: [],
        movements: [],
      };
      setAccounts((prev) => ({
        ...prev,
        [payload.email]: newUser,
      }));
      showToast(`Bienvenido a UTP Café, ${newUser.name}`);
    } else {
      showToast(`Sesión iniciada como ${existing.name}`);
    }

    setActiveEmail(payload.email);
    setIsAuthOpen(false);
    setAuthReason(undefined);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    // Validación: no permitir agregar al carrito si no hay sesión iniciada
    if (!currentUser) {
      setSelectedProduct(null);
      handleOpenAuth('Inicia sesión con tu correo para agregar productos a tu pedido.');
      showToast('Inicia sesión para agregar pedidos al carrito', 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    setSelectedProduct(null);
    showToast(
      `Agregado: ${quantity}x ${product.name}`,
      'success',
      'Ver Pedido',
      () => setActiveTab('pedido')
    );
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Producto eliminado del pedido', 'info');
  };

  const handleConfirmOrder = (useDiscount: boolean): OrderRecord | null => {
    if (!currentUser || cart.length === 0) return null;

    const subtotal = Number(
      cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)
    );
    const discountApplied =
      useDiscount && currentUser.pointsBalance > 0
        ? Number(Math.min(currentUser.pointsBalance, subtotal).toFixed(2))
        : 0;
    const totalPaid = Number(Math.max(0, subtotal - discountApplied).toFixed(2));
    // 10% del total de la compra = puntos equivalentes a dinero (1 punto = B/. 1.00)
    const pointsEarned = Number((totalPaid * 0.1).toFixed(2));

    const orderNumber = `UTP-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowLabel = new Date().toLocaleString('es-PA', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newOrder: OrderRecord = {
      id: orderNumber,
      date: nowLabel,
      items: cart.map((c) => ({
        productId: c.product.id,
        name: c.product.name,
        quantity: c.quantity,
        unitPrice: c.product.price,
        subtotal: Number((c.product.price * c.quantity).toFixed(2)),
      })),
      subtotal,
      discountApplied,
      totalPaid,
      pointsEarned,
      deliveryMode: deliveryState.mode,
      deliveryLocation: deliveryState.location,
      status: 'Enviado a cocina',
    };

    const newMovements: PointsMovement[] = [...currentUser.movements];
    let runningBalance = currentUser.pointsBalance;

    if (discountApplied > 0) {
      runningBalance = Number(Math.max(0, runningBalance - discountApplied).toFixed(2));
      newMovements.unshift({
        id: `mov-red-${Date.now()}`,
        date: nowLabel,
        description: `Canje de descuento · Orden #${orderNumber}`,
        amount: -discountApplied,
        balanceAfter: runningBalance,
      });
    }

    if (pointsEarned > 0) {
      runningBalance = Number((runningBalance + pointsEarned).toFixed(2));
      newMovements.unshift({
        id: `mov-earn-${Date.now() + 1}`,
        date: nowLabel,
        description: `Compra 10% · Orden #${orderNumber}`,
        amount: pointsEarned,
        balanceAfter: runningBalance,
      });
    }

    setAccounts((prev) => ({
      ...prev,
      [currentUser.email]: {
        ...currentUser,
        pointsBalance: runningBalance,
        orders: [newOrder, ...currentUser.orders],
        movements: newMovements,
      },
    }));

    setCart([]);
    showToast(`Pedido #${orderNumber} enviado a la cafetería`, 'success');
    return newOrder;
  };

  const handleVote = (optionId: string) => {
    setVotes((prev) => {
      const updated = { ...prev };
      if (userVotedId && userVotedId !== optionId) {
        updated[userVotedId] = Math.max(0, (updated[userVotedId] ?? 1) - 1);
      }
      if (userVotedId !== optionId) {
        updated[optionId] = (updated[optionId] ?? 0) + 1;
      }
      return updated;
    });

    if (userVotedId !== optionId) {
      setUserVotedId(optionId);
      const dish = WEDNESDAY_VOTE_OPTIONS.find((o) => o.id === optionId);
      showToast(`Voto registrado para ${dish?.name ?? 'tu plato'}`);
    } else {
      showToast('Ya tienes seleccionado este plato para el miércoles', 'info');
    }
  };

  const handleUpdateProfile = (updates: {
    name: string;
    faculty: string;
    defaultBuilding: string;
  }) => {
    if (!currentUser) return;
    setAccounts((prev) => ({
      ...prev,
      [currentUser.email]: {
        ...currentUser,
        ...updates,
      },
    }));
    showToast('Perfil actualizado correctamente');
  };

  const handleLogout = () => {
    setActiveEmail(null);
    showToast('Sesión cerrada correctamente', 'info');
  };

  const totalCartItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const handleSelectTab = (tab: AppTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <TopBar
        deliveryMode={deliveryState.mode}
        deliveryLocation={deliveryState.location}
        onChangeDelivery={(mode, location) => {
          setDeliveryState({ mode, location });
          showToast(
            mode === 'pickup'
              ? 'Modo: Retirar en barra de Cafetería'
              : `Entrega en: ${location}`,
            'info'
          );
        }}
        user={currentUser}
        onOpenAuthOrAccount={() => {
          if (currentUser) {
            handleSelectTab('cuenta');
          } else {
            handleOpenAuth();
          }
        }}
        onGoHome={() => handleSelectTab('inicio')}
      />

      <OfflineIndicator />

      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 pt-5 pb-24">
        {activeTab === 'inicio' && (
          <HomeView
            onSelectProduct={(product) => setSelectedProduct(product)}
            onGoToVoting={() => handleSelectTab('cupones')}
            userPoints={currentUser ? currentUser.pointsBalance : null}
          />
        )}

        {activeTab === 'cupones' && (
          <CouponsVotingView
            user={currentUser}
            votes={votes}
            userVotedId={userVotedId}
            onVote={handleVote}
            onGoToCart={() => handleSelectTab('pedido')}
            onOpenAuth={() => handleOpenAuth('Inicia sesión para acumular y canjear tus puntos.')}
          />
        )}

        {activeTab === 'pedido' && (
          <CartView
            cart={cart}
            user={currentUser}
            deliveryMode={deliveryState.mode}
            deliveryLocation={deliveryState.location}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onConfirmOrder={handleConfirmOrder}
            onGoHome={() => handleSelectTab('inicio')}
            onOpenAuth={() =>
              handleOpenAuth('Inicia sesión con tu correo para confirmar tu pedido.')
            }
          />
        )}

        {activeTab === 'cuenta' && (
          <AccountView
            user={currentUser}
            onOpenAuth={() => handleOpenAuth()}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
          />
        )}
      </main>

      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        cartCount={totalCartItems}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setAuthReason(undefined);
        }}
        onAuthenticate={handleAuthenticate}
        promptReason={authReason}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
