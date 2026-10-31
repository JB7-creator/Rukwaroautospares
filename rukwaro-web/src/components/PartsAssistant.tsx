import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Send, X, Sparkles, ShoppingCart, ArrowRight, MessageCircle } from 'lucide-react';
import { Product, Branch } from '../types';
import { PRODUCTS, BRANCHES, POPULAR_VEHICLES } from '../data/mockData';
import { getDayIndex } from '../hooks/useDailyCountdown';

interface PartsAssistantProps {
  onAddToCart: (p: Product) => void;
  onOpenDetail: (p: Product) => void;
  currentBranch: Branch;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  products?: Product[];
  chips?: string[];
}

const DEFAULT_CHIPS = [
  'Inspection lights for my Fielder',
  'Do you have D-Max bumpers?',
  'Delivery to Westlands?',
  'Bei ya leo deals',
];

/* Simple token scorer over the live catalog — no external API needed */
function searchProducts(query: string, limit = 3): Product[] {
  const tokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);

  if (!tokens.length) return [];

  const scored = PRODUCTS.map(p => {
    const haystack = [
      p.name,
      p.sku,
      p.oemPartNumber,
      p.subcategory,
      p.categoryName,
      p.brand,
      ...p.compatibleVehicles,
    ].join(' ').toLowerCase();

    let score = 0;
    for (const t of tokens) {
      if (haystack.includes(t)) score += t.length >= 5 ? 2 : 1;
      if (p.name.toLowerCase().includes(t)) score += 1;
    }
    return { p, score };
  })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(x => x.p);
}

const findVehicleInText = (text: string) => {
  const t = text.toLowerCase();
  const compact = t.replace(/[^a-z0-9]/g, '');
  return POPULAR_VEHICLES.find(v => {
    const modelWords = v.model
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(w => w.length > 2 && w !== 'series');
    const chassisParts = v.chassisCode
      .toLowerCase()
      .split('/')
      .map(c => c.trim().replace(/[^a-z0-9]/g, ''))
      .filter(c => c.length > 2);
    return (
      modelWords.some(w => t.includes(w)) ||
      t.includes(v.make.toLowerCase()) ||
      chassisParts.some(c => compact.includes(c))
    );
  });
};

