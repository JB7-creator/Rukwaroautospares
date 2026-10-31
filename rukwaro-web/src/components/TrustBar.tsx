import React from 'react';
import { Store, BadgeCheck, RotateCcw, Banknote, Lightbulb } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const badges = [
    {
      icon: Store,
      title: '3 Physical Stores',
      subtitle: 'Kirinyaga Rd • Ind. Area • Westlands',
    },
    {
      icon: BadgeCheck,
      title: 'KEBS-Compliant Imports',
      subtitle: 'Anti-Counterfeit Verified',
    },
    {
      icon: RotateCcw,
      title: 'Fitment Guarantee',
      subtitle: 'Wrong Part? Free Return',
    },
    {
      icon: Banknote,
      title: 'Pay on Delivery',
      subtitle: 'Nairobi • M-Pesa Till Registered',
    },
    {
      icon: Lightbulb,
      title: 'NTSA Inspection-Ready',
      subtitle: 'Lighting That Passes First Time',
    },
  ];

  return (
    <section className="bg-brand-charcoal py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-brand-red/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-brand-red" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white leading-tight truncate">
                    {badge.title}
                  </div>
                  <div className="text-[10px] text-gray-400 leading-tight truncate">
                    {badge.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
