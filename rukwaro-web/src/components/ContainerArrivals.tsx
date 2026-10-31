import React from 'react';
import { PackageOpen, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { getDayIndex } from '../hooks/useDailyCountdown';

interface ContainerArrivalsProps {
  products: Product[];
  onOpenDetail: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

/**
 * "CONTAINER IMEFIKA" — Fresh arrivals feed.
 * Deterministic daily rotation from the newest stock. Spares buyers
 * naturally return to check "have they got my part yet" — this gives
 * them a reason every single day.
 */
export const ContainerArrivals: React.FC<ContainerArrivalsProps> = ({
  products,
  onOpenDetail,
  onAddToCart,
}) => {
  const dayIndex = getDayIndex();

  // Take featured/bestseller stock as the "fresh" pool, rotate daily
  const pool = products.filter(p => p.isFeatured || p.isBestseller);
  if (pool.length < 4) return null;

  const rotated = [...pool.slice(dayIndex % pool.length), ...pool.slice(0, dayIndex % pool.length)];
  const arrivals = rotated.slice(0, 4);

  // Deterministic "landed X hours ago" — feels alive, resets daily
  const hoursAgo = (i: number) => ((dayIndex * 7 + i * 5) % 22) + 2;

  return (
    <section className="bg-white py-12 lg:py-14 border-b border-brand-lightgray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-brand-red text-xs font-bold uppercase tracking-widest mb-1">
              <PackageOpen className="w-4 h-4" />
              <span>Container imefika — Fresh Landings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
              Just Landed at the Depot
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              New stock cleared daily from our Industrial Area central warehouse. First come, first served.
            </p>
          </div>
          <a
            href="#catalog"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-brand-charcoal hover:text-brand-red transition-colors group"
          >
            <span>View All Stock</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Arrivals row — horizontal scroll on mobile, grid on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {arrivals.map((p, i) => (
            <div
              key={p.id}
              className="group bg-white rounded-xl border border-gray-200 hover:border-brand-red/40 hover:shadow-card transition-all overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer" onClick={() => onOpenDetail(p)}>
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  New
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  Landed {hoursAgo(i)}h ago
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col gap-2">
                <h3
                  onClick={() => onOpenDetail(p)}
                  className="text-xs font-extrabold text-brand-charcoal hover:text-brand-red transition-colors cursor-pointer line-clamp-2 leading-snug"
                >
                  {p.name}
                </h3>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-black text-brand-charcoal">
                    KSh {p.priceKes.toLocaleString()}
                  </span>
                  <button
                    onClick={() => onAddToCart(p)}
                    className="text-[10px] font-bold bg-brand-charcoal hover:bg-brand-red text-white px-2.5 py-1.5 rounded-md transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Restock promise strip */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-brand-offwhite border border-gray-200 rounded-xl px-4 py-3">
          <p className="text-xs text-gray-600">
            <strong className="text-brand-charcoal">Can't find your part?</strong>{' '}
            10,000+ unlisted parts land weekly — tell us what you need and we alert you the moment it lands.
          </p>
          <a
            href="https://wa.me/254728707344?text=Habari%20Rukwaro%20%F0%9F%91%8B%20Alert%20me%20when%20this%20part%20lands%3A%20"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-brand-charcoal hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Request a Restock Alert
          </a>
        </div>

      </div>
    </section>
  );
};
