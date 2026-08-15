import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { adminApi } from '../../services';
import { formatDateTime, formatNaira } from '../../utils/format';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { SelectInput } from '../../components/ui/Field';
import { EmptyState, Spinner } from '../../components/ui/Loading';
import { Button } from '../../components/ui/Button';

const statuses: OrderStatus[] = [
'pending',
'processing',
'shipped',
'delivered',
'cancelled'];


export function AdminOrderDetail() {
  const { id = '' } = useParams();
  const [order, setOrder] = useState<Order | undefined>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminApi.
    getAdminOrder(id).
    then(setOrder).
    finally(() => setLoading(false));
  }, [id]);

  async function changeStatus(status: OrderStatus) {
    const updated = await adminApi.updateOrderStatus(id, status);
    setOrder(updated);
  }

  if (isLoading) {
    return (
      <div className="grid place-items-center py-24">
        <Spinner />
      </div>);

  }

  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="This order may have been removed."
        action={<Button to="/admin/orders">Back to orders</Button>} />);


  }

  return (
    <div>
      <Link
        to="/admin/orders"
        className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-cocoa/70 hover:text-gold">
        
        <ArrowLeft size={14} /> All orders
      </Link>

      <AdminPageHeader
        title={order.reference}
        description={`Placed ${formatDateTime(order.createdAt)} · ${
        order.paymentMethod === 'whatsapp' ? 'WhatsApp order' : 'Paid online'}`
        }
        actions={
        <div className="flex items-center gap-2">
            <StatusBadge status={order.status} />
            <label htmlFor="detail-status" className="sr-only">
              Update order status
            </label>
            <SelectInput
            id="detail-status"
            value={order.status}
            onChange={(e) => changeStatus(e.target.value as OrderStatus)}
            className="w-auto py-2 text-xs">
            
              {statuses.map((s) =>
            <option key={s} value={s}>
                  {s}
                </option>
            )}
            </SelectInput>
          </div>
        } />
      

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-sm border border-cocoa/10 bg-white p-6">
          <h2 className="font-heading text-lg text-ink">Items</h2>
          <ul className="mt-4 divide-y divide-cocoa/10">
            {order.items.map((item) =>
            <li key={item.productId} className="flex items-center gap-4 py-4">
                <img
                src={item.image}
                alt=""
                className="h-16 w-14 rounded-sm object-cover" />
              
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-cocoa/60">
                    {formatNaira(item.price)} × {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-medium text-cocoa">
                  {formatNaira(item.price * item.quantity)}
                </span>
              </li>
            )}
          </ul>

          <dl className="mt-4 space-y-2.5 border-t border-cocoa/10 pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-cocoa/70">Subtotal</dt>
              <dd>{formatNaira(order.subtotal)}</dd>
            </div>
            {order.discount > 0 &&
            <div className="flex justify-between text-[#2F5D3A]">
                <dt>Discount</dt>
                <dd>−{formatNaira(order.discount)}</dd>
              </div>
            }
            <div className="flex justify-between">
              <dt className="text-cocoa/70">Delivery</dt>
              <dd>{formatNaira(order.shippingFee)}</dd>
            </div>
            <div className="flex justify-between border-t border-cocoa/10 pt-3 font-heading text-lg text-ink">
              <dt>Total</dt>
              <dd>{formatNaira(order.total)}</dd>
            </div>
          </dl>
        </section>

        <aside className="space-y-6">
          <div className="rounded-sm border border-cocoa/10 bg-white p-6">
            <h2 className="font-heading text-lg text-ink">Customer</h2>
            <div className="mt-3 space-y-1.5 text-sm text-cocoa/80">
              <p className="font-medium text-ink">{order.customer.fullName}</p>
              <p>
                <a
                  href={`mailto:${order.customer.email}`}
                  className="hover:text-gold">
                  
                  {order.customer.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${order.customer.phone.replace(/\s/g, '')}`}
                  className="hover:text-gold">
                  
                  {order.customer.phone}
                </a>
              </p>
            </div>
          </div>

          <div className="rounded-sm border border-cocoa/10 bg-white p-6">
            <h2 className="font-heading text-lg text-ink">Shipping</h2>
            <address className="mt-3 text-sm not-italic leading-relaxed text-cocoa/80">
              {order.shipping.street}
              <br />
              {order.shipping.city}, {order.shipping.state}
              <br />
              {order.shipping.country}
            </address>
            {order.shipping.notes &&
            <p className="mt-3 rounded-sm bg-cream/70 p-3 text-xs text-cocoa/75">
                “{order.shipping.notes}”
              </p>
            }
          </div>
        </aside>
      </div>
    </div>);

}