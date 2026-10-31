import React, { createContext, useCallback, useContext, useState, useRef } from 'react';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Lightweight toast system — no dependencies                          */
/* ------------------------------------------------------------------ */

interface Toast {
  id: number;
  title: string;
  message?: string;
  image?: string;
  kind: 'cart' | 'success' | 'info';
}

interface ToastContextValue {
  showToast: (t: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev.slice(-2), { ...t, id }]); // max 3 visible
    window.setTimeout(() => {
      setToasts(prev => prev.filter(x => x.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast viewport */}
      <div className="fixed bottom-5 right-5 z-[70] flex flex-col gap-2.5 pointer-events-none max-w-xs w-full">
        {toasts.map(t => (
          <div
            key={t.id}
            className="pointer-events-auto bg-white border border-gray-200 shadow-elevated rounded-xl p-3 flex items-center gap-3 animate-toast-in"
            role="status"
          >
            {t.image ? (
              <img src={t.image} alt="" className="w-11 h-11 rounded-lg object-cover border border-gray-100 shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            )}
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-brand-charcoal flex items-center gap-1.5">
                {t.kind === 'cart' && <ShoppingBag className="w-3.5 h-3.5 text-brand-red" />}
                <span className="truncate">{t.title}</span>
              </div>
              {t.message && (
                <div className="text-[11px] text-gray-500 truncate">{t.message}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
