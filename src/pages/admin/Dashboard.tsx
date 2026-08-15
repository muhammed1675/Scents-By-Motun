import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Mail,
  MessageSquareQuote,
  PackageSearch,
  ShoppingCart,
  TrendingUp } from
'lucide-react';
import { Order } from '../../types';
import { adminApi } from '../../services';
import { AdminStats } from '../../services/admin';
import { formatDate, formatNaira } from '../../utils/format';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminTable, Column } from '../../components/admin/AdminTable';
import { StatusBadge } from '../../components/StatusBadge';

export function Dashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.getAdminStats(), adminApi.getAdminOrders('all')]).
    then(([s, o]) => {
      setStats(s);
      setOrders(o.slice(0, 5));
    }).
    finally(() => setLoading(false));
  }, []);

  const cards = [
  {
    label: 'Revenue',
    value: stats ? formatNaira(stats.revenue) : '—',
    icon: TrendingUp,
    to: '/admin/orders'
  },
  {
    label: 'Orders',
    value: stats ? `${stats.orderCount}` : '—',
    hint: stats ? `${stats.pendingOrders} pending` : undefined,
    icon: ShoppingCart,
    to: '/admin/orders'
  },
  {
    label: 'Low stock',
    value: stats ? `${stats.lowStockCount}` : '—',
    hint: '8 units or fewer',
    icon: AlertTriangle,
    to: '/admin/products'
  },
  {
    label: 'Unread messages',
    value: stats ? `${stats.unreadMessages}` : '—',
    icon: Mail,
    to: '/admin/messages'
  },
  {
    label: 'New custom requests',
    value: stats ? `${stats.newCustomRequests}` : '—',
    icon: PackageSearch,
    to: '/admin/custom-requests'
  },
  {
    label: 'Testimonials to review',
    value: stats ? `${stats.pendingTestimonials}` : '—',
    icon: MessageSquareQuote,
    to: '/admin/testimonials'
  }];


  const columns: Column<Order>[] = [
  {
    key: 'ref',
    header: 'Order',
    render: (o) =>
    <Link
      to={`/admin/orders/${o.id}`}
      className="font-medium text-cocoa hover:text-gold">
      
          {o.reference}
        </Link>

  },
  {
    key: 'customer',
    header: 'Customer',
    render: (o) => o.customer.fullName
  },
  {
    key: 'date',
    header: 'Date',
    hideOnMobile: true,
    render: (o) =>
    <span className="text-cocoa/70">{formatDate(o.createdAt)}</span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (o) => <StatusBadge status={o.status} />
  },
  {
    key: 'total',
    header: 'Total',
    className: 'text-right',
    render: (o) =>
    <span className="font-medium">{formatNaira(o.total)}</span>

  }];


  return (
    <div>
      <AdminPageHeader
        title="Overview"
        description="Store performance at a glance." />
      

      <ul className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {cards.map(({ label, value, hint, icon: Icon, to }) =>
        <li key={label}>
            <Link
            to={to}
            className="block rounded-sm border border-cocoa/10 bg-white p-5 transition hover:border-gold/50">
            
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-widest text-chestnut">
                  {label}
                </p>
                <Icon size={16} className="text-gold" />
              </div>
              <p className="mt-3 font-heading text-2xl text-ink">{value}</p>
              {hint && <p className="mt-1 text-xs text-cocoa/60">{hint}</p>}
            </Link>
          </li>
        )}
      </ul>

      <h2 className="mb-4 font-heading text-xl text-ink">Recent orders</h2>
      <AdminTable
        columns={columns}
        rows={orders}
        rowKey={(o) => o.id}
        isLoading={isLoading}
        emptyMessage="No orders yet." />
      
    </div>);

}