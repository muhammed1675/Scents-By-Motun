import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Order, OrderStatus } from '../../types';
import { adminApi } from '../../services';
import { formatDate, formatNaira, cn } from '../../utils/format';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminTable, Column } from '../../components/admin/AdminTable';
import { StatusBadge } from '../../components/StatusBadge';
import { SelectInput } from '../../components/ui/Field';

const statusFilters: Array<OrderStatus | 'all'> = [
'all',
'pending',
'processing',
'shipped',
'delivered',
'cancelled'];


const statuses: OrderStatus[] = [
'pending',
'processing',
'shipped',
'delivered',
'cancelled'];


export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminApi.
    getAdminOrders(filter).
    then(setOrders).
    finally(() => setLoading(false));
  }, [filter]);

  async function changeStatus(id: string, status: OrderStatus) {
    await adminApi.updateOrderStatus(id, status);
    setOrders(await adminApi.getAdminOrders(filter));
  }

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
    render: (o) =>
    <div>
          <p>{o.customer.fullName}</p>
          <p className="text-xs text-cocoa/60">{o.shipping.state}</p>
        </div>

  },
  {
    key: 'date',
    header: 'Placed',
    hideOnMobile: true,
    render: (o) =>
    <span className="text-cocoa/70">{formatDate(o.createdAt)}</span>

  },
  {
    key: 'payment',
    header: 'Payment',
    hideOnMobile: true,
    render: (o) =>
    <span className="text-xs capitalize text-cocoa/70">
          {o.paymentMethod === 'whatsapp' ? 'WhatsApp' : 'Online'}
        </span>

  },
  {
    key: 'total',
    header: 'Total',
    render: (o) => <span className="font-medium">{formatNaira(o.total)}</span>
  },
  {
    key: 'status',
    header: 'Status',
    render: (o) =>
    <div className="flex items-center gap-2">
          <StatusBadge status={o.status} />
          <label className="sr-only" htmlFor={`status-${o.id}`}>
            Update status for {o.reference}
          </label>
          <SelectInput
        id={`status-${o.id}`}
        value={o.status}
        onChange={(e) => changeStatus(o.id, e.target.value as OrderStatus)}
        className="w-auto py-1.5 text-xs">
        
            {statuses.map((s) =>
        <option key={s} value={s}>
                {s}
              </option>
        )}
          </SelectInput>
        </div>

  }];


  return (
    <div>
      <AdminPageHeader
        title="Orders"
        description="Track and fulfil every order placed online or on WhatsApp." />
      

      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto">
        {statusFilters.map((s) =>
        <button
          key={s}
          type="button"
          onClick={() => setFilter(s)}
          aria-pressed={filter === s}
          className={cn(
            'whitespace-nowrap rounded-full border px-4 py-1.5 text-xs capitalize transition',
            filter === s ?
            'border-cocoa bg-cocoa text-ivory' :
            'border-cocoa/20 text-cocoa hover:bg-cream'
          )}>
          
            {s === 'all' ? 'All orders' : s}
          </button>
        )}
      </div>

      <AdminTable
        columns={columns}
        rows={orders}
        rowKey={(o) => o.id}
        isLoading={isLoading}
        emptyMessage="No orders with this status." />
      
    </div>);

}