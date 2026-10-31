/* ------------------------------------------------------------------ */
/* Rukwaro Autospares — Admin domain types                             */
/* ------------------------------------------------------------------ */

export type AdminCategory =
  | 'lighting'
  | 'lenses'
  | 'bumpers-grills'
  | 'fenders-mudflaps'
  | 'oils-lubricants'
  | 'service-parts';

export type AdminGrade =
  | 'OEM Genuine'
  | 'Certified Aftermarket'
  | 'Performance OEM';

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'packing'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export type DeliveryMethod = 'boda' | 'pickup' | 'upcountry' | 'cod';

export type AdminTab = 'dashboard' | 'products' | 'orders';

export interface AdminProduct {
  id: string;
  sku: string;
  name: string;
  category: AdminCategory;
  categoryName: string;
  subcategory: string;
  brand: string;
  grade: AdminGrade;
  priceKes: number;
  originalPriceKes?: number;
  stockKirinyaga: boolean;
  stockIndustrial: boolean;
  stockWestlands: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  badge?: string;
  image: string;
  active: boolean;
}

export interface AdminOrderItem {
  name: string;
  sku: string;
  qty: number;
  priceKes: number;
}

export interface AdminOrder {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  items: AdminOrderItem[];
  totalKes: number;
  deliveryMethod: DeliveryMethod;
  branch: string;
  status: OrderStatus;
  vehicle?: string;
  notes?: string;
}

/* ------------------------------ Categories ------------------------ */

export const ADMIN_CATEGORY_LABELS: Record<AdminCategory, string> = {
  lighting: 'Lighting',
  lenses: 'Replacement Lenses',
  'bumpers-grills': 'Bumpers & Grills',
  'fenders-mudflaps': 'Fenders & Mudflaps',
  'oils-lubricants': 'Oils & Lubricants',
  'service-parts': 'Service Parts',
};

export const ADMIN_CATEGORIES: ReadonlyArray<{
  value: AdminCategory;
  label: string;
}> = (Object.keys(ADMIN_CATEGORY_LABELS) as AdminCategory[]).map((value) => ({
  value,
  label: ADMIN_CATEGORY_LABELS[value],
}));

export const ADMIN_GRADES: ReadonlyArray<AdminGrade> = [
  'OEM Genuine',
  'Certified Aftermarket',
  'Performance OEM',
];

/* -------------------------------- Orders -------------------------- */

export const ORDER_STATUSES: ReadonlyArray<OrderStatus> = [
  'new',
  'confirmed',
  'packing',
  'dispatched',
  'delivered',
  'cancelled',
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'New',
  confirmed: 'Confirmed',
  packing: 'Packing',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  new: 'border-blue-200 bg-blue-50 text-blue-700',
  confirmed: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  packing: 'border-amber-200 bg-amber-50 text-amber-800',
  dispatched: 'border-purple-200 bg-purple-50 text-purple-700',
  delivered: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  cancelled: 'border-gray-200 bg-gray-100 text-gray-600',
};

export const ORDER_STATUS_DOTS: Record<OrderStatus, string> = {
  new: 'bg-blue-500',
  confirmed: 'bg-indigo-500',
  packing: 'bg-amber-500',
  dispatched: 'bg-purple-500',
  delivered: 'bg-emerald-500',
  cancelled: 'bg-gray-400',
};

export const DELIVERY_METHOD_LABELS: Record<DeliveryMethod, string> = {
  boda: 'Boda delivery',
  pickup: 'Branch pickup',
  upcountry: 'Upcountry courier',
  cod: 'Cash on delivery',
};

/* ------------------------------- Session -------------------------- */

export const ADMIN_SESSION_KEY = 'rukwaro.admin.session';
