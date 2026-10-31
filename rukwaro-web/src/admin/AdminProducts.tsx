import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  Check,
  ChevronDown,
  Package,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import type {
  AdminCategory,
  AdminGrade,
  AdminProduct,
} from './adminTypes';
import {
  ADMIN_CATEGORIES,
  ADMIN_CATEGORY_LABELS,
  ADMIN_GRADES,
} from './adminTypes';
import { loadJSON, saveJSON } from '../utils/storage';

interface AdminProductsProps {
  initialProducts: AdminProduct[];
  onChange?: (products: AdminProduct[]) => void;
}

type StockFilter = 'all' | 'in' | 'low';
type StockKey = 'stockKirinyaga' | 'stockIndustrial' | 'stockWestlands';

interface ProductFormState {
  name: string;
  sku: string;
  category: AdminCategory;
  subcategory: string;
  price: string;
  brand: string;
  grade: AdminGrade;
  image: string;
  description: string;
}

const STORAGE_KEY = 'rukwaro.admin.products.v2';
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=200&q=60';

const EMPTY_FORM: ProductFormState = {
  name: '',
  sku: '',
  category: 'lighting',
  subcategory: '',
  price: '',
  brand: '',
  grade: 'OEM Genuine',
  image: '',
  description: '',
};

const inputClassName =
  'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-brand-charcoal placeholder:font-medium placeholder:text-gray-400 focus:border-brand-red focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/15';
const labelClassName =
  'mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500';

const readStoredProducts = (fallback: AdminProduct[]): AdminProduct[] => {
  const stored = loadJSON<AdminProduct[] | null>(STORAGE_KEY, null);
  return Array.isArray(stored) ? stored : fallback;
};

const isFullyStocked = (product: AdminProduct) =>
  product.stockKirinyaga && product.stockIndustrial && product.stockWestlands;

const PriceInput = ({
  value,
  onSave,
}: {
  value: number;
  onSave: (nextValue: number) => void;
}) => {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setDraft(next);

    if (next.trim() === '') return;
    const parsed = Number(next);
    if (Number.isFinite(parsed) && parsed >= 0) {
      onSave(Math.round(parsed));
    }
  };

  return (
    <div className="relative w-28">
      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400">
        KSh
      </span>
      <input
        type="number"
        min={0}
        step={1}
        value={draft}
        onChange={handleChange}
        onBlur={() => {
          if (draft.trim() === '') setDraft(String(value));
        }}
        aria-label="Price in Kenyan shillings"
        className="w-full rounded-md border border-gray-200 bg-white py-1.5 pl-8 pr-2 text-[11px] font-black text-brand-charcoal focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/15"
      />
    </div>
  );
};

const StockCheckbox = ({
  label,
  title,
  checked,
  onToggle,
}: {
  label: string;
  title: string;
  checked: boolean;
  onToggle: () => void;
}) => (
  <label title={`${title} — ${checked ? 'in stock' : 'out of stock'}`} className="cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onToggle}
      aria-label={`${title} stock`}
      className="peer sr-only"
    />
    <span
      aria-hidden="true"
      className={`inline-flex h-7 w-10 items-center justify-center gap-0.5 rounded-md border text-[9px] font-black transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-red/30 ${
        checked
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-gray-200 bg-gray-50 text-gray-300'
      }`}
    >
      {checked && <Check className="h-2.5 w-2.5" />}
      {label}
    </span>
  </label>
);

