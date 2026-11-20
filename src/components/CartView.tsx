import React, { useState } from 'react';
import {
  CheckCircle2,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Store,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { CartItem, DeliveryMode, OrderRecord, UserAccount } from '../types/cafeteria';
import { ProductImage } from './ProductImage';

interface CartViewProps {
  cart: CartItem[];
  user: UserAccount | null;
  deliveryMode: DeliveryMode;
  deliveryLocation: string;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onConfirmOrder: (useDiscount: boolean) => OrderRecord | null;
  onGoHome: () => void;
  onOpenAuth: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  user,
  deliveryMode,
  deliveryLocation,
  onUpdateQuantity,
  onRemoveItem,
  onConfirmOrder,
  onGoHome,
  onOpenAuth,
}) => {
  const [useDiscount, setUseDiscount] = useState(false);
  const [emptyAlert, setEmptyAlert] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  const subtotal = Number(
    cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)
  );
  const availablePoints = user?.pointsBalance ?? 0;

  // Discount applied when redeemed (up to cart subtotal)
  const discountApplied =
    useDiscount && availablePoints > 0 ? Number(Math.min(availablePoints, subtotal).toFixed(2)) : 0;

  const totalToPay = Number(Math.max(0, subtotal - discountApplied).toFixed(2));

  // 10% of purchase total becomes accumulated points (1.00 pt = B/. 1.00)
  const pointsEarnedThisOrder = Number((totalToPay * 0.1).toFixed(2));

  // Potential discount percentage if accumulated points were used on this order
  const accumulatedDiscountPercent =
    subtotal > 0 ? Math.min(100, (availablePoints / subtotal) * 100) : 0;

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      setEmptyAlert(true);
      return;
    }
    if (!user) {
      onOpenAuth();
      return;
    }
    const order = onConfirmOrder(useDiscount);
    if (order) {
      setConfirmedOrder(order);
      setUseDiscount(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-lg mx-auto py-4">
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-bold text-purple-700">
              Pedido enviado a Cafetería UTP Veraguas
            </p>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">
              Orden #{confirmedOrder.id}
            </h1>
            <p className="text-sm text-slate-600">
              {confirmedOrder.deliveryMode === 'pickup'
                ? 'Tu pedido se está preparando para retiro en barra.'
                : `Tu pedido será enviado a: ${confirmedOrder.deliveryLocation}`}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left space-y-2.5 text-sm">
            {confirmedOrder.items.map((item) => (
              <div key={item.productId} className="flex justify-between gap-2">
                <span className="text-slate-700">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-mono-num font-semibold text-slate-900">
                  B/. {item.subtotal.toFixed(2)}
                </span>
              </div>
            ))}
            <div className="pt-2.5 border-t border-slate-200 space-y-1">
              {confirmedOrder.discountApplied > 0 && (
                <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                  <span>Descuento de puntos aplicado</span>
                  <span className="font-mono-num">
                    - B/. {confirmedOrder.discountApplied.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-900">
                <span>Total pagado</span>
                <span className="font-mono-num text-purple-700">
                  B/. {confirmedOrder.totalPaid.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-amber-800 font-semibold pt-1">
                <span>Puntos acumulados en esta compra (10%)</span>
                <span className="font-mono-num">
                  +{confirmedOrder.pointsEarned.toFixed(2)} pts
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setConfirmedOrder(null);
              onGoHome();
            }}
            className="w-full min-h-[48px] rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            Volver al menú principal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
          Mi Pedido
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Revisa tus productos, aplica tus puntos acumulados y confirma tu orden.
        </p>
      </div>

      {/* Delivery mode banner */}
      <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-purple-700 flex items-center justify-center shrink-0">
            {deliveryMode === 'pickup' ? (
              <Store className="w-4 h-4" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Modalidad seleccionada</p>
            <p className="text-sm font-bold text-slate-900 truncate">
              {deliveryMode === 'pickup'
                ? 'Retirar en Cafetería Central'
                : `Enviar a · ${deliveryLocation}`}
            </p>
          </div>
        </div>
      </div>

      {emptyAlert && cart.length === 0 && (
        <div
          role="alert"
          className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-3 text-sm text-red-800"
        >
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span>Tu carrito está vacío. Agrega al menos un producto antes de confirmar.</span>
        </div>
      )}

      {cart.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-purple-700 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Aún no tienes productos en tu pedido
            </h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Explora nuestras ensaladas en promoción, almuerzos panameños y bebidas frescas para iniciar.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoHome}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            Explorar el menú
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-7 space-y-3">
            {cart.map(({ product, quantity }) => {
              const lineSubtotal = product.price * quantity;
              return (
                <div
                  key={product.id}
                  className="rounded-2xl bg-white border border-slate-200 p-3.5 sm:p-4 flex items-center gap-3.5"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer shrink-0"
                        aria-label={`Eliminar ${product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="font-mono-num text-xs text-slate-500">
                      Unitario: B/. {product.price.toFixed(2)}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-700 hover:text-purple-700 cursor-pointer"
                          aria-label={`Reducir cantidad de ${product.name}`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono-num w-7 text-center text-xs font-bold text-slate-900">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-700 hover:text-purple-700 cursor-pointer"
                          aria-label={`Aumentar cantidad de ${product.name}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-mono-num text-sm font-bold text-purple-700">
                        B/. {lineSubtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Points & Checkout Summary */}
          <div className="lg:col-span-5 space-y-4">
            {/* Points System Panel */}
            <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-4 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-display text-base font-bold text-slate-900">
                    Resumen y Puntos UTP
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    1.00 punto = B/. 1.00 de descuento directo
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              </div>

              {/* Historical Points + Earn Indicator */}
              <div className="rounded-2xl bg-amber-50/90 border border-amber-200 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-amber-950">
                    Tu acumulado histórico:
                  </span>
                  <span className="font-mono-num font-bold text-purple-800">
                    {availablePoints.toFixed(2)} pts (B/. {availablePoints.toFixed(2)})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-amber-950">
                    Ganarás en esta compra (10%):
                  </span>
                  <span className="font-mono-num font-bold text-emerald-700">
                    +{pointsEarnedThisOrder.toFixed(2)} pts (B/. {pointsEarnedThisOrder.toFixed(2)})
                  </span>
                </div>
                {availablePoints > 0 && (
                  <p className="text-[11px] text-amber-900/80 pt-1 border-t border-amber-200/70">
                    {useDiscount
                      ? `Aplicando ${accumulatedDiscountPercent.toFixed(1)}% de descuento equivalente en este pedido.`
                      : `Equivale a ${accumulatedDiscountPercent.toFixed(1)}% de descuento. Si no lo usas ahora, tus puntos se siguen sumando.`}
                  </p>
                )}
              </div>

              {/* Redeem Button */}
              <button
                type="button"
                disabled={!user || availablePoints <= 0}
                onClick={() => setUseDiscount((prev) => !prev)}
                className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  useDiscount
                    ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-xs'
                    : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-amber-400 hover:bg-amber-50'
                }`}
              >
                {useDiscount
                  ? `Descuento acumulado aplicado (- B/. ${discountApplied.toFixed(2)}) · Toca para guardar puntos`
                  : availablePoints > 0
                    ? `Usar descuento acumulado (B/. ${availablePoints.toFixed(2)} disponible)`
                    : 'Usar descuento acumulado (0.00 pts disponibles)'}
              </button>

              {/* Totals */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal productos</span>
                  <span className="font-mono-num font-semibold text-slate-900">
                    B/. {subtotal.toFixed(2)}
                  </span>
                </div>
                {discountApplied > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Descuento por puntos</span>
                    <span className="font-mono-num">
                      - B/. {discountApplied.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                  <span className="font-display font-bold text-base text-slate-900">
                    Total a pagar
                  </span>
                  <span className="font-mono-num font-extrabold text-xl text-purple-700">
                    B/. {totalToPay.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckoutClick}
                className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-[0.99] text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
              >
                {user ? 'Confirmar Pedido' : 'Inicia sesión para Confirmar Pedido'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
