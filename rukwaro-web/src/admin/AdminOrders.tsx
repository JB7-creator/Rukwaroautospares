import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Car,
  Check,
  ChevronDown,
  Copy,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  ShoppingBag,
  Truck,
  X,
} from 'lucide-react';
import type { AdminOrder, OrderStatus } from './adminTypes';
import {
  DELIVERY_METHOD_LABELS,
  ORDER_STATUS_DOTS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
  ORDER_STATUSES,
} from './adminTypes';
import { loadJSON, saveJSON } from '../utils/storage';

interface AdminOrdersProps {
  initialOrders: AdminOrder[];
}

type StatusFilter = 'all' | OrderStatus;

const STORAGE_KEY = 'rukwaro.admin.orders.v1';

const formatKes = (value: number) => `KSh ${value.toLocaleString('en-KE')}`;

const orderItemCount = (order: AdminOrder) =>
  order.items.reduce((total, item) => total + item.qty, 0);

const readStoredOrders = (fallback: AdminOrder[]): AdminOrder[] => {
  const stored = loadJSON<AdminOrder[] | null>(STORAGE_KEY, null);
  return Array.isArray(stored) ? stored : fallback;
};

const formatOrderDate = (iso: string) => {
  const date = new Date(iso);
  return {
    date: date.toLocaleDateString('en-KE', {
      day: '2-digit',
      month: 'short',
    }),
    time: date.toLocaleTimeString('en-KE', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};

const copyToClipboard = async (text: string): Promise<void> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    // Fall through to the legacy copy path below.
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!copied) throw new Error('Clipboard copy failed');
};

