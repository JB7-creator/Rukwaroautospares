import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  ShoppingCart, 
  MessageCircle, 
  MapPin, 
  Star, 
  ExternalLink 
} from 'lucide-react';
import { Product, Vehicle, Branch } from '../types';

interface ProductCardProps {
  product: Product;
  selectedVehicle: Vehicle | null;
  onAddToCart: (p: Product) => void;
  onOpenDetail: (p: Product) => void;
  currentBranch: Branch;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  selectedVehicle,
  onAddToCart,
  onOpenDetail,
  currentBranch,
}) => {
  // Check fitment
  const isCompatible = selectedVehicle 
    ? product.compatibleVehicles.some(code => 
        code.includes(selectedVehicle.chassisCode) || 
        selectedVehicle.chassisCode.includes(code) ||
        code.includes(selectedVehicle.model)
      )
    : null;

  // Branch stock check
  const inStockAtCurrentBranch = 
    currentBranch.id === 'kirinyaga-rd' ? product.inStockBranches.kirinyagaRoad :
    currentBranch.id === 'industrial-area' ? product.inStockBranches.industrialArea :
    product.inStockBranches.westlands;

  // WhatsApp deep link with part details
  const waMessage = encodeURIComponent(
    `Hello Rukwaro Autospares! I'm interested in:
Part: ${product.name}
SKU: ${product.sku}
Price: KSh ${product.priceKes.toLocaleString()}
${selectedVehicle ? `My Car: ${selectedVehicle.years} ${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.chassisCode})` : 'Vehicle: (Chassis: _________)'}
Pickup Branch: ${currentBranch.name}

Please confirm stock availability and fitment!`
  );

  const waUrl = `https://wa.me/254728707344?text=${waMessage}`;

  return (
    <div className="group bg-white rounded-xl border border-brand-lightgray hover:border-brand-red/40 hover:shadow-card transition-all duration-200 flex flex-col justify-between overflow-hidden">
      
      {/* Top Image & Badges Container */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer" onClick={() => onOpenDetail(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.badge && (
            <span className="bg-brand-red text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm tracking-wider">
              {product.badge}
            </span>
          )}
          {product.grade && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm backdrop-blur-md ${
              product.grade === 'OEM Genuine' 
                ? 'bg-brand-charcoal/90 text-white border border-gray-700' 
                : 'bg-white/95 text-brand-charcoal border border-gray-200'
            }`}>
              {product.grade}
            </span>
          )}
        </div>

        {/* Side Indicator Badge (LHS / RHS / Pair) */}
        {product.side && (
          <div className="absolute top-2.5 right-2.5 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
            {product.side}
          </div>
        )}

        {/* Quick View Hover Prompt */}
        <div className="absolute inset-0 bg-brand-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white text-brand-charcoal px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Specifications</span>
          </span>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div className="space-y-1.5">
          {/* Subcategory & SKU */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
            <span>{product.subcategory}</span>
            <span className="font-mono text-gray-400 font-bold">{product.sku}</span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onOpenDetail(product)}
            className="font-extrabold text-sm text-brand-charcoal hover:text-brand-red transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {product.name}
          </h3>

          {/* Fitment Indicator Banner */}
          {selectedVehicle ? (
            <div className={`p-1.5 rounded-md text-[11px] font-semibold flex items-center gap-1.5 ${
              isCompatible 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {isCompatible ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Exact Fit for your {selectedVehicle.model}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">Check Fitment with Chassis</span>
                </>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-gray-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="truncate font-medium">OEM Spec: {product.oemPartNumber}</span>
            </div>
          )}
        </div>

        {/* Pricing & Stock at Branch */}
        <div className="pt-2 border-t border-gray-100 space-y-2">
          
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-lg font-black text-brand-charcoal tracking-tight">
                KSh {product.priceKes.toLocaleString()}
              </div>
              {product.originalPriceKes && (
                <div className="text-xs text-gray-400 line-through">
                  KSh {product.originalPriceKes.toLocaleString()}
                </div>
              )}
            </div>

            {/* Branch Stock Pill */}
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
              inStockAtCurrentBranch 
                ? 'bg-green-50 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              <MapPin className="w-3 h-3 text-brand-red" />
              <span>{inStockAtCurrentBranch ? 'In Stock at ' + currentBranch.name.split(' ')[0] : 'Transfer Available'}</span>
            </div>
          </div>

          {/* Action CTAs (Dual Ordering Flow) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* 1. Add to Cart */}
            <button
              onClick={() => onAddToCart(product)}
              className="w-full bg-brand-charcoal hover:bg-black text-white py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-brand-red" />
              <span>Add to Cart</span>
            </button>

            {/* 2. Direct WhatsApp Fitment & Quote */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
