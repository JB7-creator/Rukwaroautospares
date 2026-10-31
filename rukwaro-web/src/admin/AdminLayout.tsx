import { useState } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Package,
  Search,
  ShoppingBag,
} from 'lucide-react';
import type { AdminTab } from './adminTypes';

interface AdminLayoutProps {
  activeTab: AdminTab;
  onNavigate: (tab: AdminTab) => void;
  onLogout: () => void;
  children: ReactNode;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
];

const PAGE_META: Record<AdminTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Live overview of sales, stock and order flow.',
  },
  products: {
    title: 'Products',
    subtitle: 'Manage catalogue pricing, branch stock and visibility.',
  },
  orders: {
    title: 'Orders',
    subtitle: 'Track fulfilment across Kirinyaga, Industrial and Westlands.',
  },
};

export const AdminLayout = ({
  activeTab,
  onNavigate,
  onLogout,
  children,
}: AdminLayoutProps) => {
  const [search, setSearch] = useState('');
  const page = PAGE_META[activeTab];

  return (
    <div className="min-h-screen bg-brand-offwhite font-sans text-brand-charcoal">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-16 flex-col border-r border-white/5 bg-brand-charcoal text-white md:w-60">
        <div className="flex h-16 shrink-0 items-center justify-center gap-2.5 border-b border-white/10 px-2 md:justify-start md:px-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white p-1.5">
            <img
              src="/logo-mark.png"
              alt="Rukwaro Autospares"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="hidden min-w-0 md:block">
            <p className="truncate text-sm font-black leading-tight tracking-tight text-white">
              RUKWARO
            </p>
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-gray-500">
              Autospares
            </p>
          </div>
        </div>

        <div className="hidden px-5 pb-2 pt-5 md:block">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-500">
            Workspace
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-2 pt-3 md:px-3 md:pt-0">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                title={item.label}
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex w-full items-center justify-center gap-3 rounded-lg px-0 py-2.5 text-sm font-bold transition-colors md:justify-start md:px-3 ${
                  isActive
                    ? 'bg-brand-red text-white shadow-brand'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="hidden md:inline">{item.label}</span>
                {isActive && (
                  <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-white/90 md:block" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-2 md:p-3">
          <a
            href="#/"
            title="View Website"
            className="group flex w-full items-center justify-center gap-3 rounded-lg px-0 py-2.5 text-sm font-semibold text-gray-400 transition-colors hover:bg-white/5 hover:text-white md:justify-start md:px-3"
          >
            <ExternalLink className="h-5 w-5 shrink-0" />
            <span className="hidden md:inline">View Website</span>
          </a>
          <button
            type="button"
            title="Logout"
            onClick={onLogout}
            className="group flex w-full items-center justify-center gap-3 rounded-lg px-0 py-2.5 text-sm font-semibold text-gray-400 transition-colors hover:bg-brand-red/15 hover:text-red-300 md:justify-start md:px-3"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="hidden md:inline">Logout</span>
          </button>

          <div className="mt-2 hidden rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 md:block">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-500">
              Signed in as
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-red text-[11px] font-black text-white">
                A
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold text-white">Admin</p>
                <p className="truncate text-[10px] text-gray-500">Kirinyaga Rd</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col pl-16 md:pl-60">
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="flex flex-col gap-3 px-4 py-3.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-lg font-black tracking-tight text-brand-charcoal sm:text-xl">
                    {page.title}
                  </h1>
                  <span className="hidden shrink-0 items-center gap-1 rounded-full bg-brand-red/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-brand-red sm:inline-flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                    Live
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-gray-500 sm:text-xs">
                  {page.subtitle}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-1 pl-1 pr-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-charcoal text-[11px] font-black text-white">
                  A
                </span>
                <span className="hidden whitespace-nowrap text-[10px] font-bold text-brand-charcoal sm:inline sm:text-[11px]">
                  Admin <span className="px-0.5 text-gray-400">•</span> Kirinyaga Rd
                </span>
                <span className="whitespace-nowrap text-[10px] font-bold text-brand-charcoal sm:hidden">
                  Admin
                </span>
              </div>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search Rukwaro admin…"
                aria-label="Search Rukwaro admin"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-12 text-xs font-semibold text-brand-charcoal placeholder:font-medium placeholder:text-gray-400 focus:border-brand-red focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/15"
              />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[9px] font-bold text-gray-400 sm:inline-block">
                /
              </kbd>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-brand-offwhite">
          <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