export const AdminProducts = ({
  initialProducts,
  onChange,
}: AdminProductsProps) => {
  const [products, setProducts] = useState<AdminProduct[]>(() =>
    readStoredProducts(initialProducts)
  );
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    saveJSON(STORAGE_KEY, products);
    onChange?.(products);
  }, [products, onChange]);

  useEffect(() => {
    if (!drawerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawerOpen]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        [product.name, product.sku, product.brand, product.categoryName, product.subcategory]
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        categoryFilter === 'all' || product.category === categoryFilter;

      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'in' ? isFullyStocked(product) : !isFullyStocked(product));

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, categoryFilter, stockFilter]);

  const lowStockCount = products.filter(
    (product) => !isFullyStocked(product)
  ).length;

  const updateProduct = (id: string, updates: Partial<AdminProduct>) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const toggleStock = (id: string, key: StockKey) => {
    setProducts((current) =>
      current.map((product) => {
        if (product.id !== id) return product;

        if (key === 'stockKirinyaga') {
          return { ...product, stockKirinyaga: !product.stockKirinyaga };
        }
        if (key === 'stockIndustrial') {
          return { ...product, stockIndustrial: !product.stockIndustrial };
        }
        return { ...product, stockWestlands: !product.stockWestlands };
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id));
    setDeletingId(null);
  };

  const openDrawer = () => {
    setForm({ ...EMPTY_FORM });
    setFormError('');
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setFormError('');
  };

  const updateForm = (patch: Partial<ProductFormState>) => {
    setForm((current) => ({ ...current, ...patch }));
    if (formError) setFormError('');
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('all');
    setStockFilter('all');
  };

  const handleAddProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();
    const sku = form.sku.trim().toUpperCase();
    const price = Number(form.price);

    if (!name) {
      setFormError('Product name is required.');
      return;
    }
    if (!sku) {
      setFormError('SKU is required.');
      return;
    }
    if (products.some((product) => product.sku.toUpperCase() === sku)) {
      setFormError('That SKU already exists in the catalogue.');
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setFormError('Enter a valid price greater than zero.');
      return;
    }

    const newProduct: AdminProduct = {
      id: `p-${Date.now()}`,
      sku,
      name,
      category: form.category,
      categoryName: ADMIN_CATEGORY_LABELS[form.category],
      subcategory: form.subcategory.trim() || 'General',
      brand: form.brand.trim() || 'Rukwaro',
      grade: form.grade,
      priceKes: Math.round(price),
      stockKirinyaga: true,
      stockIndustrial: true,
      stockWestlands: true,
      isFeatured: false,
      isBestseller: false,
      image: form.image.trim() || FALLBACK_IMAGE,
      active: true,
    };

    setProducts((current) => [...current, newProduct]);
    closeDrawer();
  };

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
          <div>
            <h2 className="text-sm font-black text-brand-charcoal">
              Product catalogue
            </h2>
            <p className="mt-0.5 text-[11px] text-gray-500">
              {products.length} products · {lowStockCount} low stock across branches
            </p>
          </div>
          <button
            type="button"
            onClick={openDrawer}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-brand-red px-3.5 py-2 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-brand-redHover focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        <div className="flex flex-col gap-2 border-b border-gray-100 bg-gray-50/40 p-3 sm:p-4 lg:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, SKU or brand…"
              aria-label="Search products"
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-xs font-semibold text-brand-charcoal placeholder:font-medium placeholder:text-gray-400 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/15"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear product search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:text-brand-charcoal"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                aria-label="Filter by category"
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-8 text-xs font-semibold text-brand-charcoal focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/15 sm:w-48"
              >
                <option value="all">All categories</option>
                {ADMIN_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative">
              <select
                value={stockFilter}
                onChange={(event) =>
                  setStockFilter(event.target.value as StockFilter)
                }
                aria-label="Filter by stock status"
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-8 text-xs font-semibold text-brand-charcoal focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/15 sm:w-36"
              >
                <option value="all">All stock</option>
                <option value="in">In stock</option>
                <option value="low">Low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-[9px] font-bold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-2.5 sm:px-5">Product</th>
                <th className="px-4 py-2.5">Price</th>
                <th className="px-4 py-2.5">
                  <span className="block">Branch stock</span>
                  <span className="mt-0.5 block text-[8px] font-semibold normal-case tracking-normal text-gray-400">
                    KIR · IND · WST
                  </span>
                </th>
                <th className="px-4 py-2.5 text-center">Featured</th>
                <th className="px-4 py-2.5">Active</th>
                <th className="px-4 py-2.5 text-right sm:px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Package className="mx-auto h-9 w-9 text-gray-300" />
                    <p className="mt-3 text-sm font-bold text-brand-charcoal">
                      No products match your filters
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500">
                      Try a different search term or reset the category and stock filters.
                    </p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-4 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-brand-charcoal transition-colors hover:border-brand-red/40 hover:text-brand-red"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`transition-colors hover:bg-gray-50/80 ${
                      product.active ? 'bg-white' : 'bg-gray-50/70'
                    }`}
                  >
                    <td className="px-4 py-3 sm:px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt=""
                          className="h-11 w-11 shrink-0 rounded-lg border border-gray-100 object-cover"
                        />
                        <div className="min-w-0">
                          <p className="line-clamp-1 text-[11px] font-bold text-brand-charcoal">
                            {product.name}
                          </p>
                          <p className="mt-0.5 font-mono text-[9px] font-semibold text-gray-400">
                            {product.sku}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5 text-[9px] text-gray-500">
                            <span>{product.categoryName}</span>
                            <span className="text-gray-300">·</span>
                            <span>{product.brand}</span>
                            <span className="text-gray-300">·</span>
                            <span className="truncate">{product.grade}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      <PriceInput
                        value={product.priceKes}
                        onSave={(price) =>
                          updateProduct(product.id, { priceKes: price })
                        }
                      />
                      {product.originalPriceKes ? (
                        <p className="mt-1 text-[9px] text-gray-400 line-through">
                          KSh {product.originalPriceKes.toLocaleString('en-KE')}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <StockCheckbox
                          label="KIR"
                          title="Kirinyaga Rd"
                          checked={product.stockKirinyaga}
                          onToggle={() => toggleStock(product.id, 'stockKirinyaga')}
                        />
                        <StockCheckbox
                          label="IND"
                          title="Industrial Area"
                          checked={product.stockIndustrial}
                          onToggle={() => toggleStock(product.id, 'stockIndustrial')}
                        />
                        <StockCheckbox
                          label="WST"
                          title="Westlands"
                          checked={product.stockWestlands}
                          onToggle={() => toggleStock(product.id, 'stockWestlands')}
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          updateProduct(product.id, {
                            isFeatured: !product.isFeatured,
                          })
                        }
                        aria-pressed={product.isFeatured}
                        aria-label={
                          product.isFeatured
                            ? `Remove ${product.name} from featured`
                            : `Feature ${product.name}`
                        }
                        title={
                          product.isFeatured
                            ? 'Featured on storefront'
                            : 'Not featured'
                        }
                        className={`rounded-md p-1.5 transition-colors ${
                          product.isFeatured
                            ? 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                            : 'text-gray-300 hover:bg-gray-100 hover:text-gray-500'
                        }`}
                      >
                        <Star
                          className="h-4 w-4"
                          fill={product.isFeatured ? 'currentColor' : 'none'}
                        />
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={product.active}
                          aria-label={`${product.name} active status`}
                          onClick={() =>
                            updateProduct(product.id, {
                              active: !product.active,
                            })
                          }
                          className={`relative h-5 w-9 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:ring-offset-1 ${
                            product.active ? 'bg-emerald-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                              product.active ? 'translate-x-4' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                        <span
                          className={`text-[10px] font-bold ${
                            product.active ? 'text-emerald-700' : 'text-gray-400'
                          }`}
                        >
                          {product.active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right sm:px-5">
                      {deletingId === product.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-[9px] font-bold text-brand-red">
                            Confirm?
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteProduct(product.id)}
                            className="rounded bg-brand-red px-1.5 py-1 text-[9px] font-bold text-white hover:bg-brand-redHover"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingId(null)}
                            className="rounded border border-gray-200 bg-white px-1.5 py-1 text-[9px] font-bold text-gray-600 hover:bg-gray-50"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeletingId(product.id)}
                          aria-label={`Delete ${product.name}`}
                          title="Delete product"
                          className="rounded-md p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-brand-red"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-1 border-t border-gray-100 px-4 py-3 text-[10px] text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span>
            Showing{' '}
            <strong className="font-bold text-brand-charcoal">
              {filteredProducts.length}
            </strong>{' '}
            of {products.length} products
          </span>
          <span>Changes save to this device automatically</span>
        </div>
      </section>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-product-title"
        >
          <div
            className="absolute inset-0 bg-brand-charcoal/50 backdrop-blur-[1px]"
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-200 px-5 py-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-red">
                  Inventory
                </p>
                <h2
                  id="add-product-title"
                  className="mt-0.5 text-base font-black text-brand-charcoal"
                >
                  Add Product
                </h2>
                <p className="mt-0.5 text-[11px] text-gray-500">
                  Create a new catalogue item with branch stock.
                </p>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close add product drawer"
                className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand-charcoal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleAddProduct}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                {formError && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-semibold text-brand-redDark"
                  >
                    {formError}
                  </div>
                )}

                <div>
                  <label htmlFor="product-name" className={labelClassName}>
                    Product name <span className="text-brand-red">*</span>
                  </label>
                  <input
                    id="product-name"
                    value={form.name}
                    onChange={(event) => updateForm({ name: event.target.value })}
                    placeholder="e.g. Toyota Fielder LED Headlamp"
                    className={inputClassName}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="product-sku" className={labelClassName}>
                      SKU <span className="text-brand-red">*</span>
                    </label>
                    <input
                      id="product-sku"
                      value={form.sku}
                      onChange={(event) => updateForm({ sku: event.target.value })}
                      placeholder="RUK-LGT-009"
                      className={`${inputClassName} font-mono uppercase`}
                    />
                  </div>
                  <div>
                    <label htmlFor="product-price" className={labelClassName}>
                      Price (KSh) <span className="text-brand-red">*</span>
                    </label>
                    <input
                      id="product-price"
                      type="number"
                      min={0}
                      step={1}
                      value={form.price}
                      onChange={(event) =>
                        updateForm({ price: event.target.value })
                      }
                      placeholder="16500"
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="product-category" className={labelClassName}>
                      Category
                    </label>
                    <div className="relative">
                      <select
                        id="product-category"
                        value={form.category}
                        onChange={(event) =>
                          updateForm({
                            category: event.target.value as AdminCategory,
                          })
                        }
                        className={`${inputClassName} appearance-none pr-8`}
                      >
                        {ADMIN_CATEGORIES.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="product-subcategory" className={labelClassName}>
                      Subcategory
                    </label>
                    <input
                      id="product-subcategory"
                      value={form.subcategory}
                      onChange={(event) =>
                        updateForm({ subcategory: event.target.value })
                      }
                      placeholder="Headlamps"
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="product-brand" className={labelClassName}>
                      Brand
                    </label>
                    <input
                      id="product-brand"
                      value={form.brand}
                      onChange={(event) => updateForm({ brand: event.target.value })}
                      placeholder="Toyota"
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label htmlFor="product-grade" className={labelClassName}>
                      Grade
                    </label>
                    <div className="relative">
                      <select
                        id="product-grade"
                        value={form.grade}
                        onChange={(event) =>
                          updateForm({ grade: event.target.value as AdminGrade })
                        }
                        className={`${inputClassName} appearance-none pr-8`}
                      >
                        {ADMIN_GRADES.map((grade) => (
                          <option key={grade} value={grade}>
                            {grade}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="product-image" className={labelClassName}>
                    Image URL
                  </label>
                  <input
                    id="product-image"
                    type="url"
                    value={form.image}
                    onChange={(event) => updateForm({ image: event.target.value })}
                    placeholder="https://images.unsplash.com/…"
                    className={inputClassName}
                  />
                  {form.image.trim() && (
                    <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
                      <img
                        src={form.image}
                        alt=""
                        className="h-9 w-9 rounded-md border border-gray-100 object-cover"
                      />
                      <span className="text-[10px] font-medium text-gray-500">
                        Image preview
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="product-description" className={labelClassName}>
                    Description{' '}
                    <span className="font-medium normal-case text-gray-400">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="product-description"
                    rows={3}
                    value={form.description}
                    onChange={(event) =>
                      updateForm({ description: event.target.value })
                    }
                    placeholder="Internal notes about fitment, warranty or packaging…"
                    className={`${inputClassName} resize-none`}
                  />
                </div>

                <div className="rounded-lg border border-dashed border-gray-300 bg-brand-offwhite px-3 py-2.5 text-[10px] leading-relaxed text-gray-500">
                  New products start as active and in stock at all three branches.
                  Adjust pricing, branch stock and visibility directly in the table.
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-end gap-2 border-t border-gray-200 bg-white px-5 py-3.5">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-red px-3.5 py-2 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-brand-redHover focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:ring-offset-2"
                >
                  <Plus className="h-4 w-4" />
                  Save product
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
};
