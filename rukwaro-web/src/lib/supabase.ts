import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client — lazy, safe and optional.
 * The entire storefront runs on local data when env vars are absent;
 * once .env.local contains real credentials, data-backed features
 * (products, orders, admin sync) switch on automatically.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured: boolean = Boolean(
  url &&
  anonKey &&
  !url.includes('YOUR-PROJECT') &&
  !anonKey.includes('YOUR-ANON')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

/* Typed helpers used by the data layer */
export interface DbProductRow {
  id: string;
  sku: string;
  name: string;
  category: string;
  category_name: string;
  subcategory: string;
  brand: string;
  grade: string;
  oem_part_number: string;
  side: string | null;
  price_kes: number;
  original_price_kes: number | null;
  rating: number;
  reviews_count: number;
  image: string;
  description: string;
  key_specs: Record<string, string>;
  compatible_vehicles: string[];
  stock_kirinyaga: boolean;
  stock_industrial: boolean;
  stock_westlands: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  badge: string | null;
  volume_or_qty: string | null;
  active: boolean;
}

export async function fetchActiveProducts(): Promise<DbProductRow[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('[supabase] product fetch failed, using local catalog:', error.message);
    return null;
  }
  return data as DbProductRow[];
}

export async function insertLead(lead: {
  phone: string;
  name?: string;
  vehicle?: string;
  kind?: 'club' | 'restock' | 'quote' | 'fleet';
  note?: string;
}): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('leads').insert({
    phone: lead.phone,
    name: lead.name ?? null,
    vehicle: lead.vehicle ?? null,
    kind: lead.kind ?? 'club',
    note: lead.note ?? null,
  });
  if (error) {
    console.warn('[supabase] lead insert failed:', error.message);
    return false;
  }
  return true;
}

export async function signInAdmin(email: string, password: string) {
  if (!supabase) return { error: new Error('Supabase not configured') };
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOutAdmin() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
