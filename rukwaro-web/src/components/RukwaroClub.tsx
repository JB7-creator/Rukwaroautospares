import React from 'react';
import { Stamp, MessageCircle, Wrench, Gift, CalendarClock } from 'lucide-react';

/**
 * RUKWARO CLUB — simple loyalty + service-reminder opt-in.
 * MVP mechanic: WhatsApp-based stamp card ("5 services, 6th filter free")
 * + service reminders from purchase history. Research case study:
 * repeat rate 18% → 47% with a stamped-card style program.
 */
export const RukwaroClub: React.FC = () => {
  const stamps = [1, 2, 3, 4, 5, 6];

  return (
    <section className="relative bg-gradient-to-br from-brand-charcoal via-brand-charcoalLight to-brand-midgray overflow-hidden">
      {/* Red glow accents */}
      <div className="absolute -top-20 right-1/4 w-72 h-72 bg-brand-red/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left: Club pitch + stamp card */}
          <div>
            <div className="inline-flex items-center gap-1.5 bg-brand-red/15 border border-brand-red/30 text-brand-red text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              <Gift className="w-3.5 h-3.5" />
              <span>Rukwaro Club — Free to Join</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Service 5 Times.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-400">
                The 6th Filter is On Us.
              </span>
            </h2>
            <p className="text-sm text-gray-300 mt-3 leading-relaxed max-w-md">
              Every oil service kit, lamp or body part you buy earns a stamp — in-store or on WhatsApp.
              Collect 5 stamps and your next genuine filter kit is free. No app, no card, just your phone number.
            </p>

            {/* Stamp card visual */}
            <div className="mt-6 bg-white/[0.06] backdrop-blur-sm border border-white/15 rounded-2xl p-5 max-w-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                  <Stamp className="w-3.5 h-3.5 text-brand-red" />
                  Your Stamp Card
                </span>
                <span className="text-[10px] font-bold text-emerald-400">2 stamps to go</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {stamps.map(s => (
                  <div
                    key={s}
                    className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-black border transition-all ${
                      s <= 4
                        ? 'bg-brand-red text-white border-brand-red shadow-brand'
                        : 'bg-white/5 text-gray-500 border-white/15 border-dashed'
                    }`}
                  >
                    {s <= 4 ? <Wrench className="w-4 h-4" /> : s}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-gray-400">
                Member perk: birthday-month 10% off + priority fitting at all 3 hubs.
              </div>
            </div>
          </div>

          {/* Right: Service reminder opt-in */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-elevated relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-red via-red-600 to-brand-charcoal" />

            <div className="flex items-center gap-2 mb-1">
              <CalendarClock className="w-5 h-5 text-brand-red" />
              <h3 className="text-lg font-black text-brand-charcoal tracking-tight">
                Free Service Reminders
              </h3>
            </div>
            <p className="text-xs text-gray-500 mb-5">
              We track your service intervals and ping you on WhatsApp <strong>before</strong> your oil is due —
              with your exact filter and oil spec ready to order in one tap.
            </p>

            {/* Simulated reminder preview */}
            <div className="bg-[#E7FFDB] border border-[#CBEAB9] rounded-xl p-3.5 mb-5 relative">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-gray-500 mb-0.5">Rukwaro Autospares • Today 8:02 AM</div>
                  <div className="text-xs text-gray-800 leading-relaxed">
                    Habari James 👋 Your Fielder NZE161 is due for oil service in ~500 km
                    (last service 4,500 km ago). Toyota Genuine 5W-30 4L + filter:
                    <strong> KSh 5,400</strong>. Reply <strong>"YES"</strong> to reserve at Kirinyaga Rd today.
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <ul className="space-y-2 text-xs text-gray-700 mb-6">
              {[
                'Never miss a service — reminders at 5,000 km intervals',
                'One-tap reorder of your exact oil & filter spec',
                'Early access to Bei ya Leo daily deals',
              ].map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red mt-1.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <a
              href="https://wa.me/254728707344?text=Habari%20Rukwaro%20%F0%9F%91%8B%20Join%20me%20to%20Rukwaro%20Club%20for%20service%20reminders.%0A%0AMy%20name%3A%20%0AMy%20car%3A%20%0APhone%3A%20"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Join Club on WhatsApp</span>
            </a>
            <div className="text-center text-[10px] text-gray-400 mt-2.5">
              Takes 20 seconds. Unsubscribe anytime with one message.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
