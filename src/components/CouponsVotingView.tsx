import React from 'react';
import { Award, Check, Flame, Ticket, Vote } from 'lucide-react';
import { WEDNESDAY_VOTE_OPTIONS } from '../data/menuData';
import { UserAccount } from '../types/cafeteria';
import { ProductImage } from './ProductImage';

interface CouponsVotingViewProps {
  user: UserAccount | null;
  votes: Record<string, number>;
  userVotedId: string | null;
  onVote: (optionId: string) => void;
  onGoToCart: () => void;
  onOpenAuth: () => void;
}

export const CouponsVotingView: React.FC<CouponsVotingViewProps> = ({
  user,
  votes,
  userVotedId,
  onVote,
  onGoToCart,
  onOpenAuth,
}) => {
  const totalVotes = WEDNESDAY_VOTE_OPTIONS.reduce(
    (acc, opt) => acc + (votes[opt.id] ?? opt.initialVotes),
    0
  );

  const pointsBalance = user?.pointsBalance ?? 0;

  return (
    <div className="space-y-8 pb-6">
      {/* Section 1: Points & Coupons Wallet */}
      <section className="space-y-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
            Cupones y Puntos UTP
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Cada compra te devuelve el 10% en puntos canjeables directamente en tu pedido.
          </p>
        </div>

        <div className="rounded-3xl bg-purple-700 text-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300">
                <Ticket className="w-4 h-4" />
                <span>Saldo de descuento acumulado</span>
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono-num text-4xl font-extrabold tracking-tight text-white">
                  {pointsBalance.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-amber-300">
                  puntos (= B/. {pointsBalance.toFixed(2)})
                </span>
              </div>
              <p className="text-xs text-purple-100 max-w-md leading-relaxed">
                {user
                  ? 'Si decides no usar tus puntos hoy, seguirán acumulándose con tus próximas compras para obtener un mayor descuento.'
                  : 'Inicia sesión con tu correo universitario para acumular y canjear puntos en tus pedidos.'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {user ? (
                <button
                  type="button"
                  onClick={onGoToCart}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  Canjear en Mi Pedido
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-purple-600/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-purple-50">
              <Award className="w-4 h-4 text-amber-300 shrink-0" />
              <span>10% de cada compra se convierte en puntos</span>
            </div>
            <div className="flex items-center gap-2 text-purple-50">
              <span className="font-mono-num font-bold text-amber-300">1.00 pt</span>
              <span>Equivale exactamente a B/. 1.00 de descuento</span>
            </div>
            <div className="flex items-center gap-2 text-purple-50">
              <Flame className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Sin vencimiento durante el semestre</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Votaciones (Miércoles Novedosos) */}
      <section className="space-y-4" aria-labelledby="voting-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700">
              <Vote className="w-4 h-4" />
              <span>Participación Estudiantil · Veraguas</span>
            </div>
            <h2
              id="voting-heading"
              className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5"
            >
              Miércoles Novedosos: Elige el Menú Especial
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Vota por el plato fuera de menú que quieres disfrutar este miércoles en la cafetería.
            </p>
          </div>
          <span className="font-mono-num text-xs font-semibold text-slate-600 whitespace-nowrap">
            {totalVotes} votos registrados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WEDNESDAY_VOTE_OPTIONS.map((option) => {
            const count = votes[option.id] ?? option.initialVotes;
            const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            const isVoted = userVotedId === option.id;

            return (
              <article
                key={option.id}
                className={`rounded-2xl bg-white border overflow-hidden flex flex-col transition-all ${
                  isVoted
                    ? 'border-purple-600 ring-2 ring-purple-600/15'
                    : 'border-slate-200 hover:border-amber-400'
                }`}
              >
                <div className="relative aspect-4/3 w-full bg-slate-100">
                  <ProductImage
                    src={option.image}
                    alt={option.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2 text-white">
                    <div>
                      <p className="text-[11px] font-medium text-amber-300">
                        {option.subtitle}
                      </p>
                      <h3 className="font-display text-base font-bold leading-snug">
                        {option.name}
                      </h3>
                    </div>
                    <span className="font-mono-num text-sm font-bold text-amber-300 shrink-0">
                      B/. {option.estimatedPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {option.description}
                  </p>

                  <div className="space-y-3">
                    {/* Live Vote Progress */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono-num font-bold text-slate-900">
                          {count} votos
                        </span>
                        <span className="font-mono-num font-semibold text-purple-700">
                          {percentage}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isVoted ? 'bg-purple-700' : 'bg-amber-400'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onVote(option.id)}
                      className={`w-full min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        isVoted
                          ? 'bg-purple-700 text-white'
                          : 'bg-slate-900 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {isVoted ? (
                        <>
                          <Check className="w-4 h-4 text-amber-300" />
                          <span>Votado (Cambiar voto)</span>
                        </>
                      ) : (
                        <>
                          <Vote className="w-4 h-4 text-amber-300" />
                          <span>Votar por este plato</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
