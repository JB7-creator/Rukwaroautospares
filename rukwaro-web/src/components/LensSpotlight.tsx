import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface LensSpotlightProps {
  onSelectCategory: (cat: string) => void;
}

export const LensSpotlight: React.FC<LensSpotlightProps> = ({ onSelectCategory }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <section className="py-12 bg-gray-50 border-b border-brand-lightgray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-brand-red text-xs font-bold uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rukwaro Signature Solution</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
              Replacement Lenses: Headlamps & Tail Lamps
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mt-1">
              Are your vehicle headlights yellowed, oxidized, or cracked? <strong>Don’t buy a costly entire assembly.</strong> Swap just the outer UV-coated polycarbonate lens shell and save up to 75%.
            </p>
          </div>

          <button
            onClick={() => onSelectCategory('lenses')}
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-redHover text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all self-start md:self-auto shadow-sm"
          >
            <span>Shop All Lenses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Showcase Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Interactive Visual Comparison */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-brand-charcoal border border-gray-300 select-none">
                
                {/* Background image: Crystal Clear New Lens */}
                <img 
                  src="/banner-headlight.png" 
                  alt="Crystal Clear Headlamp Lens"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlaid Badges */}
                <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded tracking-wider backdrop-blur-sm shadow">
                  Faded / Yellowed Lens
                </div>
                <div className="absolute top-3 right-3 bg-emerald-600/90 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded tracking-wider backdrop-blur-sm shadow">
                  Rukwaro New Crystal Lens
                </div>

                {/* Bottom caption */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md text-white p-2.5 rounded-lg text-xs flex items-center justify-between">
                  <span>German Makrolon Polycarbonate</span>
                  <span className="text-emerald-400 font-bold">100% Beam Clarity</span>
                </div>
              </div>

              {/* Quick Lens Vehicle Tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-gray-500">In Stock Lenses:</span>
                {['Fielder NZE161 (KSh 3,800)', 'D-Max RT50 Pair (KSh 7,200)', 'Mazda CX-5 (KSh 7,800)', 'AE110 Tail Lens (KSh 2,200)'].map((tag, i) => (
                  <span key={i} className="bg-gray-100 hover:bg-red-50 hover:text-brand-red text-gray-700 px-2.5 py-1 rounded font-medium border border-gray-200 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Why Rukwaro Lenses Outperform */}
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-brand-red shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-brand-charcoal">
                    NTSA & Police Road Inspection Compliant
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Cloudy lenses reduce night headlight beam distance by up to 80%, leading to NTSA roadworthy failures and hazardous driving. Rukwaro lenses restore factory lux brightness.
                  </p>
                </div>
              </div>

              {/* Cost comparison comparison box */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Complete New Assembly
                  </span>
                  <div className="text-2xl font-black text-gray-400 line-through mt-1">
                    KSh 18,000+
                  </div>
                  <span className="text-[11px] text-gray-500 block mt-1">
                    Unnecessary expense for just foggy plastic
                  </span>
                </div>

                <div className="p-4 rounded-xl border-2 border-brand-red bg-red-50/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-brand-red text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl">
                    Smart Choice
                  </div>
                  <span className="text-[11px] font-bold text-brand-red uppercase tracking-wider block">
                    Rukwaro Lens Cover
                  </span>
                  <div className="text-2xl font-black text-brand-red mt-1">
                    KSh 3,800
                  </div>
                  <span className="text-[11px] text-green-700 font-semibold block mt-1">
                    Save KSh 14,200 (78% Savings!)
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-red shrink-0" />
                  <span><strong>Double-Coated UV Barrier:</strong> Guaranteed not to haze or turn yellow under the tropical sun.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-red shrink-0" />
                  <span><strong>Factory Laser 1:1 Contour:</strong> Clips directly into your OEM headlamp groove.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-red shrink-0" />
                  <span><strong>On-Site Fitting Assistance:</strong> Available at our Kirinyaga Road flagship store.</span>
                </div>
              </div>

              {/* Direct WhatsApp Lens RFQ */}
              <a
                href="https://wa.me/254728707344?text=Hello%20Rukwaro,%20I%20want%20to%20order%20replacement%20lenses%20for%20my%20car"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                <span>Ask Parts Specialist for Your Car Lens</span>
              </a>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
