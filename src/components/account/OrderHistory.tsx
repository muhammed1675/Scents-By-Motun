import React, { useEffect, useState } from 'react';
import { Order } from '../../types';
import { getMyOrders } from '../../services';
import { formatDate, formatNaira } from '../../utils/format';
import { StatusBadge } from '../StatusBadge';
import { Button } from '../ui/Button';
import { EmptyState, Spinner } from '../ui/Loading';

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders().
    then(setOrders).
    finally(() => setLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="grid place-items-center py-16">
        <Spinner />
      </div>);

  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="Your past orders and their delivery status will live here."
        action={<Button to="/shop">Start shopping</Button>} />);


  }

  return (
    <ul className="space-y-4">
      {orders.map((order) =>
      <li
        key={order.id}
        className="rounded-sm border border-cocoa/10 bg-white p-5">
        
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cocoa/10 pb-4">
            <div>
              <p className="font-medium text-ink">{order.reference}</p>
              <p className="text-xs text-cocoa/60">
                Placed {formatDate(order.createdAt)} ·{' '}
                {order.paymentMethod === 'whatsapp' ? 'WhatsApp' : 'Paid online'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={order.status} />
              <span className="font-semibold text-cocoa">
                {formatNaira(order.total)}
              </span>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {order.items.map((item) =>
          <li key={item.productId} className="flex items-center gap-3">
                <img
              src={item.image}
              alt=""
              className="h-14 w-12 rounded-sm object-cover" />
            
                <div className="flex-1">
                  <p className="text-sm text-ink">{item.name}</p>
                  <p className="text-xs text-cocoa/60">
                    ×{item.quantity} · {formatNaira(item.price)}
                  </p>
                </div>
              </li>
          )}
          </ul>
        </li>
      )}
    </ul>);

}