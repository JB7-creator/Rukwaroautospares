import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How do I know a part will fit my exact car?',
      answer:
        'Use the FastFit selector or enter your chassis/VIN. Every listing shows exact chassis codes (NZE161, TFR85...). Still unsure? Send your logbook photo on WhatsApp — a specialist confirms in minutes. Wrong part on a listed model = free return.',
    },
    {
      question: 'Are your parts genuine or counterfeit?',
      answer:
        'Three honest grades on every listing: OEM Genuine (Toyota, Isuzu, Besco), Performance OEM (Depo, Koito, TYC), Certified Aftermarket. KEBS-compliant imports only. "Genuine or we tell you straight" — we never mix grades.',
    },
    {
      question: 'Do you deliver outside Nairobi?',
      answer:
        'Same-day boda across Nairobi & Kiambu (order before 4pm). Countrywide via Fargo, Easy Coach, Guardian & G4S — dispatched daily from the Industrial Area depot, pay delivery on arrival.',
    },
    {
      question: 'How do I pay?',
      answer:
        'M-Pesa STK Push to our registered Till (instant PIN confirm), or Pay on Delivery within Nairobi. Card payments coming soon.',
    },
    {
      question: 'Will your headlamps pass the NTSA inspection?',
      answer:
        'Yes — our lighting carries correct RHD beam cutoff patterns and passes the mandatory NTSA inspections that began July 2026. Lenses and lamps are inspection-ready out of the box.',
    },
    {
      question: 'What if I ordered the wrong part?',
      answer:
        '7-day exchange on listed fitments. Part unused, in original packaging. Refund to M-Pesa within 24 hours of confirmation at any branch.',
    },
    {
      question: 'Do you offer fleet or mechanic pricing?',
      answer:
        'Yes — dedicated fleet desk at the Industrial Area depot. Volume pricing on oils, filters, lamps and body panels. WhatsApp "FLEET" to 0728 707 344.',
    },
  ];

  return (
    <section className="bg-white py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-red mb-1.5">
            Maswali Yako
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-charcoal">
            Frequently Asked Questions
          </h2>
        </div>

        <div>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 py-4 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-bold text-brand-charcoal group-hover:text-brand-red transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-red' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-600 leading-relaxed pb-4 pr-8">
                      {faq.answer}
                    </p>
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
