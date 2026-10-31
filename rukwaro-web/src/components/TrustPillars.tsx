import React from 'react';
import { Shield, Settings, Gem, Truck } from 'lucide-react';

export const TrustPillars: React.FC = () => {
  const pillars = [
    {
      icon: Shield,
      title: 'PREMIUM QUALITY',
      subtitle: 'Certified Standards',
      desc: 'Tested against Kenyan road vibrations, UV sunlight, and dust ingress. ISO & CAPA compliant.',
    },
    {
      icon: Settings,
      title: 'OEM FITMENT',
      subtitle: 'Guaranteed Bolt-On',
      desc: '1:1 laser-precision alignment for factory screws, brackets, and electrical wiring harnesses.',
    },
    {
      icon: Gem,
      title: 'BUILT TO LAST',
      subtitle: 'Long Life Durability',
      desc: 'UV-stabilized polycarbonate lenses prevent yellowing; heavy-gauge thermoplastics resist cracks.',
    },
    {
      icon: Truck,
      title: 'FAST & RELIABLE DELIVERY',
      subtitle: 'Nairobi & Countrywide',
      desc: 'Same-day express delivery across Nairobi & environs. Daily countrywide parcel dispatches.',
    },
  ];

  return (
    <section className="bg-white border-b border-brand-lightgray py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="group p-4 rounded-xl border border-gray-100 hover:border-brand-red/30 hover:shadow-card bg-white transition-all flex items-start gap-3.5"
              >
                <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white text-brand-red transition-colors">
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs tracking-wider text-brand-charcoal uppercase leading-tight">
                    {pillar.title}
                  </h4>
                  <div className="text-[11px] font-bold text-brand-red mb-1">
                    {pillar.subtitle}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
