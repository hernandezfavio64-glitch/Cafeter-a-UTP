import React, { useState, useEffect } from 'react';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { Product } from '../types/cafeteria';
import { ProductImage } from './ProductImage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product?.id]);

  if (!product) return null;

  const lineTotal = product.price * quantity;
  const estimatedPoints = lineTotal * 0.1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/55 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top image header */}
        <div className="relative aspect-4/3 w-full bg-slate-100 shrink-0">
          <ProductImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar detalle del producto"
          >
            <X className="w-5 h-5" />
          </button>
          {product.tag && (
            <span className="absolute bottom-3 left-3 rounded-lg bg-purple-700 px-2.5 py-1 text-xs font-bold text-amber-300 shadow-sm">
              {product.tag}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {product.categoryLabel} · {product.prepMinutes} min aprox. · {product.calories} kcal
            </p>
            <div className="flex items-start justify-between gap-3 mt-1">
              <h2
                id="product-modal-title"
                className="font-display text-xl font-bold text-slate-900 leading-snug"
              >
                {product.name}
              </h2>
              <div className="text-right shrink-0">
                <p className="font-mono-num text-lg font-bold text-purple-700">
                  B/. {product.price.toFixed(2)}
                </p>
                {product.originalPrice && (
                  <p className="font-mono-num text-xs text-slate-400 line-through">
                    B/. {product.originalPrice.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-500 mb-1.5">
              Ingredientes principales
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {product.ingredients.join(' · ')}
            </p>
          </div>

          <div className="rounded-2xl bg-amber-50/80 border border-amber-200/80 px-3.5 py-2.5 flex items-center justify-between text-xs">
            <span className="text-amber-950 font-medium">
              Puntos UTP estimados (10%)
            </span>
            <span className="font-mono-num font-bold text-purple-800">
              +{estimatedPoints.toFixed(2)} pts (B/. {estimatedPoints.toFixed(2)})
            </span>
          </div>
        </div>

        {/* Sticky purchase controls */}
        <div className="p-4 sm:px-6 bg-white border-t border-slate-200 flex items-center gap-3 shrink-0">
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 hover:text-purple-700 transition-colors cursor-pointer"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono-num w-8 text-center text-sm font-bold text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 hover:text-purple-700 transition-colors cursor-pointer"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onAddToCart(product, quantity)}
            className="flex-1 min-h-[48px] px-4 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span>Agregar pedido · B/. {lineTotal.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
