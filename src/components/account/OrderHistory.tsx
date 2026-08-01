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
    <div className="space-y-6">
      {orders.map((order) =>
      <div
        key={order.id}
        className="rounded-sm border border-cocoa/10 bg-white p-5">
        
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-cocoa/10 pb-4">
            <div>
              <p className="font-medium text-ink">{order.reference}</p>
              <p className="text-xs text-cocoa/60">
                Placed {formatDate(order.createdAt)} ·{' '}
                {order.paymentMethod === 'whatsapp' ? 'WhatsApp' : 'Paid online'}
              </p>
            </div>
            <div className="text-right">
              <StatusBadge status={order.status} />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-chestnut">Order Details</h3>
            <div className="overflow-x-auto rounded-sm border border-cocoa/10">
              <table className="w-full text-sm">
                <tbody>
                  {order.items.map((item) =>
                  <tr key={item.productId} className="border-b border-cocoa/10 last:border-b-0">
                    <td className="px-3 py-2">
                      <img
                        src={item.image}
                        alt=""
                        className="h-12 w-10 rounded-sm object-cover" />
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-ink">{item.name}</p>
                    </td>
                    <td className="px-3 py-2 text-right text-cocoa/60">
                      ×{item.quantity}
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-ink">
                      {formatNaira(item.price)}
                    </td>
                  </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-chestnut">Payment Summary</h3>
            <div className="space-y-1.5 rounded-sm bg-cocoa/5 p-3">
              <div className="flex justify-between text-sm">
                <span className="text-cocoa/60">Subtotal</span>
                <span className="text-ink">{formatNaira(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-cocoa/60">Discount</span>
                  <span className="text-[#2F5D3A]">-{formatNaira(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-cocoa/60">Shipping</span>
                <span className="text-ink">{formatNaira(order.shippingFee)}</span>
              </div>
              <div className="border-t border-cocoa/10 pt-1.5 flex justify-between font-semibold">
                <span className="text-ink">Total</span>
                <span className="text-ink">{formatNaira(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-sm bg-cocoa/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-chestnut mb-1">Payment Status</p>
            <p className="text-sm text-ink font-medium">
              {order.paymentMethod === 'whatsapp' ? '💬 Awaiting WhatsApp confirmation' : '✓ Payment confirmed'}
            </p>
          </div>
        </div>
      )}
    </div>);

}
