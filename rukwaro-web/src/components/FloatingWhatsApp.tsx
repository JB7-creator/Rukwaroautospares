import React, { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

/**
 * Floating WhatsApp action button with expandable quick-actions.
 * Appears after the user scrolls past the hero — keeps the #1 Kenyan
 * conversion path one tap away everywhere on the page.
 */
export const FloatingWhatsApp: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  const quickActions = [
    {
      label: 'Check a part / fitment',
      msg: 'Hello Rukwaro! I want to confirm a part fits my car. My car is: ',
    },
    {
      label: 'Request a quote',
      msg: 'Hello Rukwaro! Please quote me for: ',
    },
    {
      label: 'Track my order',
      msg: 'Hello Rukwaro! I would like a delivery update on my order.',
    },
    {
      label: 'Fleet / bulk pricing',
      msg: 'Hello Rukwaro! I run a fleet and would like wholesale pricing on: ',
    },
  ];

  return (
    <div className="fixed bottom-5 left-5 z-[60] flex flex-col items-start gap-2">
      {/* Quick actions panel */}
      {expanded && (
        <div className="bg-white rounded-2xl shadow-elevated border border-gray-200 p-2 w-64 animate-toast-in">
          <div className="px-2 pt-1 pb-2 text-[10px] font-black uppercase tracking-wider text-gray-400">
            Chat with a Parts Specialist
          </div>
          {quickActions.map((a, i) => (
            <a
              key={i}
              href={`https://wa.me/254728707344?text=${encodeURIComponent(a.msg)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setExpanded(false)}
              className="block px-3 py-2 rounded-lg text-xs font-semibold text-brand-charcoal hover:bg-red-50 hover:text-brand-red transition-colors"
            >
              {a.label}
            </a>
          ))}
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="group relative flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white pl-3.5 pr-4 py-3 rounded-full shadow-elevated transition-all active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
        </span>
        {expanded ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        <span className="text-xs font-bold hidden sm:inline">
          {expanded ? 'Close' : 'Chat With Us'}
        </span>
      </button>
    </div>
  );
};
