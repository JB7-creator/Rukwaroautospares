import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  MessageCircle, 
  CreditCard, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck 
} from 'lucide-react';
import { CartItem, Branch, Vehicle } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  currentBranch: Branch;
  selectedVehicle: Vehicle | null;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentBranch,
  selectedVehicle,
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'boda' | 'pickup' | 'upcountry' | 'cod'>('boda');
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [isProcessingMpesa, setIsProcessingMpesa] = useState(false);
  const [mpesaSuccess, setMpesaSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.priceKes * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'pickup' ? 0 : deliveryMethod === 'boda' ? (subtotal > 15000 ? 0 : 350) : deliveryMethod === 'cod' ? (subtotal > 15000 ? 200 : 550) : 550;
  const total = subtotal + deliveryFee;
  const codEligible = subtotal <= 5000; // COD capped per Kenyan market norm

  const handleMpesaPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mpesaNumber || mpesaNumber.length < 9) {
      alert('Please enter a valid Safaricom phone number (e.g. 0712345678)');
      return;
    }

    setIsProcessingMpesa(true);
    setTimeout(() => {
      setIsProcessingMpesa(false);
      setMpesaSuccess(true);
    }, 2000);
  };

  // WhatsApp Order String
  const waItemsList = items.map((i, idx) => 
    `${idx + 1}. ${i.product.name} (SKU: ${i.product.sku}) - Qty: ${i.quantity} x KSh ${i.product.priceKes.toLocaleString()}`
  ).join('\n');

  const waMessage = encodeURIComponent(
    `*NEW ORDER - RUKWARO AUTOSPARES WEB PLATFORM*

${waItemsList}

*Subtotal:* KSh ${subtotal.toLocaleString()}
*Delivery Method:* ${deliveryMethod === 'boda' ? 'Same-Day Nairobi Boda Rider' : deliveryMethod === 'pickup' ? `Self Pickup at ${currentBranch.name}` : deliveryMethod === 'cod' ? `Pay on Delivery (Nairobi COD)${codEligible ? '' : ' — over KSh 5,000: deposit via M-Pesa on confirmation'}` : 'Upcountry Courier (Fargo/Easy Coach)'}
*Delivery Fee:* KSh ${deliveryFee.toLocaleString()}
*TOTAL AMOUNT:* KSh ${total.toLocaleString()}

${selectedVehicle ? `*Vehicle:* ${selectedVehicle.years} ${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.chassisCode})` : '*Vehicle:* (Customer to confirm chassis)'}
*Preferred Branch:* ${currentBranch.name}

Please confirm order receipt and send payment details!`
  );

  const waUrl = `https://wa.me/254728707344?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-red" />
            <h3 className="text-lg font-black text-brand-charcoal">
              Your Parts Cart ({items.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
              <h4 className="text-base font-bold text-gray-700">Your Cart is Empty</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Explore our catalog for genuine lighting, lenses, bumpers, inner fenders, mudflaps, and lubricants.
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-brand-red text-white text-xs font-bold px-4 py-2 rounded-lg"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.product.id} className="py-3 flex gap-3 items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-brand-charcoal truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-[11px] text-gray-500 font-mono">
                        SKU: {item.product.sku}
                      </div>
                      <div className="text-xs font-black text-brand-red mt-0.5">
                        KSh {item.product.priceKes.toLocaleString()}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-1">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded text-gray-600 hover:bg-white text-xs font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-1">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded text-gray-600 hover:bg-white text-xs font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1.5 text-gray-400 hover:text-brand-red transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Delivery Option Selector */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <span className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">
                  Delivery / Collection Method
                </span>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  
                  {/* Option 1: Boda */}
                  <label className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    deliveryMethod === 'boda' ? 'border-brand-red bg-red-50/50' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'boda'}
                        onChange={() => setDeliveryMethod('boda')}
                        className="text-brand-red focus:ring-brand-red"
                      />
                      <div>
                        <div className="font-bold text-gray-800">Same-Day Nairobi Boda Express</div>
                        <div className="text-[10px] text-gray-500">Delivered within 2 hours across Nairobi & Kiambu</div>
                      </div>
                    </div>
                    <span className="font-bold text-brand-charcoal text-xs">
                      {subtotal > 15000 ? 'FREE' : 'KSh 350'}
                    </span>
                  </label>

                  {/* Option 2: Pickup */}
                  <label className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    deliveryMethod === 'pickup' ? 'border-brand-red bg-red-50/50' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'pickup'}
                        onChange={() => setDeliveryMethod('pickup')}
                        className="text-brand-red focus:ring-brand-red"
                      />
                      <div>
                        <div className="font-bold text-gray-800">Self Pickup: {currentBranch.name}</div>
                        <div className="text-[10px] text-gray-500">Ready in 15 minutes at hub counter</div>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600 text-xs">FREE</span>
                  </label>

                  {/* Option 3: Pay on Delivery (Nairobi COD) */}
                  <label className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    deliveryMethod === 'cod' ? 'border-brand-red bg-red-50/50' : codEligible ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'cod'}
                        onChange={() => setDeliveryMethod('cod')}
                        disabled={!codEligible}
                        className="text-brand-red focus:ring-brand-red"
                      />
                      <div>
                        <div className="font-bold text-gray-800 flex items-center gap-1.5">
                          Pay on Delivery
                          <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Most Trusted</span>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {codEligible
                            ? 'Check the part at your gate before you pay — Nairobi only'
                            : `COD capped at KSh 5,000 — pay M-Pesa deposit for KSh ${subtotal.toLocaleString()} orders`}
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-brand-charcoal text-xs">
                      {subtotal > 15000 ? 'KSh 200' : 'KSh 550'}
                    </span>
                  </label>

                  {/* Option 4: Upcountry */}
                  <label className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    deliveryMethod === 'upcountry' ? 'border-brand-red bg-red-50/50' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'upcountry'}
                        onChange={() => setDeliveryMethod('upcountry')}
                        className="text-brand-red focus:ring-brand-red"
                      />
                      <div>
                        <div className="font-bold text-gray-800">Countrywide Courier Dispatch</div>
                        <div className="text-[10px] text-gray-500">Fargo / Easy Coach / Guardian / G4S</div>
                      </div>
                    </div>
                    <span className="font-bold text-brand-charcoal text-xs">KSh 550</span>
                  </label>

                </div>
              </div>

              {/* M-PESA STK Push Form */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-brand-charcoal">Instant M-Pesa STK Push</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">Paybill / STK</span>
                </div>

                {mpesaSuccess ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>M-Pesa Prompt Sent!</strong> Check your phone to enter your M-Pesa PIN. Your order has been registered at {currentBranch.name}.
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleMpesaPay} className="flex gap-2">
                    <input
                      type="tel"
                      value={mpesaNumber}
                      onChange={(e) => setMpesaNumber(e.target.value)}
                      placeholder="e.g. 0712 345 678"
                      className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={isProcessingMpesa}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      {isProcessingMpesa ? 'Sending STK...' : 'Pay via M-Pesa'}
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer with Totals and Action Buttons */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-200 bg-white space-y-3">
            
            {/* Totals */}
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Parts Subtotal</span>
                <span className="font-bold text-brand-charcoal">KSh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-brand-charcoal">
                  {deliveryFee === 0 ? 'FREE' : `KSh ${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-brand-charcoal pt-1.5 border-t border-gray-100">
                <span>Total Amount</span>
                <span className="text-brand-red">KSh {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Direct WhatsApp Checkout Button */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Complete Order on WhatsApp</span>
            </a>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-red" />
              <span>100% Genuine Auto Spares Guarantee &bull; Rukwaro Kenya</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
