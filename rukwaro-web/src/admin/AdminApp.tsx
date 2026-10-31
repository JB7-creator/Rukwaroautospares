import { useState } from 'react';
import type { AdminOrder, AdminProduct, AdminTab } from './adminTypes';
import { ADMIN_SESSION_KEY } from './adminTypes';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';

interface AdminAppProps {
  products: AdminProduct[];
  orders: AdminOrder[];
}

/* ------------------------------------------------------------------ */
/* Demo seed data — computed once when this module loads               */
/* ------------------------------------------------------------------ */

const NOW_MS = Date.now();
const TODAY_START_MS = (() => {
  const date = new Date(NOW_MS);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
})();

const todayAt = (hours: number, minutes: number): string => {
  const date = new Date(NOW_MS);
  date.setHours(hours, minutes, 0, 0);
  const target = Math.min(date.getTime(), NOW_MS - 5 * 60 * 1000);
  return new Date(Math.max(target, TODAY_START_MS)).toISOString();
};

const yesterdayAt = (hours: number, minutes: number): string => {
  const date = new Date(NOW_MS);
  date.setDate(date.getDate() - 1);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

const DEMO_PRODUCTS: AdminProduct[] = [
  {
    id: 'p-fielder-led',
    sku: 'RUK-LGT-101',
    name: 'Toyota Fielder LED Headlamp',
    category: 'lighting',
    categoryName: 'Lighting',
    subcategory: 'Headlamps',
    brand: 'Toyota',
    grade: 'OEM Genuine',
    priceKes: 16500,
    originalPriceKes: 19500,
    stockKirinyaga: true,
    stockIndustrial: false,
    stockWestlands: true,
    isFeatured: true,
    isBestseller: true,
    badge: 'Hot Deal',
    image:
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=200&q=60',
    active: true,
  },
  {
    id: 'p-dmax-headlamp',
    sku: 'RUK-LGT-118',
    name: 'Isuzu D-Max Headlamp',
    category: 'lighting',
    categoryName: 'Lighting',
    subcategory: 'Headlamps',
    brand: 'Isuzu',
    grade: 'OEM Genuine',
    priceKes: 18500,
    originalPriceKes: 21000,
    stockKirinyaga: true,
    stockIndustrial: true,
    stockWestlands: false,
    isFeatured: true,
    isBestseller: false,
    badge: 'New Arrival',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=200&q=60',
    active: true,
  },
  {
    id: 'p-cx5-taillamp',
    sku: 'RUK-LGT-127',
    name: 'Mazda CX-5 Tail Lamp',
    category: 'lighting',
    categoryName: 'Lighting',
    subcategory: 'Tail Lamps',
    brand: 'Mazda',
    grade: 'Certified Aftermarket',
    priceKes: 14500,
    originalPriceKes: 17000,
    stockKirinyaga: false,
    stockIndustrial: true,
    stockWestlands: false,
    isFeatured: false,
    isBestseller: true,
    image:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=200&q=60',
    active: true,
  },
  {
    id: 'p-ae110-pair',
    sku: 'RUK-LGT-109',
    name: 'Toyota AE110 Crystal Headlamp Pair',
    category: 'lighting',
    categoryName: 'Lighting',
    subcategory: 'Headlamp Pairs',
    brand: 'Toyota',
    grade: 'Performance OEM',
    priceKes: 12500,
    originalPriceKes: 16000,
    stockKirinyaga: true,
    stockIndustrial: false,
    stockWestlands: true,
    isFeatured: true,
    isBestseller: true,
    image:
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=200&q=60',
    active: true,
  },
  {
    id: 'p-fielder-lens',
    sku: 'RUK-LNS-204',
    name: 'Toyota Fielder Replacement Lens',
    category: 'lenses',
    categoryName: 'Replacement Lenses',
    subcategory: 'Replacement Lenses',
    brand: 'Toyota',
    grade: 'Certified Aftermarket',
    priceKes: 3800,
    originalPriceKes: 6500,
    stockKirinyaga: true,
    stockIndustrial: true,
    stockWestlands: true,
    isFeatured: false,
    isBestseller: true,
    badge: 'Save 42%',
    image:
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=200&q=60',
    active: true,
  },
  {
    id: 'p-dmax-bumper',
    sku: 'RUK-BMP-311',
    name: 'Isuzu D-Max Front Bumper',
    category: 'bumpers-grills',
    categoryName: 'Bumpers & Grills',
    subcategory: 'Front Bumpers',
    brand: 'Isuzu',
    grade: 'Certified Aftermarket',
    priceKes: 14500,
    originalPriceKes: 18000,
    stockKirinyaga: false,
    stockIndustrial: true,
    stockWestlands: true,
    isFeatured: false,
    isBestseller: false,
    badge: 'Container Deal',
    image:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=200&q=60',
    active: true,
  },
  {
    id: 'p-toyota-oil',
    sku: 'RUK-OIL-402',
    name: 'Toyota 5W-30 Engine Oil 4L',
    category: 'oils-lubricants',
    categoryName: 'Oils & Lubricants',
    subcategory: 'Engine Oil',
    brand: 'Toyota',
    grade: 'OEM Genuine',
    priceKes: 4600,
    originalPriceKes: 5200,
    stockKirinyaga: true,
    stockIndustrial: true,
    stockWestlands: true,
    isFeatured: true,
    isBestseller: true,
    badge: 'Best Seller',
    image:
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=200&q=60',
    active: true,
  },
  {
    id: 'p-besco-oil',
    sku: 'RUK-OIL-415',
    name: 'Besco 15W-40 Engine Oil 5L',
    category: 'oils-lubricants',
    categoryName: 'Oils & Lubricants',
    subcategory: 'Engine Oil',
    brand: 'Besco',
    grade: 'Certified Aftermarket',
    priceKes: 5200,
    stockKirinyaga: true,
    stockIndustrial: false,
    stockWestlands: false,
    isFeatured: false,
    isBestseller: true,
    image:
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=200&q=60',
    active: true,
  },
];

const DEMO_ORDERS: AdminOrder[] = [
  {
    id: 'RK-1071',
    createdAt: todayAt(9, 12),
    customerName: 'James Mwangi',
    phone: '0712 345 678',
    items: [
      {
        name: 'Toyota Fielder LED Headlamp',
        sku: 'RUK-LGT-101',
        qty: 1,
        priceKes: 16500,
      },
    ],
    totalKes: 16500,
    deliveryMethod: 'boda',
    branch: 'Kirinyaga Rd',
    status: 'new',
    vehicle: 'Toyota Fielder (NZE161)',
    notes: 'Call on arrival — customer is at a nearby garage.',
  },
  {
    id: 'RK-1070',
    createdAt: todayAt(8, 30),
    customerName: 'Grace Wanjiru',
    phone: '0723 456 789',
    items: [
      {
        name: 'Mazda CX-5 Tail Lamp',
        sku: 'RUK-LGT-127',
        qty: 1,
        priceKes: 14500,
      },
      {
        name: 'Toyota Fielder Replacement Lens',
        sku: 'RUK-LNS-204',
        qty: 1,
        priceKes: 3800,
      },
    ],
    totalKes: 18300,
    deliveryMethod: 'pickup',
    branch: 'Westlands',
    status: 'confirmed',
    vehicle: 'Mazda CX-5 (KE)',
  },
  {
    id: 'RK-1069',
    createdAt: todayAt(7, 55),
    customerName: 'Otieno David',
    phone: '0734 567 890',
    items: [
      {
        name: 'Isuzu D-Max Headlamp',
        sku: 'RUK-LGT-118',
        qty: 1,
        priceKes: 18500,
      },
      {
        name: 'Toyota 5W-30 Engine Oil 4L',
        sku: 'RUK-OIL-402',
        qty: 1,
        priceKes: 4600,
      },
    ],
    totalKes: 23100,
    deliveryMethod: 'boda',
    branch: 'Industrial Area',
    status: 'packing',
    vehicle: 'Isuzu D-Max (TFR)',
    notes: 'Please confirm fitment before dispatch.',
  },
  {
    id: 'RK-1068',
    createdAt: yesterdayAt(18, 40),
    customerName: 'Aisha Hassan',
    phone: '0745 678 901',
    items: [
      {
        name: 'Toyota AE110 Crystal Headlamp Pair',
        sku: 'RUK-LGT-109',
        qty: 1,
        priceKes: 12500,
      },
    ],
    totalKes: 12500,
    deliveryMethod: 'upcountry',
    branch: 'Kirinyaga Rd',
    status: 'dispatched',
    vehicle: 'Toyota AE110',
    notes: 'Upcountry courier to Nyeri.',
  },
  {
    id: 'RK-1067',
    createdAt: yesterdayAt(16, 15),
    customerName: 'Samuel Kariuki',
    phone: '0756 789 012',
    items: [
      {
        name: 'Besco 15W-40 Engine Oil 5L',
        sku: 'RUK-OIL-415',
        qty: 2,
        priceKes: 5200,
      },
    ],
    totalKes: 10400,
    deliveryMethod: 'pickup',
    branch: 'Industrial Area',
    status: 'delivered',
    vehicle: 'Isuzu D-Max (RT50)',
  },
  {
    id: 'RK-1066',
    createdAt: yesterdayAt(13, 5),
    customerName: 'Mary Njoki',
    phone: '0767 890 123',
    items: [
      {
        name: 'Isuzu D-Max Front Bumper',
        sku: 'RUK-BMP-311',
        qty: 1,
        priceKes: 14500,
      },
    ],
    totalKes: 14500,
    deliveryMethod: 'boda',
    branch: 'Westlands',
    status: 'delivered',
    vehicle: 'Mazda CX-5 (KF)',
    notes: 'Customer will pick up after 6pm.',
  },
  {
    id: 'RK-1065',
    createdAt: yesterdayAt(11, 20),
    customerName: 'Peter Kamau',
    phone: '0778 901 234',
    items: [
      {
        name: 'Toyota 5W-30 Engine Oil 4L',
        sku: 'RUK-OIL-402',
        qty: 1,
        priceKes: 4600,
      },
    ],
    totalKes: 4600,
    deliveryMethod: 'cod',
    branch: 'Kirinyaga Rd',
    status: 'cancelled',
    vehicle: 'Toyota Fielder (NZE164)',
    notes: 'Customer cancelled — part sourced elsewhere.',
  },
];

const hasStoredSession = (): boolean => {
  try {
    return window.localStorage.getItem(ADMIN_SESSION_KEY) === '1';
  } catch {
    return false;
  }
};

export const AdminApp = ({ products, orders }: AdminAppProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(hasStoredSession);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const catalog = products.length > 0 ? products : DEMO_PRODUCTS;
  const orderFeed = orders.length > 0 ? orders : DEMO_ORDERS;

  const handleLogout = () => {
    try {
      window.localStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // Nothing else to clear when storage is unavailable.
    }
    setActiveTab('dashboard');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderActivePage = () => {
    if (activeTab === 'products') {
      return <AdminProducts initialProducts={catalog} />;
    }
    if (activeTab === 'orders') {
      return <AdminOrders initialOrders={orderFeed} />;
    }
    return <AdminDashboard products={catalog} orders={orderFeed} />;
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onNavigate={setActiveTab}
      onLogout={handleLogout}
    >
      {renderActivePage()}
    </AdminLayout>
  );
};
