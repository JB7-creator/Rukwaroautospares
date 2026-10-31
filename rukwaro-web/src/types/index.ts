export interface Vehicle {
  id: string;
  make: string;
  model: string;
  chassisCode: string;
  years: string;
  engine: string;
  category: string;
}

export type PartCategory = 
  | 'lighting' 
  | 'lenses' 
  | 'bumpers-grills' 
  | 'fenders-mudflaps' 
  | 'oils-lubricants'
  | 'service-parts';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: PartCategory;
  categoryName: string;
  subcategory: string;
  brand: string;
  grade: 'OEM Genuine' | 'Certified Aftermarket' | 'Performance OEM';
  oemPartNumber: string;
  side?: 'LHS (Passenger)' | 'RHS (Driver)' | 'Pair (L+R)' | 'Universal' | 'Front' | 'Rear';
  priceKes: number;
  originalPriceKes?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  secondaryImages?: string[];
  description: string;
  keySpecs: Record<string, string>;
  compatibleVehicles: string[]; // Chassis codes or vehicle names
  inStockBranches: {
    kirinyagaRoad: boolean;
    industrialArea: boolean;
    westlands: boolean;
  };
  isFeatured?: boolean;
  isBestseller?: boolean;
  badge?: string;
  volumeOrQty?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSide?: string;
}

export interface Branch {
  id: string;
  name: string;
  area: string;
  address: string;
  phone: string;
  whatsapp: string;
  hours: string;
  highlight: string;
  isDepot?: boolean;
}