export const PartsAssistant: React.FC<PartsAssistantProps> = ({
  onAddToCart,
  onOpenDetail,
  currentBranch,
}) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Habari! 👋 I'm the Rukwaro Parts Assistant. Tell me your car and what you need — I'll find the exact part, price and branch stock in seconds.",
      chips: DEFAULT_CHIPS,
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, open, typing]);

  const todaysDeals = useMemo(() => {
    const pool = PRODUCTS.filter(p => p.originalPriceKes && p.originalPriceKes > p.priceKes);
    const day = getDayIndex();
    return [...pool.slice(day % pool.length), ...pool.slice(0, day % pool.length)].slice(0, 2);
  }, []);

  const answer = (raw: string): Message => {
    const q = raw.toLowerCase().trim();

    // Greetings
    if (/^(hi|hello|hey|habari|niaje|sasa|mambo)\b/.test(q)) {
      return {
        role: 'assistant',
        text: 'Nzuri! Tell me the car (e.g. "Fielder NZE161") and the part you need — lamps, lenses, bumpers, oils, wipers… I\'ll pull live prices and branch stock.',
        chips: DEFAULT_CHIPS,
      };
    }

    // Deals
    if (/(deal|discount|offer|bei ya leo|promo|cheap)/.test(q)) {
      return {
        role: 'assistant',
        text: `🔥 Today's "Bei ya Leo" flash prices rotate at midnight. Right now these are on offer — grab them before the timer runs out:`,
        products: todaysDeals,
        chips: ['Browse all deals', 'Order via WhatsApp'],
      };
    }

    // Branches
    if (/(branch|location|where|shop|hub|kirinyaga|westlands|industrial)/.test(q)) {
      return {
        role: 'assistant',
        text: `We have 3 physical hubs — you're currently picking up from ${currentBranch.name}:\n\n${BRANCHES.map(b => `📍 ${b.name}\n${b.address}\n☎ ${b.phone}`).join('\n\n')}\n\nAll stock is transferable between hubs within 24 hours.`,
        chips: ['Check stock for my car', 'Delivery options'],
      };
    }

    // Delivery
    if (/(deliver|shipping|courier|boda|how long|when will|upcountry|msafiri)/.test(q)) {
      return {
        role: 'assistant',
        text: '🚚 Same-day boda delivery across Nairobi & Kiambu (order before 4pm, KSh 350 — free over KSh 15,000). Countrywide via Fargo, Easy Coach, Guardian or G4S from KSh 550. Prefer to collect? Free 15-minute pickup at any hub.',
        chips: ['Pay on delivery?', 'Order via WhatsApp'],
      };
    }

    // Payment
    if (/(pay|mpesa|m-pesa|lipa|cod|cash|deposit)/.test(q)) {
      return {
        role: 'assistant',
        text: '💳 Pay your way: M-Pesa STK Push to our registered Till (instant PIN confirmation), or Pay on Delivery in Nairobi — check the part at your gate before paying (capped at KSh 5,000, small commitment fee refundable). No card needed.',
        chips: ['Place an order', 'Delivery options'],
      };
    }

    // Warranty / returns
    if (/(warrant|return|refund|exchange|fitment guarantee|wrong part)/.test(q)) {
      return {
        role: 'assistant',
        text: '🛡️ Every part carries a 12-month defect warranty, and listed chassis fitments are covered by our 7-Day Fitment Guarantee — wrong part on a listed model means a free return and M-Pesa refund within 24–48h. Unused parts in original packaging are exchangeable at any branch.',
        chips: ['Check fitment for my car', 'Talk to a specialist'],
      };
    }

    // Fitment / vehicle-specific
    const vehicle = findVehicleInText(q);
    if (vehicle || /(fit|compatible|match my car)/.test(q)) {
      if (vehicle) {
        const tokens = q.split(/\s+/).filter(w => w.length > 2);
        const modelWords = vehicle.model
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter(w => w.length > 2);
        const chassisWords = vehicle.chassisCode
          .toLowerCase()
          .split('/')
          .map(c => c.trim().replace(/[^a-z0-9]/g, ''))
          .filter(w => w.length >= 2);
        const modelCompact = vehicle.model.toLowerCase().replace(/[^a-z0-9]/g, '');

        const matchesVehicle = (cv: string) => {
          const cvLower = cv.toLowerCase();
          const cvWords = cvLower.split(/[^a-z0-9]+/);
          const cvCompact = cvLower.replace(/[^a-z0-9]/g, '');
          return (
            modelWords.some(w => cvWords.includes(w)) ||
            chassisWords.some(w => cvWords.includes(w)) ||
            (modelCompact.length > 4 && cvCompact.includes(modelCompact))
          );
        };

        const rank = (p: Product) =>
          tokens.reduce((score, t) => {
            const hay = `${p.name} ${p.categoryName} ${p.subcategory}`.toLowerCase();
            return hay.includes(t) ? score + 1 : score;
          }, 0);

        const compatible = PRODUCTS.filter(p =>
          p.compatibleVehicles.some(matchesVehicle)
        )
          .sort((a, b) => rank(b) - rank(a))
          .slice(0, 3);

        if (compatible.length) {
          return {
            role: 'assistant',
            text: `✅ I found parts confirmed for your ${vehicle.years} ${vehicle.make} ${vehicle.model} (${vehicle.chassisCode}). These are exact-fit and in stock:`,
            products: compatible,
            chips: [`All parts for ${vehicle.model}`, 'Order via WhatsApp'],
          };
        }
      }
      return {
        role: 'assistant',
        text: '🔧 Fitment is our speciality. Use the FastFit selector in the hero, or send your chassis/VIN on WhatsApp and a specialist confirms the exact part in minutes. Listed chassis fitments carry a free-return guarantee.',
        chips: ['Delivery options', 'Talk to a specialist'],
      };
    }

    // Ordering
    if (/(order|buy|purchase|cart|checkout|how do i)/.test(q)) {
      return {
        role: 'assistant',
        text: '🛒 Easy: tap "Add to Cart" on any part, choose delivery or pickup, then complete on WhatsApp or via M-Pesa. Your cart stays saved on this device — even if you close the tab.',
        chips: ['Bei ya leo deals', 'Pay on delivery?'],
      };
    }

    // "Browse all deals" chip → guide
    if (/(browse|all deals)/.test(q)) {
      return {
        role: 'assistant',
        text: 'The full catalog is right below the hero — filter by category or car model. Today\'s flash prices are in the dark "Bei ya Leo" section. Start with the FastFit selector to see only parts that fit your car.',
        chips: DEFAULT_CHIPS,
      };
    }

    // Product search fallback
    const results = searchProducts(raw);
    if (results.length) {
      return {
        role: 'assistant',
        text: `I found ${results.length === 1 ? 'this part' : 'these parts'} in our catalog — live prices and branch stock:`,
        products: results,
        chips: ['Order via WhatsApp', 'Delivery options'],
      };
    }

    // Anything else → human escalation
    return {
      role: 'assistant',
      text: "I don't want to guess on your car — a Rukwaro parts specialist will confirm this in minutes. Tap the WhatsApp button (bottom-left) or send your chassis number and I'll note it for the team.",
      chips: ['Talk to a specialist', 'Browse deals'],
    };
  };

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setTyping(true);

    window.setTimeout(() => {
      const msg = answer(text);
      setMessages(prev => [...prev, msg]);
      setTyping(false);
    }, 650 + Math.random() * 500);
  };

  const handleChip = (chip: string) => {
    if (chip === 'Talk to a specialist' || chip === 'Order via WhatsApp') {
      window.open(
        `https://wa.me/254728707344?text=${encodeURIComponent(
          'Habari Rukwaro 👋 I was chatting with the Parts Assistant and need help with: '
        )}`,
        '_blank'
      );
      return;
    }
    if (chip.startsWith('All parts for')) {
      const el = document.getElementById('catalog');
      el?.scrollIntoView({ behavior: 'smooth' });
      setOpen(false);
      return;
    }
    if (chip === 'Browse all deals') {
      document.getElementById('deals')?.scrollIntoView({ behavior: 'smooth' });
      setOpen(false);
      return;
    }
    send(chip);
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-5 right-5 z-[65] flex items-center gap-2 bg-brand-charcoal hover:bg-black text-white pl-3.5 pr-4 py-3 rounded-full shadow-elevated border border-white/10 transition-all active:scale-95"
        aria-label="Open Rukwaro Parts Assistant"
      >
        <span className="relative">
          <Bot className="w-5 h-5 text-brand-red" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-brand-charcoal" />
        </span>
        <span className="text-xs font-bold hidden sm:inline">Parts Assistant</span>
        <Sparkles className="w-3.5 h-3.5 text-brand-red animate-pulse" />
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-[64] w-[min(94vw,380px)] max-h-[min(72vh,560px)] bg-white rounded-2xl shadow-elevated border border-gray-200 flex flex-col overflow-hidden animate-toast-in">
          {/* Header */}
          <div className="bg-brand-charcoal text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-red/20 border border-brand-red/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-brand-red" />
              </div>
              <div>
                <div className="text-xs font-black tracking-tight flex items-center gap-1.5">
                  Rukwaro Parts Assistant
                  <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                    AI
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Online — replies instantly
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close assistant"
            >
              <X className="w-4 h-4 text-gray-300" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-brand-offwhite">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] space-y-2 ${m.role === 'user' ? 'items-end' : ''}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                      m.role === 'user'
                        ? 'bg-brand-red text-white rounded-br-sm'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Product cards */}
                  {m.products && m.products.length > 0 && (
                    <div className="space-y-2">
                      {m.products.map(p => (
                        <div
                          key={p.id}
                          className="bg-white border border-gray-200 rounded-xl p-2 flex items-center gap-2.5 shadow-sm"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0 cursor-pointer"
                            onClick={() => {
                              onOpenDetail(p);
                              setOpen(false);
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div
                              className="text-[11px] font-bold text-brand-charcoal line-clamp-2 leading-tight cursor-pointer hover:text-brand-red"
                              onClick={() => {
                                onOpenDetail(p);
                                setOpen(false);
                              }}
                            >
                              {p.name}
                            </div>
                            <div className="text-[11px] font-black text-brand-red">
                              KSh {p.priceKes.toLocaleString()}
                            </div>
                          </div>
                          <button
                            onClick={() => onAddToCart(p)}
                            className="shrink-0 bg-brand-charcoal hover:bg-brand-red text-white p-1.5 rounded-lg transition-colors"
                            title="Add to cart"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <a
                        href={`https://wa.me/254728707344?text=${encodeURIComponent(
                          'Habari Rukwaro 👋 I saw these on the site and want to order: ' +
                          m.products.map(p => `${p.name} (${p.sku})`).join(', ')
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-bold py-2 rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Order these on WhatsApp
                      </a>
                    </div>
                  )}

                  {/* Chips */}
                  {m.chips && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.chips.map(c => (
                        <button
                          key={c}
                          onClick={() => handleChip(c)}
                          className="text-[10px] font-semibold bg-white border border-gray-200 hover:border-brand-red hover:text-brand-red text-gray-600 px-2.5 py-1.5 rounded-full transition-colors flex items-center gap-1"
                        >
                          {c}
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '120ms' }} />
                  <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '240ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="p-2.5 border-t border-gray-100 bg-white flex items-center gap-2 shrink-0"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Try "headlamp for NZE161"…'
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-3.5 py-2 text-xs text-brand-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-brand-red hover:bg-brand-redHover disabled:opacity-40 text-white p-2.5 rounded-full transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
