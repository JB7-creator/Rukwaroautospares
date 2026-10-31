import React from 'react';
import { Star, MessageCircle } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  area: string;
  stars: number;
  quote: string;
  reply?: string;
}

export const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: 'James M.',
      role: 'Taxi fleet owner',
      area: 'Buru Buru',
      stars: 5,
      quote:
        'Ordered 4 Hiace headlamps on WhatsApp at 9am. Picked them at Kirinyaga Road by 10. Fitment was exact — no hammering, no drama. This is my third set from Rukwaro.',
    },
    {
      name: 'Grace W.',
      role: 'Mazda CX-5 owner',
      area: 'Kilimani',
      stars: 5,
      quote:
        'My CX-5 headlights were yellow and NTSA inspection was coming. The lens replacement saved me over 10k vs a new assembly, and passed inspection first try.',
      reply:
        'Asante Grace! Lenses carry a 5-year anti-yellowing warranty — karibu tena.',
    },
    {
      name: 'Otieno D.',
      role: 'Mechanic',
      area: 'Industrial Area',
      stars: 5,
      quote:
        'I send my customers here because the grades are honest. They tell you straight: OEM, Ex-Japan, or aftermarket. No counterfeit games on Kirinyaga Road.',
    },
    {
      name: 'Aisha H.',
      role: 'Isuzu D-Max',
      area: 'South C',
      stars: 4,
      quote:
        'Paid on delivery after checking the part at my gate. Boda rider arrived within 2 hours. Bei iko wazi kwenye website — no haggling.',
      reply:
        'Asante Aisha. Same-day Nairobi delivery is standard on orders before 4pm.',
    },
    {
      name: 'Samuel K.',
      role: 'Corolla AE110 classic restorer',
      area: 'Ngara',
      stars: 5,
      quote:
        'Finding clean AE111 crystal lamps Nairobi is hard. Rukwaro had both sides in stock with the corner indicators. Classic is back on the road.',
    },
    {
      name: 'Mary N.',
      role: 'Probox courier',
      area: 'Kahawa Wendani',
      stars: 5,
      quote:
        'My Probox lives on Thika Road potholes. Control arms from Rukwaro are still silent after eight months — no knocks. Half the price a town garage quoted me.',
    },
  ];

  // 6 cards; Grace's and Aisha's cards carry inline "Rukwaro replied" boxes.
  // Aisha's card is 4 stars; everything else 5 stars.
  const renderStars = (count: number) => (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < count ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
        />
      ))}
    </div>
  );

  return (
    <section className="bg-brand-offwhite py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-red mb-1.5">
            Word on the Ground
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-charcoal">
            Nairobi Drivers & Fleetis Trust Rukwaro
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-xl shadow-card p-5 flex flex-col hover:shadow-elevated hover:border-gray-200 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                {renderStars(t.stars)}
                <MessageCircle className="w-3.5 h-3.5 text-gray-300" />
              </div>

              <p className="text-xs leading-relaxed text-gray-700 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {t.reply && (
                <div className="mt-3.5 bg-red-50 rounded-lg p-2.5 border-l-2 border-brand-red">
                  <p className="text-[11px] text-gray-700 leading-relaxed">
                    <span className="text-brand-red font-bold">Rukwaro:</span>{' '}
                    {t.reply}
                  </p>
                </div>
              )}

              <div className="mt-4 pt-3.5 border-t border-gray-100">
                <div className="text-xs font-bold text-brand-charcoal">{t.name}</div>
                <div className="text-[11px] text-gray-500">
                  {t.role} • {t.area}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
