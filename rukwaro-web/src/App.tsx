import React, { useState, useMemo, useEffect } from 'react';
import {
  Navbar
} from './components/Navbar';
import {
  HeroSection
} from './components/HeroSection';
import { TrustBar } from './components/TrustBar';
import { DailyDeals } from './components/DailyDeals';
import {
  TrustPillars
} from './components/TrustPillars';
import { ContainerArrivals } from './components/ContainerArrivals';
import {
  LensSpotlight
} from './components/LensSpotlight';
import {
  ExplodedDiagram
} from './components/ExplodedDiagram';
import {
  ProductCard
} from './components/ProductCard';
import {
  ProductDetailModal
} from './components/ProductDetailModal';
import {
  FranchiseBranches
} from './components/FranchiseBranches';
import { RukwaroClub } from './components/RukwaroClub';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { PartsAssistant } from './components/PartsAssistant';
import {
  CartDrawer
} from './components/CartDrawer';
import {
  GarageModal
} from './components/GarageModal';
import {
  Footer
} from './components/Footer';
import { useToast } from './components/Toast';

import {
  PRODUCTS,
  BRANCHES,
  POPULAR_VEHICLES
} from './data/mockData';
import {
  Vehicle,
  Product,
  CartItem,
  Branch
} from './types';
import {
  ShieldAlert
} from 'lucide-react';
import {
  loadJSON,
  saveJSON,
  STORAGE_KEYS
} from './utils/storage';
import { LegalPage } from './pages/Legal';
import { AdminApp } from './admin/AdminApp';
import type { AdminProduct } from './admin/adminTypes';

/* Storefront catalog → admin domain model (module-level, mapped once) */
const ADMIN_CATALOG: AdminProduct[] = PRODUCTS.map((p) => ({
  id: p.id,
  sku: p.sku,
  name: p.name,
  category: p.category,
  categoryName: p.categoryName,
  subcategory: p.subcategory,
  brand: p.brand,
  grade: p.grade,
  priceKes: p.priceKes,
  originalPriceKes: p.originalPriceKes,
  stockKirinyaga: p.inStockBranches.kirinyagaRoad,
  stockIndustrial: p.inStockBranches.industrialArea,
  stockWestlands: p.inStockBranches.westlands,
  isFeatured: Boolean(p.isFeatured),
  isBestseller: Boolean(p.isBestseller),
  badge: p.badge,
  image: p.image,
  active: true,
}));

