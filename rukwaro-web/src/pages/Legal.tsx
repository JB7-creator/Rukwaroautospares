import React, { createContext, useContext, useState } from 'react';
import { ArrowLeft, Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type LegalDoc = 'terms' | 'privacy' | 'returns';

interface LegalHighlight {
  title: string;
  text: string;
}

interface LegalSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  closing?: string[];
  highlight?: LegalHighlight;
}

interface LegalDocContent {
  title: string;
  subtitle: string;
  sections: LegalSection[];
}

// ─── Content ──────────────────────────────────────────────────────────────────

const EFFECTIVE_DATE = 'Effective 1 November 2026 · Republic of Kenya';

const DOCS: Record<LegalDoc, LegalDocContent> = {
  terms: {
    title: 'Terms & Conditions',
    subtitle:
      'The terms governing your use of this website and every purchase from Rukwaro Autospares — Precision Parts. Peak Performance.',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        paragraphs: [
          'These Terms & Conditions (the “Terms”) govern your use of the Rukwaro Autospares website and all purchases of motor vehicle parts and accessories from us, whether made online, on WhatsApp, by telephone or at any branch. Our Privacy Policy and Returns & Refunds Policy form part of these Terms.',
          'By browsing the website, submitting an order or otherwise engaging our services, you accept these Terms. If you do not agree, please stop using the website. This version takes effect on 1 November 2026.',
        ],
      },
      {
        heading: '2. Eligibility & Capacity',
        paragraphs: [
          'You must be at least 18 years old and have the legal capacity to contract under the Laws of Kenya. A person below that age may transact only with the involvement and consent of a parent or legal guardian.',
          'You must provide accurate, current and complete information — including your name, telephone number, delivery location and vehicle details — and keep it up to date. We may decline or cancel an order where the information given is false, incomplete or cannot be verified.',
        ],
      },
      {
        heading: '3. Products & Grading Honesty',
        paragraphs: ['We supply three clearly labelled grades, and every product page states the grade being sold:'],
        bullets: [
          'OEM Genuine — original equipment manufacturer parts supplied in original manufacturer packaging.',
          'Performance OEM — genuine or OEM-supply parts engineered to meet or exceed factory specification.',
          'Certified Aftermarket — quality aftermarket parts from vetted manufacturers, checked by us for fitment and finish.',
        ],
        closing: [
          'We do not pass off aftermarket parts as genuine. Re-boxed, refurbished or used parts are identified in plain language. If the part supplied is not the grade stated on its listing, return it under our 7-Day Fitment Guarantee at no cost.',
        ],
      },
      {
        heading: '4. Pricing & Payment',
        paragraphs: [
          'All prices are quoted and payable in Kenya Shillings (KSh) and include applicable taxes unless stated otherwise. The price confirmed when we accept your order governs the sale. We accept payment as follows:',
        ],
        bullets: [
          'M-Pesa Lipa na M-Pesa Till — use only the official till quoted at checkout or on WhatsApp. Never send money to a personal number.',
          'Pay on Delivery (Nairobi) — pay the rider by cash or M-Pesa on receipt of the goods.',
          'Countrywide courier — full payment, including courier fees, is required before dispatch.',
        ],
        closing: [
          'Where a commitment fee is required to secure a Pay on Delivery order, it is credited in full against your final invoice and refunded if we cancel, cannot supply the part, or you reject the goods on valid fitment grounds. It is never a non-refundable deposit.',
        ],
      },
      {
        heading: '5. Orders & Acceptance',
        paragraphs: [
          'An order submitted through the website, on WhatsApp or by telephone is an offer to buy the goods on these Terms. A contract arises only when we accept that offer by confirming availability, price and fitment — usually by WhatsApp or SMS — or by issuing a receipt.',
          'We may decline an order where a part is out of stock, mispriced, or cannot be matched to your chassis or VIN. Any money paid for a declined order is refunded in full. Pay on Delivery orders remain subject to dispatch confirmation and our fraud-prevention checks.',
        ],
      },
      {
        heading: '6. Delivery & Risk',
        paragraphs: [
          'Confirmed Nairobi orders placed before 4:00 p.m. EAT on a working day are dispatched the same day by boda. Countrywide orders travel with Fargo, Easy Coach, Guardian or G4S, with delivery timelines advised at confirmation. Delivery times are good-faith estimates, not guarantees.',
          'Risk in the goods passes on physical receipt — at boda handover, courier collection or delivery. Title passes on receipt of cleared full payment. Inspect the goods on receipt and report visible transit damage or shortage to the rider or courier and to us immediately.',
        ],
      },
      {
        heading: '7. Fitment Responsibility',
        paragraphs: [
          'You must supply accurate vehicle details — make, model, year and, where possible, chassis or VIN — when enquiring or ordering. Our fitment guarantee applies only to the chassis codes expressly listed on the product page and to accurate vehicle details supplied by you.',
          'If a part does not fit because of our matching or grading error, we will exchange or refund it free of charge under our Returns & Refunds Policy. If the error was in the details you supplied, we will still help you find the correct part, but the return is handled at our discretion. We recommend professional installation and offer a free pre-dispatch chassis check.',
        ],
        highlight: {
          title: 'Fitment Guarantee',
          text: 'Give us the correct chassis or VIN, and if a part fails to fit a chassis listed on its product page, we will exchange it within 7 days at our cost. WhatsApp logbook verification takes under a minute.',
        },
      },
      {
        heading: '8. Returns & 12-Month Defect Warranty',
        paragraphs: [
          'Unused parts in original packaging with all hardware may be returned within seven days of receipt under our Returns & Refunds Policy. The 7-Day Fitment Guarantee applies where the listed fitment is wrong or the grade supplied is not as stated.',
          'Most parts carry a 12-month warranty against manufacturing defects from the date of purchase, unless the product page states otherwise. Warranty claims are resolved by replacement first. Nothing in these Terms limits your statutory rights under the Sale of Goods Act (Cap 31) or the Consumer Protection Act, 2012.',
        ],
      },
      {
        heading: '9. Rukwaro Club Terms',
        paragraphs: [
          'Rukwaro Club is free and is linked to the telephone number on your account. Under the stamp card, five qualifying services earn the sixth genuine filter kit free, up to a value of KSh 2,500; any excess is payable by the member.',
          'Stamps are personal to the registered member, non-transferable and have no cash value. We may vary or end the programme on reasonable notice published in-store, on the website, or sent by WhatsApp or SMS. We may withhold stamps where we reasonably suspect fraud or abuse.',
        ],
      },
      {
        heading: '10. Acceptable Use of the Website',
        paragraphs: [
          'You may use this website only for lawful purposes. You must not attempt unauthorised access to our systems or other users’ data, scrape or harvest content, place false or bad-faith orders, interfere with the operation of the site, or use our telephone and WhatsApp channels abusively.',
          'All content — including text, images, grading definitions, the Rukwaro Autospares name and the tagline “Precision Parts. Peak Performance.” — belongs to us or our licensors and may not be reproduced for commercial purposes without our written consent.',
        ],
      },
      {
        heading: '11. Limitation of Liability',
        paragraphs: [
          'To the fullest extent permitted by the Laws of Kenya, our liability arising out of or in connection with the website, any order or any goods supplied is limited to the purchase price of the goods giving rise to the claim.',
          'We are not liable for indirect or consequential loss, including loss of profit, business interruption or vehicle downtime, except where caused by our negligence or fraud or where the law does not permit limitation. Your statutory consumer rights are unaffected.',
        ],
      },
      {
        heading: '12. Governing Law, Disputes & Changes',
        paragraphs: [
          'These Terms are governed by and construed in accordance with the Laws of Kenya, and the courts of Nairobi have exclusive jurisdiction. Before commencing proceedings, please contact us so that we may try to resolve the dispute in good faith within 14 days.',
          'We may update these Terms from time to time. The current version and its effective date are published on this page, and material changes will be signalled on the website. Orders accepted before a change takes effect remain governed by the version in force at acceptance.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle:
      'How Rukwaro Autospares collects, uses and protects your personal data under the Data Protection Act, 2019 of the Republic of Kenya.',
    sections: [
      {
        heading: '1. Who We Are (Data Controller)',
        paragraphs: [
          'Rukwaro Autospares is the data controller responsible for the personal data described in this policy. Our branches are Kirinyaga Road Flagship (Nairobi CBD), Industrial Area Central Depot (Enterprise Road) and Westlands Express Branch (Mpaka Road).',
          'We process personal data in accordance with the Data Protection Act, 2019 (the “DPA”). For any privacy question or request, contact us at info@rukwaroautospares.co.ke.',
        ],
      },
      {
        heading: '2. Data We Collect',
        paragraphs: ['We collect only what is needed to serve you, in line with the DPA principle of data minimisation:'],
        bullets: [
          'Contact details — your name, telephone number and, where provided, email address.',
          'Delivery details — delivery location, preferred branch and courier instructions.',
          'Vehicle details — make, model, year and chassis or VIN, used strictly for fitment verification.',
          'Order and payment records — order history, M-Pesa till references and Pay on Delivery records. We never see or store your M-Pesa PIN.',
          'Communications — WhatsApp messages and call notes relating to orders, support and service reminders.',
          'Local device data — cart contents, recently viewed items and your saved garage vehicle, stored in localStorage.',
        ],
      },
      {
        heading: '3. Why We Use Your Data',
        paragraphs: ['We process personal data for the following purposes:'],
        bullets: [
          'To process, source, deliver and support your orders, including courier bookings and Pay on Delivery.',
          'To verify fitment against your chassis or VIN before dispatch.',
          'To send order confirmations and delivery updates, and to respond to enquiries.',
          'To send WhatsApp service reminders, such as oil-change intervals, where you have opted in. Reply STOP at any time to opt out.',
          'To administer Rukwaro Club and send promotions or new-arrival alerts only with your consent.',
          'To meet tax, accounting and other legal obligations, and to prevent fraud and secure our systems.',
        ],
      },
      {
        heading: '4. Legal Bases Under the DPA, 2019',
        paragraphs: ['The DPA requires a lawful basis for every processing activity. We rely on:'],
        bullets: [
          'Contract — processing necessary to fulfil your order, verify fitment, deliver goods and provide support.',
          'Consent — marketing messages, Rukwaro Club participation and WhatsApp service reminders. You may withdraw consent at any time by replying STOP.',
          'Legitimate interest — keeping transaction records, preventing fraud and improving our service, balanced against your rights and expectations.',
          'Legal obligation — retaining tax and accounting records as required by Kenyan law.',
        ],
      },
      {
        heading: '5. Third Parties We Share With',
        paragraphs: [
          'Payments through M-Pesa are processed by Safaricom PLC under its own terms. We receive only the amount, paying number and transaction reference from our Till; we never ask for your M-Pesa PIN.',
          'WhatsApp messages are processed by WhatsApp (Meta Platforms) under its own privacy terms. Please share only what is necessary for your order. For delivery, we give couriers Fargo, Easy Coach, Guardian and G4S the minimum needed — your name, telephone number and delivery address.',
          'We do not sell your personal data and we do not share it with advertisers.',
        ],
      },
      {
        heading: '6. Storage & Security',
        paragraphs: [
          'Cart, recently viewed and garage data stay in your device’s localStorage and do not leave your device until you place an order. Order records are transmitted over encrypted connections.',
          'We apply appropriate technical and organisational safeguards under the DPA, including access controls limited to staff who need the data to serve you, and we review these measures regularly. This website carries no third-party advertising trackers.',
        ],
      },
      {
        heading: '7. How Long We Keep Your Data',
        paragraphs: [
          'Order and transaction records are kept for seven years to meet Kenyan tax and accounting law.',
          'Marketing and Rukwaro Club data are kept until you withdraw consent, after which they are deleted within a reasonable period. WhatsApp order correspondence is kept for the same seven-year period as order records. localStorage data remains until you clear your browser or remove it through the site.',
        ],
      },
      {
        heading: '8. Your Rights Under the DPA',
        paragraphs: ['Subject to the DPA, you have the right to:'],
        bullets: [
          'Access the personal data we hold about you and obtain a copy.',
          'Ask us to correct inaccurate or incomplete data.',
          'Ask us to delete your data, subject to our legal retention duties.',
          'Object to processing, including direct marketing, at any time.',
          'Withdraw any consent on which our processing relies.',
        ],
        closing: [
          'To exercise any right, email info@rukwaroautospares.co.ke or message our WhatsApp line. We respond within a reasonable time and without charge.',
        ],
        highlight: {
          title: 'Your Right to Complain to the ODPC',
          text: 'If you believe we have breached the Data Protection Act, 2019, you may lodge a complaint with the Office of the Data Protection Commissioner at www.odpc.go.ke. We would welcome the chance to resolve your concern first.',
        },
      },
      {
        heading: '9. Cookies & LocalStorage',
        paragraphs: ['We do not use third-party advertising or cross-site tracking cookies. We use browser localStorage only for:'],
        bullets: [
          'Keeping your cart across page reloads.',
          'Remembering recently viewed parts.',
          'Saving your garage vehicle for fitment filtering.',
          'Holding an admin session token for authorised staff.',
        ],
        closing: [
          'You can clear this data at any time through your browser settings. Clearing it removes your cart and saved garage but does not affect records of completed orders.',
        ],
      },
      {
        heading: '10. Children',
        paragraphs: [
          'Our website and services are not directed at persons under 18 years of age, and we do not knowingly collect personal data from children. If you believe a child has provided us with personal data, contact us and we will delete it promptly.',
        ],
      },
      {
        heading: '11. Contact & Changes',
        paragraphs: [
          'We may update this policy as our services evolve. The current version and effective date are published on this page, and material changes will be signalled on the website.',
          'For access, correction, deletion, objection or any privacy question, email info@rukwaroautospares.co.ke, WhatsApp 0728 707 344, or call 0728 707 344, 0712 843 544 or 0782 099 753. Mark your message “Data Protection Request”.',
        ],
      },
    ],
  },
  returns: {
    title: 'Returns & Refunds Policy',
    subtitle:
      'Our 7-Day Fitment Guarantee, 12-month warranty claims and refund process — explained plainly and honoured quickly.',
    sections: [
      {
        heading: '1. Scope of the 7-Day Fitment Guarantee',
        paragraphs: [
          'Every part is covered by our 7-Day Fitment Guarantee where its product page lists a fitment and the vehicle details you gave us were accurate. If the part does not fit the chassis or model stated, you may return it for exchange or refund within seven calendar days of receipt.',
          'This guarantee sits on top of your statutory rights under the Sale of Goods Act (Cap 31) and the Consumer Protection Act, 2012 and does not replace them.',
        ],
        highlight: {
          title: 'The 7-Day Fitment Guarantee',
          text: 'Seven days from receipt. Unused, complete and in original packaging. One WhatsApp message with a photo and your logbook starts the process — approval is usually same-day.',
        },
      },
      {
        heading: '2. Conditions for Return',
        paragraphs: [
          'The part must be unused and not installed, in original undamaged packaging with labels intact, complete with all brackets, bolts, clips, manuals and accessories, and accompanied by proof of purchase — a receipt, order number or WhatsApp confirmation.',
          'Parts that have been painted, drilled, cut, modified or prepared for installation cannot be accepted under the guarantee.',
        ],
      },
      {
        heading: '3. How to Return',
        paragraphs: [
          'Message WhatsApp 0728 707 344 with a photo of the part, a photo of the vehicle logbook or number plate, and your order number.',
          'We verify the part against the listed fitment and issue a return approval code. Return it to any branch — Kirinyaga Road Flagship, Industrial Area Central Depot or Westlands Express Branch — or hand it to our Nairobi rider for pickup. The receiving branch inspects it before completing the exchange or refund.',
          'Countrywide customers may courier returns to the Industrial Area Central Depot, quoting the approval code.',
        ],
      },
      {
        heading: '4. Refunds',
        paragraphs: [
          'After inspection, M-Pesa refunds are processed within 24–48 hours to the number that paid. For cash Pay on Delivery orders, we verify the collection record and refund to the customer’s nominated M-Pesa number.',
          'Original delivery fees are not refunded unless the return is due to our error — a wrong part, a mislabelled grade or a fitment mismatch on our side. Where we are at fault, we also reimburse reasonable return courier costs.',
        ],
      },
      {
        heading: '5. Exchanges',
        paragraphs: [
          'If you need the correct part, we will exchange it: the replacement is dispatched the same or next working day, and any price difference is paid or refunded at exchange. The seven-day window runs from receipt of the original order and is not reset by an exchange.',
        ],
      },
      {
        heading: '6. 12-Month Warranty Claims',
        paragraphs: [
          'Most parts carry a 12-month warranty against manufacturing defects from the date of purchase, unless the product page states otherwise. Send clear photographs or a short video of the defect, the installed part where relevant, and your order number on WhatsApp.',
          'Approved claims are resolved by replacement first; if a replacement is unavailable, we refund the purchase price. The warranty excludes damage from incorrect installation, modification, accident or misuse, and does not cover ordinary wear items.',
        ],
      },
      {
        heading: '7. Non-Returnable Items',
        paragraphs: ['For safety and product integrity, we cannot accept:'],
        bullets: [
          'Oils, fluids and other consumables once opened or unsealed.',
          'Parts that have been modified, painted, drilled or resprayed.',
          'Parts damaged by incorrect installation, over-torque, accident or misuse.',
        ],
        closing: [
          'Electrical components should be bench-tested before installation where possible. Once fitted, they are accepted back only where they prove defective within warranty.',
        ],
      },
      {
        heading: '8. Pay on Delivery Refunds',
        paragraphs: [
          'Pay on Delivery refunds are made by M-Pesa to the number that paid, after inspection at the returning branch. Where the rider collected cash, we match the collection record to your order number before refunding. This protects both parties and keeps the 24–48 hour refund window.',
        ],
      },
      {
        heading: '9. Countrywide Returns',
        paragraphs: [
          'Upcountry customers may return parts through Fargo, Easy Coach, Guardian or G4S, addressed to the Industrial Area Central Depot (Enterprise Road, Nairobi) and quoting the return approval code. Pack the part securely in its original packaging; parts damaged through inadequate return packing may be refused.',
          'Return courier costs are borne by the customer unless the return is due to our error, in which case we reimburse reasonable courier costs on receipt.',
        ],
      },
      {
        heading: '10. Contact & Support',
        paragraphs: ['Start every return, exchange or warranty claim on WhatsApp — it is the fastest channel and creates a timestamped record:'],
        bullets: [
          'WhatsApp — 0728 707 344 (wa.me/254728707344).',
          'Phone — 0728 707 344, 0712 843 544 or 0782 099 753.',
          'Email — info@rukwaroautospares.co.ke.',
          'Branches — Kirinyaga Road Flagship, Industrial Area Central Depot and Westlands Express Branch.',
        ],
        closing: ['Our branches are open during normal business hours, and WhatsApp is monitored through the day.'],
      },
    ],
  },
};

// ─── Shared rendering ─────────────────────────────────────────────────────────

const SectionBlock: React.FC<{ section: LegalSection }> = ({ section }) => (
  <div>
    <h3 className="text-sm font-black uppercase tracking-wider text-brand-charcoal mt-8 mb-2">
      {section.heading}
    </h3>
    <div className="text-xs sm:text-sm text-gray-600 leading-relaxed space-y-2.5">
      {section.paragraphs.map((paragraph, index) => (
        <p key={`p-${index}`}>{paragraph}</p>
      ))}
      {section.bullets && (
        <ul className="space-y-1.5">
          {section.bullets.map((bullet, index) => (
            <li key={`b-${index}`} className="flex gap-2">
              <span className="text-brand-red font-bold shrink-0">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
      {section.closing?.map((paragraph, index) => (
        <p key={`c-${index}`}>{paragraph}</p>
      ))}
    </div>
    {section.highlight && (
      <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4 text-xs text-gray-700 leading-relaxed">
        <strong className="block text-brand-charcoal font-black mb-1">{section.highlight.title}</strong>
        {section.highlight.text}
      </div>
    )}
  </div>
);

// Tabs are injected through context so they can sit below the document title in
// LegalDocs while LegalPage remains usable on its own for a single document.
interface LegalTabsState {
  active: LegalDoc;
  onSelect: (doc: LegalDoc) => void;
}

const LegalTabsContext = createContext<LegalTabsState | null>(null);

const TABS: Array<{ id: LegalDoc; label: string }> = [
  { id: 'terms', label: 'Terms & Conditions' },
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'returns', label: 'Returns & Refunds' },
];

const LegalTabBar: React.FC = () => {
  const tabs = useContext(LegalTabsContext);

  if (!tabs) return null;

  return (
    <div
      role="tablist"
      aria-label="Legal policies"
      className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 py-2 mb-8 mt-6 flex items-center gap-1 overflow-x-auto"
    >
      {TABS.map((tab) => {
        const isActive = tabs.active === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => tabs.onSelect(tab.id)}
            className={`rounded-lg px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-brand-red text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

const DocFooter: React.FC = () => (
  <div className="mt-12 bg-brand-offwhite rounded-xl p-4 text-xs text-gray-600">
    <div className="text-[11px] font-black uppercase tracking-wider text-brand-charcoal mb-3">
      Contact Rukwaro Autospares
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 leading-relaxed">
      <div className="flex items-start gap-2">
        <Phone className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
        <div>
          <span className="block font-bold text-brand-charcoal">Call us</span>
          <a href="tel:0728707344" className="hover:text-brand-red transition-colors">0728 707 344</a>
          {' · '}
          <a href="tel:0712843544" className="hover:text-brand-red transition-colors">0712 843 544</a>
          {' · '}
          <a href="tel:0782099753" className="hover:text-brand-red transition-colors">0782 099 753</a>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <MessageCircle className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
        <div>
          <span className="block font-bold text-brand-charcoal">WhatsApp</span>
          <a
            href="https://wa.me/254728707344"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-red transition-colors"
          >
            254 728 707 344
          </a>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Mail className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
        <div>
          <span className="block font-bold text-brand-charcoal">Email</span>
          <a href="mailto:info@rukwaroautospares.co.ke" className="hover:text-brand-red transition-colors">
            info@rukwaroautospares.co.ke
          </a>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <MapPin className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
        <div>
          <span className="block font-bold text-brand-charcoal">Branches</span>
          Kirinyaga Road Flagship (Nairobi CBD) · Industrial Area Central Depot (Enterprise Road) · Westlands Express Branch (Mpaka Road)
        </div>
      </div>
    </div>
    <div className="mt-4 pt-3 border-t border-gray-200 text-[11px] text-gray-400">
      © {new Date().getFullYear()} Rukwaro Autospares — Precision Parts. Peak Performance. Governed by the Laws of Kenya.
    </div>
  </div>
);

// ─── LegalPage ────────────────────────────────────────────────────────────────

export const LegalPage: React.FC<{ doc: LegalDoc; onBack: () => void }> = ({ doc, onBack }) => {
  const content = DOCS[doc];

  return (
    <section className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Top bar: back link + brand lockup */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </button>
          <div className="flex items-center gap-2.5">
            <img src="/logo-mark.png" alt="Rukwaro Autospares logo" className="w-10 h-10 object-contain" />
            <div className="leading-none">
              <div className="text-brand-red font-black text-xl tracking-tight">RUKWARO</div>
              <div className="text-brand-charcoal font-bold tracking-[0.28em] text-[10px] mt-1">AUTOSPARES</div>
            </div>
          </div>
        </div>

        {/* Document heading */}
        <h1 className="text-3xl font-black text-brand-charcoal mt-8">{content.title}</h1>
        <p className="text-xs text-gray-400 mt-2">{EFFECTIVE_DATE}</p>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-3">{content.subtitle}</p>

        <LegalTabBar />

        {/* Policy sections */}
        <div>
          {content.sections.map((section) => (
            <SectionBlock key={section.heading} section={section} />
          ))}
        </div>

        <DocFooter />
      </div>
    </section>
  );
};

// ─── LegalDocs ────────────────────────────────────────────────────────────────

export const LegalDocs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [doc, setDoc] = useState<LegalDoc>('terms');

  const selectDoc = (next: LegalDoc) => {
    setDoc(next);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <LegalTabsContext.Provider value={{ active: doc, onSelect: selectDoc }}>
      <LegalPage doc={doc} onBack={onBack} />
    </LegalTabsContext.Provider>
  );
};
