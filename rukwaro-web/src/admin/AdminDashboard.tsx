import { useMemo } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Package,
  Receipt,
  ShoppingBag,
  Wallet,
} from 'lucide-react';
import type { AdminOrder, AdminProduct, OrderStatus } from './adminTypes';
import {
  ORDER_STATUS_DOTS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
} from './adminTypes';

interface AdminDashboardProps {
  products: AdminProduct[];
  orders: AdminOrder[];
}

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClassName: string;
  children: ReactNode;
}

interface RevenuePoint {
  key: string;
  weekday: string;
  dateLabel: string;
  value: number;
  isToday: boolean;
}

const formatKes = (value: number) => `KSh ${value.toLocaleString('en-KE')}`;

const isSameDay = (iso: string, reference: Date) => {
  const date = new Date(iso);
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
};

const orderItemCount = (order: AdminOrder) =>
  order.items.reduce((total, item) => total + item.qty, 0);

const StatusPill = ({ status }: { status: OrderStatus }) => (
  <span
    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-bold ${ORDER_STATUS_STYLES[status]}`}
  >
    <span className={`h-1.5 w-1.5 rounded-full ${ORDER_STATUS_DOTS[status]}`} />
    {ORDER_STATUS_LABELS[status]}
  </span>
);

const KpiCard = ({
  label,
  value,
  icon: Icon,
  iconClassName,
  children,
}: KpiCardProps) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-card sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
          {label}
        </p>
        <p className="mt-2 truncate text-2xl font-black tracking-tight text-brand-charcoal">
          {value}
        </p>
      </div>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
      >
        <Icon className="h-5 w-5" />
      </span>
    </div>
    <div className="mt-3 text-[11px] text-gray-500">{children}</div>
  </div>
);

export const AdminDashboard = ({ products, orders }: AdminDashboardProps) => {
  const now = new Date();
  const todayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const todaysOrders = orders.filter((order) => isSameDay(order.createdAt, now));
  const todaysValidOrders = todaysOrders.filter(
    (order) => order.status !== 'cancelled'
  );
  const yesterdaysValidOrders = orders.filter(
    (order) => isSameDay(order.createdAt, yesterday) && order.status !== 'cancelled'
  );

  const todayRevenue = todaysValidOrders.reduce(
    (total, order) => total + order.totalKes,
    0
  );
  const yesterdayRevenue = yesterdaysValidOrders.reduce(
    (total, order) => total + order.totalKes,
    0
  );
  const avgOrderValue =
    todaysValidOrders.length > 0
      ? Math.round(todayRevenue / todaysValidOrders.length)
      : 0;
  const revenueDelta =
    yesterdayRevenue > 0
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
      : null;

  const lowStock = useMemo(
    () =>
      products
        .map((product) => {
          const missingBranches = [
            !product.stockKirinyaga ? 'Kirinyaga Rd' : null,
            !product.stockIndustrial ? 'Industrial Area' : null,
            !product.stockWestlands ? 'Westlands' : null,
          ].filter((branch): branch is string => branch !== null);

          return { product, missingBranches };
        })
        .filter((entry) => entry.missingBranches.length > 0)
        .sort((a, b) => b.missingBranches.length - a.missingBranches.length),
    [products]
  );

  const latestOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        )
        .slice(0, 5),
    [orders]
  );

  const revenuePoints = useMemo<RevenuePoint[]>(() => {
    const points: RevenuePoint[] = [];
    const base = new Date();

    for (let offset = 13; offset >= 0; offset -= 1) {
      const date = new Date(base);
      date.setDate(base.getDate() - offset);

      const dateKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const seed = dateKey
        .split('')
        .reduce((total, char, index) => total + char.charCodeAt(0) * (index + 7), 0);

      const waveA = Math.abs(Math.sin(seed * 0.000173 + offset * 1.71));
      const waveB = Math.abs(Math.cos(seed * 0.000091 + offset * 0.87));
      const pseudoValue = 38_000 + waveA * 92_000 + waveB * 34_000;
      const isToday = offset === 0;
      const value = Math.round(pseudoValue / 500) * 500;

      points.push({
        key: dateKey,
        weekday: date.toLocaleDateString('en-KE', { weekday: 'short' }),
        dateLabel: date.toLocaleDateString('en-KE', {
          day: 'numeric',
          month: 'short',
        }),
        value: isToday && todayRevenue > 0 ? todayRevenue : value,
        isToday,
      });
    }

    return points;
  }, [todayKey, todayRevenue]);

  const maxRevenue = Math.max(...revenuePoints.map((point) => point.value), 1);
  const chartTotal = revenuePoints.reduce((total, point) => total + point.value, 0);
  const awaitingConfirmation = todaysOrders.filter(
    (order) => order.status === 'new'
  ).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-red">
            Branch overview
          </p>
          <p className="mt-1 text-xs font-medium text-gray-500">
            {now.toLocaleDateString('en-KE', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}{' '}
            · All three hubs
          </p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-bold text-gray-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Synced just now
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Today's Revenue"
          value={formatKes(todayRevenue)}
          icon={Wallet}
          iconClassName="bg-brand-red/10 text-brand-red"
        >
          {revenueDelta === null ? (
            <span className="font-semibold text-gray-400">No sales yesterday</span>
          ) : (
            <span
              className={`inline-flex items-center gap-1 font-bold ${
                revenueDelta >= 0 ? 'text-emerald-600' : 'text-brand-red'
              }`}
            >
              {revenueDelta >= 0 ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {Math.abs(revenueDelta).toFixed(1)}%
              <span className="font-medium text-gray-400">vs yesterday</span>
            </span>
          )}
        </KpiCard>

        <KpiCard
          label="Orders Today"
          value={todaysOrders.length.toLocaleString('en-KE')}
          icon={ShoppingBag}
          iconClassName="bg-blue-50 text-blue-600"
        >
          <span>
            <strong className="font-bold text-brand-charcoal">
              {awaitingConfirmation}
            </strong>{' '}
            awaiting confirmation
          </span>
        </KpiCard>

        <KpiCard
          label="Low Stock"
          value={lowStock.length.toLocaleString('en-KE')}
          icon={AlertTriangle}
          iconClassName="bg-amber-50 text-amber-600"
        >
          <span>
            Products missing stock in at least{' '}
            <strong className="font-bold text-brand-charcoal">1 branch</strong>
          </span>
        </KpiCard>

        <KpiCard
          label="Avg Order Value"
          value={formatKes(avgOrderValue)}
          icon={Receipt}
          iconClassName="bg-emerald-50 text-emerald-600"
        >
          <span>Across today&apos;s non-cancelled orders</span>
        </KpiCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <section className="flex min-w-0 flex-col rounded-xl border border-gray-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="text-sm font-black text-brand-charcoal">
                Revenue overview
              </h2>
              <p className="mt-0.5 text-[11px] text-gray-500">
                Last 14 days · {formatKes(chartTotal)} total
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-semibold text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-brand-red" />
                Daily revenue
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-brand-charcoal" />
                Today
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col px-4 pb-4 pt-5 sm:px-5">
            <div className="flex flex-1 flex-col overflow-x-auto pb-1">
              <div className="flex min-h-[250px] min-w-[580px] flex-1 flex-col">
                <div className="relative flex-1">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex flex-col justify-between"
                  >
                    {[0, 1, 2, 3, 4].map((line) => (
                      <div key={line} className="border-t border-dashed border-gray-100" />
                    ))}
                  </div>

                  <div className="relative z-10 flex h-full items-end gap-1.5 sm:gap-2.5">
                    {revenuePoints.map((point) => {
                      const height = Math.max(
                        8,
                        Math.round((point.value / maxRevenue) * 100)
                      );

                      return (
                        <div
                          key={point.key}
                          className="group relative flex h-full flex-1 items-end"
                          title={`${point.dateLabel} · ${formatKes(point.value)}`}
                        >
                          <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-brand-charcoal px-2.5 py-1.5 text-[10px] font-bold text-white shadow-lg group-hover:block">
                            <span className="text-gray-400">{point.dateLabel}</span>
                            <span className="ml-1.5">{formatKes(point.value)}</span>
                          </div>
                          <div
                            className={`w-full rounded-t-md transition-colors ${
                              point.isToday
                                ? 'bg-brand-charcoal group-hover:bg-brand-charcoalLight'
                                : 'bg-brand-red/80 group-hover:bg-brand-red'
                            }`}
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-2 flex shrink-0 gap-1.5 sm:gap-2.5">
                  {revenuePoints.map((point) => (
                    <div
                      key={point.key}
                      className="flex-1 text-center text-[9px] font-semibold text-gray-400"
                    >
                      {point.weekday}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-sm font-black text-brand-charcoal">
                Low stock alerts
              </h2>
              <p className="mt-0.5 text-[11px] text-gray-500">
                Branch-level availability
              </p>
            </div>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700">
              {lowStock.length}
            </span>
          </div>

          {lowStock.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
              <Package className="h-8 w-8 text-gray-300" />
              <p className="mt-2 text-xs font-bold text-gray-500">
                All products are stocked in every branch.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {lowStock.slice(0, 5).map(({ product, missingBranches }) => (
                <div key={product.id} className="flex gap-3 px-4 py-3 sm:px-5">
                  <img
                    src={product.image}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-lg border border-gray-100 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[11px] font-bold text-brand-charcoal">
                      {product.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[9px] font-semibold text-gray-400">
                      {product.sku}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {missingBranches.map((branch) => (
                        <span
                          key={branch}
                          className="rounded border border-red-100 bg-red-50 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-brand-red"
                        >
                          {branch} out
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {lowStock.length > 5 && (
            <div className="border-t border-gray-100 px-4 py-2.5 text-center text-[10px] font-semibold text-gray-400 sm:px-5">
              +{lowStock.length - 5} more products need attention
            </div>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-sm font-black text-brand-charcoal">
              Latest orders
            </h2>
            <p className="mt-0.5 text-[11px] text-gray-500">
              The five most recent orders across all branches
            </p>
          </div>
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-bold text-gray-500">
            {orders.length} total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-[9px] font-bold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-2.5 sm:px-5">Order</th>
                <th className="px-4 py-2.5">Customer</th>
                <th className="px-4 py-2.5">Items</th>
                <th className="px-4 py-2.5">Total</th>
                <th className="px-4 py-2.5 sm:px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {latestOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <ShoppingBag className="mx-auto h-7 w-7 text-gray-300" />
                    <p className="mt-2 text-xs font-semibold text-gray-500">
                      No orders yet
                    </p>
                  </td>
                </tr>
              ) : (
                latestOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-gray-50/80"
                  >
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <span className="font-mono text-[11px] font-bold text-brand-charcoal">
                        {order.id}
                      </span>
                      <p className="mt-0.5 text-[9px] text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString('en-KE', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="whitespace-nowrap text-[11px] font-bold text-brand-charcoal">
                        {order.customerName}
                      </p>
                      <p className="mt-0.5 text-[9px] text-gray-400">
                        {order.branch}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold text-gray-600">
                      {orderItemCount(order)}{' '}
                      {orderItemCount(order) === 1 ? 'item' : 'items'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[11px] font-black text-brand-charcoal">
                      {formatKes(order.totalKes)}
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <StatusPill status={order.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
