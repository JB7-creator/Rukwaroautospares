import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Search, 
  ShoppingCart, 
  Car, 
  ShieldCheck, 
  MessageCircle, 
  Menu, 
  X, 
  ChevronDown 
} from 'lucide-react';
import { Vehicle, Branch } from '../types';
import { BRANCHES } from '../data/mockData';

interface NavbarProps {
  selectedVehicle: Vehicle | null;
  onOpenGarageModal: () => void;
  onClearVehicle: () => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedBranch: Branch;
  onSelectBranch: (branch: Branch) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedVehicle,
  onOpenGarageModal,
  onClearVehicle,
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  selectedBranch,
  onSelectBranch,
}) => {
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-brand-lightgray shadow-sm">
      {/* 1. TOP UTILITY BAR (Black & Red accent) */}
      <div className="bg-brand-charcoal text-white text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Left: Branch Pickup & Hotline */}
          <div className="flex items-center flex-wrap gap-4">
            {/* Branch Selector Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                className="flex items-center gap-1.5 hover:text-brand-redLight transition-colors font-medium text-gray-200"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-red" />
                <span>Pickup Hub: <strong className="text-white underline decoration-brand-red decoration-2 underline-offset-2">{selectedBranch.name}</strong></span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {branchDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white text-brand-charcoal rounded-lg shadow-elevated border border-brand-lightgray z-50 p-2">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                    Select Your Nearest Rukwaro Hub
                  </div>
                  {BRANCHES.map(b => (
                    <button
                      key={b.id}
                      onClick={() => {
                        onSelectBranch(b);
                        setBranchDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-md transition-colors flex flex-col gap-0.5 text-xs ${
                        selectedBranch.id === b.id ? 'bg-red-50 text-brand-red font-semibold' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-semibold">{b.name}</span>
                      <span className="text-[11px] text-gray-500">{b.highlight}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="hidden md:inline text-gray-600">|</span>

            {/* Helpline Phone */}
            <a 
              href="tel:0728707344" 
              className="hidden sm:flex items-center gap-1.5 text-gray-200 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-red" />
              <span>Direct Hotline: <strong className="text-white">0728 707 344</strong></span>
            </a>

            <span className="hidden lg:inline text-gray-600">|</span>

            {/* Operating Hours */}
            <div className="hidden lg:flex items-center gap-1.5 text-gray-300">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Nairobi & Environs Same-Day Delivery</span>
            </div>
          </div>

          {/* Right: WhatsApp Direct Quote CTA */}
          <div className="flex items-center gap-3">
            <a 
              href="https://wa.me/254728707344?text=Hello%20Rukwaro%20Autospares,%20I%20need%20a%20part%20fitment%20check" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-white bg-[#25D366] hover:bg-[#20ba59] px-2.5 py-1 rounded font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Parts Specialist</span>
            </a>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER (Logo, Search, My Garage, Cart) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo with strict brand reproduction */}
          <a href="#" className="flex items-center gap-3 group shrink-0">
            {/* Speed Dial Gauge R Logo */}
            <div className="relative w-12 h-12 flex items-center justify-center bg-white rounded-lg p-1 transition-transform group-hover:scale-105">
              <img 
                src="/logo-mark.png" 
                alt="Rukwaro Logo Mark" 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black tracking-tight text-brand-red leading-none">
                  RUKWARO
                </span>
              </div>
              <span className="text-[10px] font-bold tracking-[0.28em] text-brand-charcoal uppercase leading-tight">
                AUTOSPARES
              </span>
              <span className="text-[9px] font-medium text-gray-500 tracking-wide">
                Precision Parts. Peak Performance.
              </span>
            </div>
          </a>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search part name, OEM number (e.g. 81110-12K10), car model (D-Max, Fielder, AE110)..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-brand-lightgray rounded-full text-sm text-brand-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-3.5 top-3 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons: My Garage & Cart */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* "My Garage" Vehicle Selector Button */}
            <button
              onClick={onOpenGarageModal}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                selectedVehicle 
                  ? 'bg-red-50 border-brand-red text-brand-red shadow-sm'
                  : 'bg-gray-50 hover:bg-gray-100 border-brand-lightgray text-brand-charcoal'
              }`}
            >
              <Car className={`w-4 h-4 ${selectedVehicle ? 'text-brand-red animate-pulse' : 'text-gray-600'}`} />
              <div className="text-left hidden sm:block">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 leading-none">
                  {selectedVehicle ? 'Current Vehicle' : 'Vehicle Fitment'}
                </div>
                <div className="font-bold text-xs truncate max-w-[130px]">
                  {selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : 'Select Your Car'}
                </div>
              </div>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-brand-charcoal hover:bg-black text-white px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-4 h-4 text-brand-red" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-red text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-brand-charcoal hover:text-brand-red"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden mt-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search parts, lenses, OEM code, car model..."
              className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-brand-lightgray rounded-full text-xs text-brand-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>
      </div>

      {/* 3. ACTIVE VEHICLE BANNER (If vehicle is selected) */}
      {selectedVehicle && (
        <div className="bg-red-50 border-t border-b border-red-200 py-1.5 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-red shrink-0" />
              <span className="text-gray-800">
                Fitment Filter Active: <strong className="text-brand-charcoal">{selectedVehicle.years} {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.chassisCode})</strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenGarageModal}
                className="text-brand-red font-semibold hover:underline"
              >
                Change
              </button>
              <button
                onClick={onClearVehicle}
                className="text-gray-500 hover:text-gray-800 text-[11px]"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-brand-lightgray p-4 space-y-3">
          <div className="font-bold text-xs uppercase tracking-wider text-gray-400">Quick Navigation</div>
          <a href="#lighting" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm font-semibold hover:text-brand-red">Vehicle Lighting & Lenses</a>
          <a href="#body" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm font-semibold hover:text-brand-red">Bumpers, Grilles & Mudflaps</a>
          <a href="#oils" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm font-semibold hover:text-brand-red">Engine Oils & Lubricants</a>
          <a href="#branches" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm font-semibold hover:text-brand-red">Franchise Branch Locations</a>
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <a href="tel:0728707344" className="text-xs text-brand-charcoal flex items-center gap-2 font-medium">
              <Phone className="w-3.5 h-3.5 text-brand-red" /> 0728 707 344
            </a>
            <a href="tel:0712843544" className="text-xs text-brand-charcoal flex items-center gap-2 font-medium">
              <Phone className="w-3.5 h-3.5 text-brand-red" /> 0712 843 544
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