const StatusSelect = ({
  order,
  onChange,
}: {
  order: AdminOrder;
  onChange: (status: OrderStatus) => void;
}) => (
  <div
    className={`relative inline-flex items-center rounded-full border ${ORDER_STATUS_STYLES[order.status]}`}
    onClick={(event) => event.stopPropagation()}
  >
    <span
      className={`ml-2 h-1.5 w-1.5 shrink-0 rounded-full ${ORDER_STATUS_DOTS[order.status]}`}
    />
    <select
      value={order.status}
      onChange={(event) => onChange(event.target.value as OrderStatus)}
      aria-label={`Update status for order ${order.id}`}
      className="cursor-pointer appearance-none bg-transparent py-1 pl-1.5 pr-5 text-[10px] font-bold outline-none"
    >
      {ORDER_STATUSES.map((status) => (
        <option key={status} value={status}>
          {ORDER_STATUS_LABELS[status]}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-1.5 h-3 w-3" />
  </div>
);

const StatusPill = ({ status }: { status: OrderStatus }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold ${ORDER_STATUS_STYLES[status]}`}
  >
    <span className={`h-1.5 w-1.5 rounded-full ${ORDER_STATUS_DOTS[status]}`} />
    {ORDER_STATUS_LABELS[status]}
  </span>
);

export const AdminOrders = ({ initialOrders }: AdminOrdersProps) => {
  const [orders, setOrders] = useState<AdminOrder[]>(() =>
    readStoredOrders(initialOrders)
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number | null>(null);

  useEffect(() => {
    saveJSON(STORAGE_KEY, orders);
  }, [orders]);

  useEffect(() => {
    if (selectedId === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedId(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedId]);

  useEffect(() => {
    setCopied(false);
  }, [selectedId]);

  useEffect(
    () => () => {
      if (copiedTimer.current !== null) {
        window.clearTimeout(copiedTimer.current);
      }
    },
    []
  );

  const counts = useMemo(() => {
    const next: Record<OrderStatus, number> = {
      new: 0,
      confirmed: 0,
      packing: 0,
      dispatched: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      next[order.status] += 1;
    });

    return next;
  }, [orders]);

  const visibleOrders = useMemo(() => {
    const filtered =
      statusFilter === 'all'
        ? orders
        : orders.filter((order) => order.status === statusFilter);

    return [...filtered].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
  }, [orders, statusFilter]);

  const selectedOrder = selectedId
    ? orders.find((order) => order.id === selectedId) ?? null
    : null;

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  const handleCopyFollowUp = async (order: AdminOrder) => {
    const message = `Habari ${order.customerName} 👋 Your Rukwaro order ${
      order.id
    } (${ORDER_STATUS_LABELS[order.status]}) — ${orderItemCount(
      order
    )} item(s), KSh ${order.totalKes.toLocaleString(
      'en-KE'
    )}. Reply here for updates.`;

    try {
      await copyToClipboard(message);
      setCopied(true);

      if (copiedTimer.current !== null) {
        window.clearTimeout(copiedTimer.current);
      }
      copiedTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const tabs: Array<{ value: StatusFilter; label: string; count: number }> = [
    { value: 'all', label: 'All', count: orders.length },
    ...ORDER_STATUSES.map((status) => ({
      value: status,
      label: ORDER_STATUS_LABELS[status],
      count: counts[status],
    })),
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-red">
            Fulfilment queue
          </p>
          <p className="mt-1 text-xs font-medium text-gray-500">
            {orders.length} orders across Kirinyaga Rd, Industrial Area and Westlands.
          </p>
        </div>
        <div className="inline-flex self-start items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-bold text-gray-500">
          <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
          WhatsApp follow-ups enabled
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
        <div className="flex min-w-max items-center gap-1.5">
          {tabs.map((tab) => {
            const isActive = statusFilter === tab.value;
            const dot =
              tab.value === 'all' ? 'bg-brand-red' : ORDER_STATUS_DOTS[tab.value];

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-[11px] font-bold transition-colors ${
                  isActive
                    ? 'border-brand-charcoal bg-brand-charcoal text-white'
                    : 'border-transparent bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isActive && tab.value !== 'all' ? 'bg-white' : dot
                  }`}
                />
                {tab.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-sm font-black text-brand-charcoal">
              {statusFilter === 'all'
                ? 'All orders'
                : `${ORDER_STATUS_LABELS[statusFilter]} orders`}
            </h2>
            <p className="mt-0.5 text-[11px] text-gray-500">
              Click a row to open customer and delivery details.
            </p>
          </div>
          <span className="whitespace-nowrap rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-bold text-gray-500">
            {visibleOrders.length} shown
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-[9px] font-bold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-2.5 sm:px-5">Order</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Customer</th>
                <th className="px-4 py-2.5">Items</th>
                <th className="px-4 py-2.5">Total</th>
                <th className="px-4 py-2.5">Branch</th>
                <th className="px-4 py-2.5 sm:px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <ShoppingBag className="mx-auto h-9 w-9 text-gray-300" />
                    <p className="mt-3 text-sm font-bold text-brand-charcoal">
                      {statusFilter === 'all'
                        ? 'No orders yet'
                        : 'No orders in this status'}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500">
                      New orders will appear here as customers check out.
                    </p>
                  </td>
                </tr>
              ) : (
                visibleOrders.map((order) => {
                  const formatted = formatOrderDate(order.createdAt);

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedId(order.id)}
                      className="cursor-pointer transition-colors hover:bg-gray-50/80"
                    >
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedId(order.id);
                          }}
                          className="font-mono text-[11px] font-bold text-brand-charcoal hover:text-brand-red"
                        >
                          {order.id}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <p className="text-[11px] font-bold text-brand-charcoal">
                          {formatted.date}
                        </p>
                        <p className="mt-0.5 text-[9px] text-gray-400">
                          {formatted.time}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="whitespace-nowrap text-[11px] font-bold text-brand-charcoal">
                          {order.customerName}
                        </p>
                        <p className="mt-0.5 whitespace-nowrap text-[9px] text-gray-400">
                          {order.phone}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-600">
                          <Package className="h-3.5 w-3.5 text-gray-400" />
                          {orderItemCount(order)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[11px] font-black text-brand-charcoal">
                        {formatKes(order.totalKes)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          {order.branch}
                        </span>
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <StatusSelect
                          order={order}
                          onChange={(status) => updateStatus(order.id, status)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-1 border-t border-gray-100 px-4 py-3 text-[10px] text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span>
            Showing{' '}
            <strong className="font-bold text-brand-charcoal">
              {visibleOrders.length}
            </strong>{' '}
            of {orders.length} orders
          </span>
          <span>Status changes save to this device automatically</span>
        </div>
      </section>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-detail-title"
        >
          <div
            className="absolute inset-0 bg-brand-charcoal/50 backdrop-blur-[1px]"
            onClick={() => setSelectedId(null)}
            aria-hidden="true"
          />

          <aside className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-white shadow-2xl">
            <div className="flex shrink-0 items-start justify-between gap-3 bg-brand-charcoal px-5 py-4 text-white">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
                    Order details
                  </p>
                  <StatusPill status={selectedOrder.status} />
                </div>
                <h2
                  id="order-detail-title"
                  className="mt-1 font-mono text-base font-black tracking-tight text-white"
                >
                  {selectedOrder.id}
                </h2>
                <p className="mt-0.5 text-[10px] text-gray-400">
                  {new Date(selectedOrder.createdAt).toLocaleString('en-KE', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close order details"
                className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              <section className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      Customer
                    </p>
                    <p className="mt-1 text-base font-black text-brand-charcoal">
                      {selectedOrder.customerName}
                    </p>
                  </div>
                  <StatusSelect
                    order={selectedOrder}
                    onChange={(status) =>
                      updateStatus(selectedOrder.id, status)
                    }
                  />
                </div>

                <div className="mt-3 grid gap-2 text-[11px] text-gray-600 sm:grid-cols-2">
                  <a
                    href={`tel:${selectedOrder.phone}`}
                    className="inline-flex items-center gap-2 font-semibold text-brand-charcoal hover:text-brand-red"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    {selectedOrder.phone}
                  </a>
                  <p className="inline-flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    {DELIVERY_METHOD_LABELS[selectedOrder.deliveryMethod]}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    {selectedOrder.branch}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Car className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    {selectedOrder.vehicle ?? 'Vehicle not provided'}
                  </p>
                </div>
              </section>

              <section className="rounded-xl border border-gray-200 bg-brand-offwhite p-4">
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Notes
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-gray-600">
                  {selectedOrder.notes || 'No notes from the customer.'}
                </p>
              </section>

              <section className="overflow-hidden rounded-xl border border-gray-200">
                <div className="flex items-center justify-between gap-2 border-b border-gray-100 bg-gray-50/70 px-4 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Items
                  </p>
                  <span className="text-[9px] font-semibold text-gray-400">
                    {orderItemCount(selectedOrder)}{' '}
                    {orderItemCount(selectedOrder) === 1 ? 'unit' : 'units'}
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={`${item.sku}-${index}`}
                      className="flex items-start justify-between gap-3 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-brand-charcoal">
                          {item.name}
                        </p>
                        <p className="mt-0.5 font-mono text-[9px] text-gray-400">
                          {item.sku}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-500">
                          {item.qty} × {formatKes(item.priceKes)}
                        </p>
                      </div>
                      <p className="whitespace-nowrap text-[11px] font-black text-brand-charcoal">
                        {formatKes(item.qty * item.priceKes)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3">
                  <span className="text-[11px] font-bold text-gray-600">
                    Order total
                  </span>
                  <span className="text-sm font-black text-brand-charcoal">
                    {formatKes(selectedOrder.totalKes)}
                  </span>
                </div>
              </section>
            </div>

            <div className="shrink-0 border-t border-gray-200 bg-white p-4">
              <button
                type="button"
                onClick={() => handleCopyFollowUp(selectedOrder)}
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  copied
                    ? 'bg-emerald-600 focus:ring-emerald-400'
                    : 'bg-[#25D366] hover:bg-[#1EBE57] focus:ring-[#25D366]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy WhatsApp Follow-up
                  </>
                )}
              </button>
              <p className="mt-2 text-center text-[9px] text-gray-400">
                Copies a ready-to-send message with the order status and total.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
