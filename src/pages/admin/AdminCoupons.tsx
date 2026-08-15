import React, { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Coupon, CouponType } from '../../types';
import { adminApi } from '../../services';
import { formatDate, formatNaira } from '../../utils/format';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminTable, Column } from '../../components/admin/AdminTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/ui/Button';
import {
  Checkbox,
  Field,
  SelectInput,
  TextInput } from
'../../components/ui/Field';

type CouponDraft = Omit<Coupon, 'id'> & {id?: string;};

const emptyCoupon: CouponDraft = {
  code: '',
  type: 'percent',
  value: 10,
  minSpend: 0,
  usageLimit: 100,
  timesUsed: 0,
  expiresAt: '',
  isActive: true
};

export function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [draft, setDraft] = useState<CouponDraft | null>(null);
  const [isSaving, setSaving] = useState(false);

  async function refresh() {
    setCoupons(await adminApi.getAdminCoupons());
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  function set<K extends keyof CouponDraft>(key: K, value: CouponDraft[K]) {
    setDraft((d) => d ? { ...d, [key]: value } : d);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    await adminApi.saveCoupon({ ...draft, code: draft.code.toUpperCase() });
    await refresh();
    setSaving(false);
    setDraft(null);
  }

  async function handleDelete(coupon: Coupon) {
    if (!window.confirm(`Delete coupon ${coupon.code}?`)) return;
    await adminApi.deleteCoupon(coupon.id);
    refresh();
  }

  const columns: Column<Coupon>[] = [
  {
    key: 'code',
    header: 'Code',
    render: (c) => <span className="font-medium text-ink">{c.code}</span>
  },
  {
    key: 'value',
    header: 'Discount',
    render: (c) =>
    c.type === 'percent' ? `${c.value}%` : formatNaira(c.value)
  },
  {
    key: 'minSpend',
    header: 'Min spend',
    hideOnMobile: true,
    render: (c) => c.minSpend ? formatNaira(c.minSpend) : '—'
  },
  {
    key: 'usage',
    header: 'Usage',
    render: (c) =>
    <span className="text-cocoa/70">
          {c.timesUsed} / {c.usageLimit}
        </span>

  },
  {
    key: 'expires',
    header: 'Expires',
    hideOnMobile: true,
    render: (c) => c.expiresAt ? formatDate(c.expiresAt) : 'No expiry'
  },
  {
    key: 'status',
    header: 'Status',
    render: (c) =>
    <StatusBadge
      status={c.isActive ? 'active' : 'inactive'}
      tone={c.isActive ? 'success' : 'neutral'} />


  },
  {
    key: 'actions',
    header: 'Actions',
    className: 'text-right',
    render: (c) =>
    <div className="flex justify-end gap-1">
          <button
        type="button"
        onClick={() => setDraft({ ...c })}
        aria-label={`Edit ${c.code}`}
        className="p-1.5 text-cocoa/60 hover:text-cocoa">
        
            <Pencil size={15} />
          </button>
          <button
        type="button"
        onClick={() => handleDelete(c)}
        aria-label={`Delete ${c.code}`}
        className="p-1.5 text-cocoa/60 hover:text-[#b3261e]">
        
            <Trash2 size={15} />
          </button>
        </div>

  }];


  return (
    <div>
      <AdminPageHeader
        title="Coupons"
        description="Discount codes customers can apply at checkout."
        actions={
        <Button onClick={() => setDraft({ ...emptyCoupon })}>
            <Plus size={15} /> Add coupon
          </Button>
        } />
      

      <AdminTable
        columns={columns}
        rows={coupons}
        rowKey={(c) => c.id}
        isLoading={isLoading} />
      

      <AdminModal
        title={draft?.id ? 'Edit coupon' : 'New coupon'}
        isOpen={draft !== null}
        onClose={() => setDraft(null)}
        footer={
        <>
            <Button variant="ghost" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button type="submit" form="coupon-form" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save coupon'}
            </Button>
          </>
        }>
        
        {draft &&
        <form
          id="coupon-form"
          onSubmit={handleSave}
          className="grid gap-5 sm:grid-cols-2">
          
            <Field label="Code" htmlFor="co-code" required>
              <TextInput
              id="co-code"
              required
              value={draft.code}
              placeholder="MOTUN10"
              className="uppercase"
              onChange={(e) => set('code', e.target.value)} />
            
            </Field>
            <Field label="Type" htmlFor="co-type">
              <SelectInput
              id="co-type"
              value={draft.type}
              onChange={(e) => set('type', e.target.value as CouponType)}>
              
                <option value="percent">Percentage off</option>
                <option value="fixed">Fixed amount off</option>
              </SelectInput>
            </Field>
            <Field
            label={draft.type === 'percent' ? 'Percent (%)' : 'Amount (₦)'}
            htmlFor="co-value"
            required>
            
              <TextInput
              id="co-value"
              type="number"
              min={0}
              required
              value={draft.value}
              onChange={(e) => set('value', Number(e.target.value))} />
            
            </Field>
            <Field label="Minimum spend (₦)" htmlFor="co-min">
              <TextInput
              id="co-min"
              type="number"
              min={0}
              value={draft.minSpend}
              onChange={(e) => set('minSpend', Number(e.target.value))} />
            
            </Field>
            <Field label="Usage limit" htmlFor="co-limit">
              <TextInput
              id="co-limit"
              type="number"
              min={1}
              value={draft.usageLimit}
              onChange={(e) => set('usageLimit', Number(e.target.value))} />
            
            </Field>
            <Field label="Expires on" htmlFor="co-expires">
              <TextInput
              id="co-expires"
              type="date"
              value={draft.expiresAt}
              onChange={(e) => set('expiresAt', e.target.value)} />
            
            </Field>
            <div className="sm:col-span-2">
              <Checkbox
              label="Active"
              checked={draft.isActive}
              onChange={(e) => set('isActive', e.target.checked)} />
            
            </div>
          </form>
        }
      </AdminModal>
    </div>);

}