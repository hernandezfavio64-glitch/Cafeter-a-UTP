import React, { useMemo, useRef, useState } from 'react';
import { ChevronRight, Search, Vote, X } from 'lucide-react';
import { CATEGORIES, MENU_PRODUCTS } from '../data/menuData';
import { CategoryId, Product } from '../types/cafeteria';
import { ProductImage } from './ProductImage';

interface HomeViewProps {
  onSelectProduct: (product: Product) => void;
  onGoToVoting: () => void;
  userPoints: number | null;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectProduct,
  onGoToVoting,
  userPoints,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('promociones');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) return null;
    return MENU_PRODUCTS.filter(
      (item) =>
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        item.categoryLabel.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const scrollToCategory = (catId: CategoryId) => {
    setActiveCategory(catId);
    const el = sectionRefs.current[catId];
    if (el) {
      const yOffset = -112;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-7 pb-6">
      {/* Institutional Hero Focal Point */}
      <section className="relative overflow-hidden rounded-3xl bg-purple-700 text-white shadow-sm">
        <div className="grid md:grid-cols-12 items-stretch">
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-5">
            <div className="space-y-2.5">
              <p className="text-xs font-semibold tracking-wide text-amber-300">
                Universidad Tecnológica de Panamá · Sede Veraguas
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-balance">
                Almuerzos frescos, ensaladas y pedidos sin filas.
              </h1>
              <p className="text-sm text-purple-100 leading-relaxed max-w-xl">
                Acumula el 10% de cada compra en puntos canjeables (1 punto = B/. 1.00) y vota cada semana por el menú especial de los miércoles.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToCategory('promociones')}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                Ver Promociones
              </button>
              <button
                type="button"
                onClick={onGoToVoting}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-purple-800/80 hover:bg-purple-900 border border-purple-500/40 text-white font-semibold text-sm inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Vote className="w-4 h-4 text-amber-300" />
                <span>Miércoles Novedosos</span>
              </button>
              {userPoints !== null && (
                <span className="font-mono-num text-xs font-semibold text-amber-200 ml-auto sm:ml-1">
                  Saldo: {userPoints.toFixed(2)} pts
                </span>
              )}
            </div>
          </div>

          <div className="hidden md:block md:col-span-5 relative min-h-[220px]">
            <ProductImage
              src="/src/assets/images/salad_tropical_mango_1795058435891.jpg"
              alt="Ensalada fresca de temporada en Cafetería UTP Veraguas"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-purple-700/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* Search & Quick Category Jump */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar ensaladas, almuerzos, bebidas..."
            aria-label="Buscar en el menú"
            className="w-full min-h-[46px] pl-10 pr-10 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 transition-shadow"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {!normalizedQuery && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => scrollToCategory(cat.id)}
                  className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50'
                  }`}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Search Results OR 8 Horizontal Scrollable Sections */}
      {filteredProducts ? (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Resultados para “{searchQuery}”
            </h2>
            <span className="font-mono-num text-xs text-slate-500">
              {filteredProducts.length} platos
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center">
              <p className="text-sm font-semibold text-slate-800">
                No encontramos platos que coincidan con tu búsqueda.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Prueba buscando “ensalada”, “arroz”, “combo” o “maracuyá”.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-4 min-h-[40px] px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800 transition-colors cursor-pointer"
              >
                Ver todo el menú
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  fullWidth
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="space-y-8">
          {CATEGORIES.map((category) => {
            const items = MENU_PRODUCTS.filter((p) => p.category === category.id);
            return (
              <section
                key={category.id}
                ref={(el) => {
                  sectionRefs.current[category.id] = el;
                }}
                aria-labelledby={`heading-${category.id}`}
                className="space-y-3"
              >
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2
                      id={`heading-${category.id}`}
                      className="font-display text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
                    >
                      {category.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">{category.subtitle}</p>
                  </div>
                  <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-purple-700 whitespace-nowrap shrink-0">
                    <span>Desliza</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Horizontal Scrollable Carousel */}
                <div className="flex gap-3.5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
                  {items.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={onSelectProduct}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  fullWidth?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  fullWidth = false,
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className={`group text-left rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400 hover:-translate-y-0.5 transition-all duration-150 overflow-hidden flex flex-col cursor-pointer shadow-xs ${
        fullWidth ? 'w-full' : 'w-[216px] sm:w-[238px] shrink-0 snap-start'
      }`}
    >
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
        />
        {product.tag && (
          <span className="absolute top-2.5 left-2.5 rounded-lg bg-purple-700/95 px-2 py-0.5 text-[11px] font-bold text-amber-300 shadow-xs">
            {product.tag}
          </span>
        )}
      </div>

      <div className="p-3.5 flex-1 flex flex-col justify-between gap-2 w-full">
        <div>
          <p className="text-[11px] font-medium text-slate-500">
            {product.prepMinutes} min · {product.calories} kcal
          </p>
          <h3 className="font-display text-sm font-bold text-slate-900 leading-snug mt-0.5 line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono-num text-sm font-bold text-purple-700">
              B/. {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="font-mono-num text-xs text-slate-400 line-through">
                B/. {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-amber-700 group-hover:text-purple-700 transition-colors">
            Ver +
          </span>
        </div>
      </div>
    </button>
  );
};
