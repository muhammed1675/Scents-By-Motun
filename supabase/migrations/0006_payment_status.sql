/* Adds a payment_status column to orders, separate from the fulfillment
   status (pending/processing/shipped/delivered/cancelled). This lets the
   storefront show "Payment: Paid" and "Order: Shipped" as two distinct
   pieces of information instead of conflating them into one status. */

alter table public.orders
  add column if not exists payment_status text
  not null default 'unpaid'
  check (payment_status in ('unpaid', 'paid', 'awaiting_confirmation', 'refunded'));

-- Backfill existing rows sensibly based on what we already know:
--  - online orders that have moved past 'pending' were marked paid by the
--    Paystack webhook, so they're paid
--  - whatsapp orders are confirmed manually, so anything already moving
--    (not pending/cancelled) is treated as awaiting confirmation resolved
--  - cancelled orders are refunded/void
update public.orders
set payment_status = case
  when status = 'cancelled' then 'refunded'
  when payment_method = 'online' and status <> 'pending' then 'paid'
  when payment_method = 'whatsapp' and status <> 'pending' then 'paid'
  when payment_method = 'whatsapp' then 'awaiting_confirmation'
  else 'unpaid'
end
where payment_status = 'unpaid';