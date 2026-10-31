import React, { useState } from 'react';
import { Eye, CheckCircle2, ArrowRight } from 'lucide-react';
import { PartCategory } from '../types';

interface ExplodedDiagramProps {
  onSelectCategory: (cat: PartCategory) => void;
}

interface Hotspot {
  id: string;
  category: PartCategory;
  title: string;
  x: number; // percentage
  y: number; // percentage
  description: string;
  priceRange: string;
}

export const ExplodedDiagram: React.FC<ExplodedDiagramProps> = ({ onSelectCategory }) => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const hotspots: Hotspot[] = [
    {
      id: 'hs-1',
      category: 'lighting',
      title: 'Bi-LED & Halogen Headlamps',
      x: 23,
      y: 42,
      description: 'Crystal projector lamps with Kenya RHD road-cutoff pattern. LHS & RHS available.',
      priceRange: 'From KSh 9,800',
    },
    {
      id: 'hs-2',
      category: 'lenses',
      title: 'Outer Headlight Lens Shells',
      x: 77,
      y: 42,
      description: 'German Makrolon Polycarbonate lenses. UV-resistant against tropical oxidation.',
      priceRange: 'From KSh 2,200',
    },
    {
      id: 'hs-3',
      category: 'bumpers-grills',
      title: 'Radiator Grilles & Emblems',
      x: 50,
      y: 35,
      description: 'Triple-chrome and sport gloss-black honeycomb grilles with precision badge clips.',
      priceRange: 'From KSh 6,500',
    },
    {
      id: 'hs-4',
      category: 'bumpers-grills',
      title: 'Front Bumper Covers',
      x: 50,
      y: 65,
      description: 'High-impact polypropylene (PP) pre-primed bumpers. Flexible and crack-resistant.',
      priceRange: 'From KSh 6,800',
    },
    {
      id: 'hs-5',
      category: 'fenders-mudflaps',
      title: 'Inner Fender Splash Liners',
      x: 12,
      y: 72,
      description: 'Heavy-gauge splash shields protecting engine bay and wiring from mud & gravel.',
      priceRange: 'From KSh 3,200',
    },
    {
      id: 'hs-6',
      category: 'fenders-mudflaps',
      title: 'Contoured Mudflaps',
      x: 88,
      y: 80,
      description: '4-Piece tough thermoplastic splash guards preventing door paint chipping.',
      priceRange: 'From KSh 3,500',
    },
    {
      id: 'hs-7',
      category: 'oils-lubricants',
      title: 'Engine Oils & Lubricants',
      x: 50,
      y: 15,
      description: 'Toyota Genuine 5W-30, Isuzu Besco 15W-40, Mobil 1, Castrol EDGE & ATF fluids.',
      priceRange: 'From KSh 4,600',
    },
  ];

  return (
    <section className="py-12 bg-white border-b border-brand-lightgray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-block bg-red-50 text-brand-red text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
            Interactive Vehicle Anatomy
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
            Explore Rukwaro Parts by Vehicle Location
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Tap any interactive hotspot on the vehicle diagram to see matching lighting, body panels, liners, and fluids.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Interactive Vehicle Diagram Canvas */}
          <div className="lg:col-span-8 bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-6 relative overflow-hidden min-h-[360px] flex items-center justify-center">
            
            {/* Background Car Graphic */}
            <div className="relative w-full max-w-2xl aspect-[16/9] flex items-center justify-center">
              <img
                src="/banner-headlight.png"
                alt="Front Vehicle Lighting & Fascia Breakdown"
                className="w-full h-full object-cover rounded-xl shadow-card opacity-90 border border-gray-300"
              />

              {/* Dark aesthetic overlay */}
              <div className="absolute inset-0 bg-brand-charcoal/30 rounded-xl" />

              {/* Render Hotspot Pins */}
              {hotspots.map((hs) => {
                const isSelected = activeHotspot?.id === hs.id;
                return (
                  <button
                    key={hs.id}
                    onClick={() => setActiveHotspot(hs)}
                    style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none`}
                    aria-label={hs.title}
                  >
                    <span className="relative flex h-7 w-7 items-center justify-center">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isSelected ? 'bg-brand-red' : 'bg-white'
                      }`} />
                      <span className={`relative inline-flex rounded-full h-6 w-6 border-2 items-center justify-center text-xs font-black shadow-lg transition-transform group-hover:scale-125 ${
                        isSelected 
                          ? 'bg-brand-red border-white text-white' 
                          : 'bg-white border-brand-charcoal text-brand-charcoal hover:bg-brand-red hover:text-white hover:border-white'
                      }`}>
                        •
                      </span>
                    </span>

                    {/* Tooltip on hover */}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[11px] font-bold text-white bg-brand-charcoal rounded shadow-md whitespace-nowrap pointer-events-none z-30">
                      {hs.title}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right: Selected Component Details Card */}
          <div className="lg:col-span-4">
            <div className="bg-gray-50 border border-brand-lightgray rounded-2xl p-6 space-y-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Selected Component Focus
              </span>

              {activeHotspot ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-brand-charcoal">
                      {activeHotspot.title}
                    </h3>
                    <span className="text-xs font-bold text-brand-red bg-red-50 px-2 py-0.5 rounded">
                      {activeHotspot.priceRange}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {activeHotspot.description}
                  </p>

                  <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-700 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-green-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>OEM Exact Fitment Guarantee</span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Available for D-Max, Mazda (CX-5/Demio), Fielder, AE110, Juke & Hiace
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCategory(activeHotspot.category)}
                    className="w-full bg-brand-red hover:bg-brand-redHover text-white py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <span>Filter Products in Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="py-8 text-center space-y-3">
                  <Eye className="w-8 h-8 text-gray-400 mx-auto animate-pulse" />
                  <p className="text-xs text-gray-500">
                    Click any hotspot dot on the car diagram to inspect lighting, body panels, inner liners, or engine lubricants.
                  </p>
                  <button
                    onClick={() => setActiveHotspot(hotspots[0])}
                    className="text-xs font-bold text-brand-red hover:underline"
                  >
                    Quick Preview: Bi-LED Headlamps
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