export const App: React.FC = () => {
  const { showToast } = useToast();

  // Lightweight hash router (#/terms, #/privacy, #/returns, #/admin)
  const [hash, setHash] = useState<string>(() => window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Vehicle Fitment State (persisted — "My Garage" survives reloads)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(() =>
    loadJSON<Vehicle | null>(STORAGE_KEYS.ACTIVE_VEHICLE, null)
  );
  const [isGarageModalOpen, setIsGarageModalOpen] = useState<boolean>(false);

  // Branch Selection State (persisted)
  const [selectedBranch, setSelectedBranch] = useState<Branch>(() =>
    loadJSON<Branch>(STORAGE_KEYS.BRANCH, BRANCHES[0])
  );

  // Category & Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFleetFilter, setSelectedFleetFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Modal & Cart State (cart persisted — never lose a customer's basket)
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadJSON<CartItem[]>(STORAGE_KEYS.CART, [])
  );
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() =>
    loadJSON<string[]>(STORAGE_KEYS.RECENTLY_VIEWED, [])
  );

  /* ---------------------- Persistence effects ---------------------- */
  useEffect(() => { saveJSON(STORAGE_KEYS.CART, cartItems); }, [cartItems]);
  useEffect(() => { saveJSON(STORAGE_KEYS.ACTIVE_VEHICLE, selectedVehicle); }, [selectedVehicle]);
  useEffect(() => { saveJSON(STORAGE_KEYS.BRANCH, selectedBranch); }, [selectedBranch]);
  useEffect(() => { saveJSON(STORAGE_KEYS.RECENTLY_VIEWED, recentlyViewed); }, [recentlyViewed]);

  /* ------------------------- Cart operations ----------------------- */
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast({
      kind: 'cart',
      title: 'Added to Cart',
      message: `${product.name} — KSh ${product.priceKes.toLocaleString()}`,
      image: product.image,
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  /* ------------------- Recently viewed tracking -------------------- */
  const handleOpenDetail = (product: Product) => {
    setActiveProductModal(product);
    setRecentlyViewed(prev => [product.id, ...prev.filter(id => id !== product.id)].slice(0, 8));
  };

  /* --------------------- Related / viewed lists -------------------- */
  const relatedProducts = useMemo(() => {
    if (!activeProductModal) return [];
    // "Complete the job": same category first, then same-fitment complements
    const sameCategory = PRODUCTS.filter(
      p => p.id !== activeProductModal.id && p.category === activeProductModal.category
    );
    const sameFitment = PRODUCTS.filter(
      p => p.id !== activeProductModal.id &&
           p.category !== activeProductModal.category &&
           p.compatibleVehicles.some(cv =>
             activeProductModal.compatibleVehicles.some(oc => oc === cv)
           )
    );
    return [...sameCategory, ...sameFitment];
  }, [activeProductModal]);

  const recentProducts = useMemo(() =>
    recentlyViewed
      .map(id => PRODUCTS.find(p => p.id === id))
      .filter((p): p is Product => Boolean(p)),
    [recentlyViewed]
  );

  // Filtered Products Memo
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        const matchesOem = product.oemPartNumber.toLowerCase().includes(q);
        const matchesSubcat = product.subcategory.toLowerCase().includes(q);
        const matchesVehicles = product.compatibleVehicles.some(cv => cv.toLowerCase().includes(q));
        if (!matchesName && !matchesSku && !matchesOem && !matchesSubcat && !matchesVehicles) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // 3. Quick Fleet Model Filter
      if (selectedFleetFilter !== 'all') {
        const matchesFleet = product.compatibleVehicles.some(cv =>
          cv.toLowerCase().includes(selectedFleetFilter.toLowerCase())
        );
        if (!matchesFleet) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceKes - b.priceKes;
      if (sortBy === 'price-desc') return b.priceKes - a.priceKes;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [searchQuery, selectedCategory, selectedFleetFilter, sortBy]);

  const categories = [
    { id: 'all', label: 'All Spares & Fluids' },
    { id: 'lighting', label: 'Lighting & Lamps (Head & Tail)' },
    { id: 'lenses', label: 'Replacement Lenses (Save 75%)' },
    { id: 'bumpers-grills', label: 'Bumpers & Grills' },
    { id: 'fenders-mudflaps', label: 'Inner Fenders & Mudflaps' },
    { id: 'oils-lubricants', label: 'Engine Oils & Lubricants' },
    { id: 'service-parts', label: 'Service Parts & Consumables' },
  ];

  const fleetPills = [
    { id: 'all', label: 'All Fleet Models' },
    { id: 'Fielder', label: 'Toyota Fielder (NZE161/164)' },
    { id: 'D-Max', label: 'Isuzu D-Max (TFR/RT50/RG01)' },
    { id: 'CX-5', label: 'Mazda CX-5 (KE & KF)' },
    { id: 'Demio', label: 'Mazda Demio (DJ3FS)' },
    { id: 'AE110', label: 'Toyota AE110 / AE111' },
    { id: 'Juke', label: 'Nissan Juke (F15)' },
    { id: 'Hiace', label: 'Toyota Hiace (KDH200)' },
    { id: 'Ranger', label: 'Ford Ranger (T6)' },
  ];

  /* -------------------------- Legal routes ------------------------- */
  if (hash.startsWith('#/terms')) {
    return <LegalPage doc="terms" onBack={() => { window.location.hash = ''; }} />;
  }
  if (hash.startsWith('#/privacy')) {
    return <LegalPage doc="privacy" onBack={() => { window.location.hash = ''; }} />;
  }
  if (hash.startsWith('#/returns')) {
    return <LegalPage doc="returns" onBack={() => { window.location.hash = ''; }} />;
  }
  if (hash.startsWith('#/admin')) {
    return <AdminApp products={ADMIN_CATALOG} orders={[]} />;
  }

  return (
    <div className="min-h-screen bg-white text-brand-charcoal flex flex-col font-sans">

      {/* 1. TOP HEADER & NAVIGATION */}
      <Navbar
        selectedVehicle={selectedVehicle}
        onOpenGarageModal={() => setIsGarageModalOpen(true)}
        onClearVehicle={() => setSelectedVehicle(null)}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
      />

      {/* 2. LIVE HERO SECTION WITH BACKGROUND VIDEO */}
      <HeroSection
        onSelectVehicle={(v) => setSelectedVehicle(v)}
        selectedVehicle={selectedVehicle}
      />

      {/* 3. SITewide TRUST BAR — physical stores, KEBS, COD, NTSA */}
      <TrustBar />

      {/* 4. DEAL OF THE DAY — "Bei ya Leo" daily rotation with countdown */}
      <DailyDeals
        products={PRODUCTS}
        onAddToCart={handleAddToCart}
        onOpenDetail={handleOpenDetail}
      />

      {/* 5. FOUR CORE BRAND TRUST PILLARS */}
      <TrustPillars />

      {/* 6. CONTAINER IMEFIKA — fresh arrivals feed (daily-return hook) */}
      <ContainerArrivals
        products={PRODUCTS}
        onOpenDetail={handleOpenDetail}
        onAddToCart={handleAddToCart}
      />

      {/* 7. RUKWARO LENS SPOTLIGHT (Signature Solution) */}
      <LensSpotlight
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* 8. INTERACTIVE EXPLODED VEHICLE DIAGRAM */}
      <ExplodedDiagram
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* 9. MAIN PRODUCT CATALOG & PARTS FINDER */}
      <main id="catalog" className="py-12 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-brand-red text-xs font-bold uppercase tracking-widest mb-1">
                <span>Direct Franchise Catalog</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
                {selectedCategory === 'all' ? 'Featured Auto Spares & Fluids' : categories.find(c => c.id === selectedCategory)?.label}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Showing <strong>{filteredProducts.length}</strong> guaranteed parts ready for same-day dispatch or pickup at <strong>{selectedBranch.name}</strong>.
              </p>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 self-start md:self-auto text-xs">
              <span className="text-gray-500 font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-50 border border-brand-lightgray rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red"
              >
                <option value="featured">Featured & Bestsellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter Tabs — anchor ids for footer/mobile-nav deep links */}
          <div id="lighting" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4 scroll-mt-36">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-brand-red border-brand-red text-white shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Vehicle Fleet Filter Pills */}
          <div id="body" className="flex items-center gap-1.5 overflow-x-auto pb-4 scrollbar-none mb-8 text-xs scroll-mt-36">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 shrink-0 mr-1">
              Filter by Car:
            </span>
            {fleetPills.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFleetFilter(f.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  selectedFleetFilter === f.id
                    ? 'bg-brand-charcoal text-white font-bold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-gray-50 rounded-2xl border border-gray-200 p-8 space-y-4">
              <ShieldAlert className="w-12 h-12 text-brand-red mx-auto" />
              <h3 className="text-lg font-bold text-brand-charcoal">
                No parts match your specific filter criteria
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                We have over 10,000+ unlisted parts in our Kirinyaga Road & Industrial Area central warehouses. Inquire directly with our parts specialist on WhatsApp.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedFleetFilter('all');
                    setSearchQuery('');
                  }}
                  className="bg-brand-charcoal text-white text-xs font-bold px-4 py-2 rounded-lg"
                >
                  Reset All Filters
                </button>
                <a
                  href="https://wa.me/254728707344?text=Hello%20Rukwaro,%20I'm%20looking%20for%20a%20part%20not%20found%20online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white text-xs font-bold px-4 py-2 rounded-lg"
                >
                  Ask Specialist on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selectedVehicle={selectedVehicle}
                  onAddToCart={handleAddToCart}
                  onOpenDetail={handleOpenDetail}
                  currentBranch={selectedBranch}
                />
              ))}
            </div>
          )}

          {/* Recently Viewed — persistence-powered return path */}
          {recentProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-brand-charcoal uppercase tracking-wider">
                  Recently Viewed Parts
                </h3>
                <span className="text-[11px] text-gray-400">Saved on this device</span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
                {recentProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleOpenDetail(p)}
                    className="group flex items-center gap-3 bg-white border border-gray-200 hover:border-brand-red/40 rounded-xl p-2.5 min-w-[260px] text-left transition-all"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-14 h-14 rounded-lg object-cover border border-gray-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-brand-charcoal line-clamp-2 leading-tight group-hover:text-brand-red transition-colors">
                        {p.name}
                      </div>
                      <div className="text-xs font-black text-brand-red mt-0.5">
                        KSh {p.priceKes.toLocaleString()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* 10. OILS ANCHOR STRIP — deep-link target for footer/oils */}
      <div id="oils" className="scroll-mt-36" />

      {/* 11. FRANCHISE HUBS & BRANCHES */}
      <div id="branches" className="scroll-mt-36">
        <FranchiseBranches
          selectedBranch={selectedBranch}
          onSelectBranch={setSelectedBranch}
        />
      </div>

      {/* 12. RUKWARO CLUB — loyalty stamps + service reminders */}
      <RukwaroClub />

      {/* 13. TESTIMONIALS — social proof with merchant replies */}
      <Testimonials />

      {/* 14. FAQ — objections + NTSA + SEO */}
      <FAQ />

      {/* 15. FOOTER WITH BRAND GUIDELINES & SEO TARGETS */}
      <Footer />

      {/* FLOATING WHATSAPP — always one tap away */}
      <FloatingWhatsApp />

      {/* AI PARTS ASSISTANT — catalog-aware, fitment-first */}
      <PartsAssistant
        onAddToCart={handleAddToCart}
        onOpenDetail={handleOpenDetail}
        currentBranch={selectedBranch}
      />

      {/* MODALS & DRAWERS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        currentBranch={selectedBranch}
        selectedVehicle={selectedVehicle}
      />

      <ProductDetailModal
        product={activeProductModal}
        onClose={() => setActiveProductModal(null)}
        selectedVehicle={selectedVehicle}
        onAddToCart={handleAddToCart}
        currentBranch={selectedBranch}
        relatedProducts={relatedProducts}
        onOpenDetail={handleOpenDetail}
      />

      <GarageModal
        isOpen={isGarageModalOpen}
        onClose={() => setIsGarageModalOpen(false)}
        selectedVehicle={selectedVehicle}
        onSelectVehicle={(v) => setSelectedVehicle(v)}
        onClearVehicle={() => setSelectedVehicle(null)}
      />

    </div>
  );
};
