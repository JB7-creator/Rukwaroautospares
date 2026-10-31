import React from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  MessageCircle,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Wrench,
  Plus
} from 'lucide-react';
import { Product, Vehicle, Branch } from '../types';
import { Star } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  selectedVehicle: Vehicle | null;
  onAddToCart: (p: Product) => void;
  currentBranch: Branch;
  relatedProducts?: Product[];
  onOpenDetail?: (p: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  selectedVehicle,
  onAddToCart,
  currentBranch,
  relatedProducts = [],
  onOpenDetail,
}) => {
  if (!product) return null;

  // Fitment confirmation — the #1 objection killer (research: Baymard)
  const fitsVehicle = selectedVehicle
    ? product.compatibleVehicles.some(code =>
        code.includes(selectedVehicle.chassisCode) ||
        selectedVehicle.chassisCode.includes(code) ||
        code.includes(selectedVehicle.model)
      )
    : null;

  const waMessage = encodeURIComponent(
    `Hello Rukwaro Autospares! I'm interested in ordering:
Part: ${product.name}
SKU: ${product.sku}
OEM No: ${product.oemPartNumber}
Price: KSh ${product.priceKes.toLocaleString()}
${selectedVehicle ? `Vehicle: ${selectedVehicle.years} ${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.chassisCode})` : 'Vehicle Chassis: _________'}
Pickup Hub: ${currentBranch.name}

Please confirm availability and booking!`
  );

  const waUrl = `https://wa.me/254728707344?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-elevated border border-gray-200 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          
          {/* Image & Badges */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className="bg-brand-red text-white text-xs font-black uppercase px-2.5 py-0.5 rounded shadow">
                  {product.grade}
                </span>
                {product.side && (
                  <span className="bg-black/80 text-white text-xs font-bold px-2.5 py-0.5 rounded">
                    {product.side}
                  </span>
                )}
              </div>
            </div>

            {/* Trust Points */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-200 text-xs">
              <div className="flex items-center gap-2 text-gray-700">
                <ShieldCheck className="w-4 h-4 text-brand-red shrink-0" />
                <span><strong>100% Genuine / Certified:</strong> 12-Month Defect Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Truck className="w-4 h-4 text-brand-red shrink-0" />
                <span><strong>Fast Dispatch:</strong> Same-day boda delivery in Nairobi</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <RotateCcw className="w-4 h-4 text-brand-red shrink-0" />
                <span><strong>Hassle-Free Returns:</strong> Easy exchange if chassis doesn't fit</span>
              </div>
            </div>
          </div>

          {/* Details & Specs */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-1">
                <span className="uppercase tracking-wider font-bold text-brand-red">{product.categoryName}</span>
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">SKU: {product.sku}</span>
              </div>

              <h2 className="text-xl font-black text-brand-charcoal leading-snug">
                {product.name}
              </h2>

              {/* Rating stars */}
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-brand-charcoal">{product.rating.toFixed(1)}</span>
                <span className="text-[11px] text-gray-400">({product.reviewsCount} verified reviews)</span>
              </div>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-black text-brand-charcoal">
                  KSh {product.priceKes.toLocaleString()}
                </span>
                {product.originalPriceKes && (
                  <span className="text-sm text-gray-400 line-through">
                    KSh {product.originalPriceKes.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Fitment Confirmation Banner — kills the #1 objection */}
              {selectedVehicle && fitsVehicle !== null && (
                <div className={`mt-3 p-2.5 rounded-lg text-xs font-semibold flex items-start gap-2 border ${
                  fitsVehicle
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  {fitsVehicle ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>✓ Fits your {selectedVehicle.years} {selectedVehicle.make} {selectedVehicle.model}.</strong>{' '}
                        Guaranteed bolt-on for chassis {selectedVehicle.chassisCode}. Wrong fit = free return.
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        Not confirmed for your {selectedVehicle.model}. Send your logbook/chassis photo on WhatsApp —
                        a specialist verifies fitment in minutes.
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* OEM Reference */}
              <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                <strong>OEM Reference Number:</strong> <span className="font-mono text-brand-charcoal font-bold">{product.oemPartNumber}</span>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Technical Specifications */}
              <div className="mt-4">
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                  Technical Specifications
                </h4>
                <div className="divide-y divide-gray-100 text-xs border border-gray-200 rounded-lg overflow-hidden">
                  {Object.entries(product.keySpecs).map(([key, val], idx) => (
                    <div key={idx} className="flex justify-between py-1.5 px-3 bg-white odd:bg-gray-50">
                      <span className="text-gray-500 font-medium">{key}</span>
                      <span className="text-brand-charcoal font-semibold text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multi-Branch Inventory Breakdown */}
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-red" />
                  <span>Real-Time Branch Stock</span>
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-2 rounded bg-white border border-gray-200">
                    <div className="font-bold text-gray-700">Kirinyaga Rd</div>
                    <div className={`font-black text-xs ${product.inStockBranches.kirinyagaRoad ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {product.inStockBranches.kirinyagaRoad ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-white border border-gray-200">
                    <div className="font-bold text-gray-700">Industrial Area</div>
                    <div className={`font-black text-xs ${product.inStockBranches.industrialArea ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {product.inStockBranches.industrialArea ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-white border border-gray-200">
                    <div className="font-bold text-gray-700">Westlands</div>
                    <div className={`font-black text-xs ${product.inStockBranches.westlands ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {product.inStockBranches.westlands ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="flex-1 bg-brand-charcoal hover:bg-black text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <ShoppingCart className="w-4 h-4 text-brand-red" />
                <span>Add to Cart & Checkout</span>
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order via WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

        {/* COMPLETE THE JOB — related parts (drives AOV, research: +38%) */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-100 bg-brand-offwhite px-6 sm:px-8 py-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black text-brand-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-brand-red" />
                <span>Complete the Job — Frequently Bought Together</span>
              </h4>
              <span className="text-[10px] text-gray-400">Mechanics pair these with this part</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relatedProducts.slice(0, 3).map(rp => (
                <button
                  key={rp.id}
                  onClick={() => onOpenDetail?.(rp)}
                  className="group flex items-center gap-2.5 bg-white border border-gray-200 hover:border-brand-red/40 rounded-lg p-2.5 text-left transition-all"
                >
                  <img
                    src={rp.image}
                    alt={rp.name}
                    loading="lazy"
                    className="w-12 h-12 rounded-md object-cover border border-gray-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-brand-charcoal line-clamp-2 leading-tight group-hover:text-brand-red transition-colors">
                      {rp.name}
                    </div>
                    <div className="text-xs font-black text-brand-red mt-0.5">
                      KSh {rp.priceKes.toLocaleString()}
                    </div>
                  </div>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(rp);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                        onAddToCart(rp);
                      }
                    }}
                    className="ml-auto shrink-0 bg-brand-charcoal hover:bg-brand-red text-white p-1.5 rounded-md transition-colors"
                    title={`Add ${rp.name} to cart`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
