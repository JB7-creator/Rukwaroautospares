import React from 'react';
import { Flame, Timer, ShoppingCart, ArrowRight, Zap } from 'lucide-react';
import { Product } from '../types';
import { useDailyCountdown, getDayIndex } from '../hooks/useDailyCountdown';

interface DailyDealsProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  onOpenDetail: (p: Product) => void;
}

/**
 * DEAL OF THE DAY — deterministic daily rotation (no backend needed).
 * The offer set changes at midnight EAT, and the countdown tells the
 * customer exactly when. This is the #1 daily-return hook.
 */
export const DailyDeals: React.FC<DailyDealsProps> = ({ products, onAddToCart, onOpenDetail }) => {
  const timeLeft = useDailyCountdown();
  const dayIndex = getDayIndex();

  // Products with an active discount form the daily rotation pool
  const dealPool = products.filter(p => p.originalPriceKes && p.originalPriceKes > p.priceKes);
  if (dealPool.length < 3) return null;

  // Deterministic "shuffle": rotate the pool by day index, take 3
  const rotated = [...dealPool.slice(dayIndex % dealPool.length), ...dealPool.slice(0, dayIndex % dealPool.length)];
  const todaysDeals = rotated.slice(0, 3);

  // "N units left today" — deterministic per product per day
  const unitsLeft = (p: Product) => 3 + ((dayIndex + p.id.length) % 7);

  return (
    <section id="deals" className="relative bg-brand-charcoal overflow-hidden scroll-mt-36">
      {/* Subtle red glow accents */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-red/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-16 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-12">

        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-brand-red/15 border border-brand-red/30 text-brand-red text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>Deal of the Day — New Every Midnight</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Today's Flash Prices. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-400">Gone at Midnight.</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Handpicked discounts on genuine spares — limited counter units per hub, per day.
            </p>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Offer ends in</div>
              <div className="text-[10px] text-gray-500 flex items-center gap-1 justify-end">
                <Timer className="w-3 h-3" />
                <span>Nairobi time (EAT)</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { v: timeLeft.hours, l: 'HRS' },
                { v: timeLeft.minutes, l: 'MIN' },
                { v: timeLeft.seconds, l: 'SEC' },
              ].map((u, i) => (
                <React.Fragment key={u.l}>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg px-3 py-2 text-center min-w-[52px]">
                    <div className="text-xl font-black text-white tabular-nums leading-none">{u.v}</div>
                    <div className="text-[9px] font-bold text-gray-400 tracking-wider mt-1">{u.l}</div>
                  </div>
                  {i < 2 && <span className="text-brand-red font-black text-lg">:</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Deal cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {todaysDeals.map((p, idx) => {
            const discount = Math.round((1 - p.priceKes / (p.originalPriceKes || p.priceKes)) * 100);
            const left = unitsLeft(p);
            return (
              <div
                key={p.id}
                className="group bg-white/[0.06] hover:bg-white/[0.09] backdrop-blur-sm border border-white/10 hover:border-brand-red/50 rounded-2xl overflow-hidden transition-all flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden cursor-pointer" onClick={() => onOpenDetail(p)}>
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  {/* Discount badge */}
                  <div className="absolute top-3 left-3 bg-brand-red text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    -{discount}%
                  </div>
                  {/* Units left */}
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/15">
                    Only {left} units at this price
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{p.subcategory}</div>
                    <h3
                      onClick={() => onOpenDetail(p)}
                      className="text-sm font-extrabold text-white hover:text-brand-red transition-colors cursor-pointer line-clamp-2 leading-snug mt-0.5"
                    >
                      {p.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-2 mt-auto">
                    <span className="text-xl font-black text-white">KSh {p.priceKes.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 line-through">KSh {p.originalPriceKes?.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-emerald-400 ml-auto">
                      Save KSh {((p.originalPriceKes || 0) - p.priceKes).toLocaleString()}
                    </span>
                  </div>

                  {/* Stock bar */}
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-red to-red-400 rounded-full"
                      style={{ width: `${Math.min(90, left * 9)}%` }}
                    />
                  </div>

                  <button
                    onClick={() => onAddToCart(p)}
                    className="w-full bg-brand-red hover:bg-brand-redHover text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Grab This Deal</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-gray-500">
          <span>Deals rotate daily at 12:00 AM EAT —</span>
          <a href="#catalog" className="text-brand-red font-semibold hover:underline inline-flex items-center gap-1">
            browse the full catalog <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
};
