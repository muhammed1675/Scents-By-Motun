import React, { useEffect, useState } from 'react';
import { Mail, Package, Phone } from 'lucide-react';
import { CustomRequest, CustomRequestStatus } from '../../types';
import { adminApi } from '../../services';
import { formatDateTime, formatNaira, cn } from '../../utils/format';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { EmptyState, Spinner } from '../../components/ui/Loading';
import { SelectInput, TextArea } from '../../components/ui/Field';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/ui/Button';

const statusOptions: CustomRequestStatus[] = [
'new',
'reviewing',
'quoted',
'fulfilled',
'declined'];


export function AdminCustomRequests() {
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [isSaving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.
    getAdminCustomRequests().
    then((r) => {
      setRequests(r);
      setActiveId(r[0]?.id ?? null);
    }).
    finally(() => setLoading(false));
  }, []);

  const active = requests.find((r) => r.id === activeId);

  useEffect(() => {
    setNotes(active?.adminNotes ?? '');
  }, [activeId]);

  async function updateStatus(id: string, status: CustomRequestStatus) {
    setRequests(await adminApi.updateCustomRequest(id, { status }));
  }

  async function saveNotes(id: string) {
    setSaving(true);
    setRequests(await adminApi.updateCustomRequest(id, { adminNotes: notes }));
    setSaving(false);
  }

  if (isLoading) {
    return (
      <div className="grid place-items-center py-24">
        <Spinner />
      </div>);

  }

  return (
    <div>
      <AdminPageHeader
        title="Custom requests"
        description={`${requests.length} requests · ${requests.filter((r) => r.status === 'new').length} new`} />
      

      {requests.length === 0 ?
      <EmptyState title="No custom requests yet" /> :

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <ul className="divide-y divide-cocoa/10 overflow-hidden rounded-sm border border-cocoa/10 bg-white">
            {requests.map((r) =>
          <li key={r.id}>
                <button
              type="button"
              onClick={() => setActiveId(r.id)}
              aria-current={r.id === activeId}
              className={cn(
                'flex w-full gap-3 px-4 py-4 text-left transition',
                r.id === activeId ? 'bg-cream/70' : 'hover:bg-cream/40'
              )}>
              
                  <Package size={16} className="mt-0.5 shrink-0 text-gold" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-ink">
                        {r.fullName}
                      </p>
                      <StatusBadge status={r.status} tone={
                    r.status === 'new' ?
                    'warning' :
                    r.status === 'reviewing' ?
                    'info' :
                    r.status === 'quoted' ?
                    'gold' :
                    r.status === 'fulfilled' ?
                    'success' :
                    'danger'
                    } />
                    </div>
                    <p className="truncate text-xs text-cocoa/60">
                      {r.itemDescription}
                    </p>
                    <p className="mt-1 text-[11px] text-cocoa/45">
                      {r.reference} · {formatDateTime(r.createdAt)}
                    </p>
                  </div>
                </button>
              </li>
          )}
          </ul>

          {active &&
        <article className="h-fit rounded-sm border border-cocoa/10 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-cocoa/10 pb-4">
                <div>
                  <h2 className="font-heading text-xl text-ink">
                    {active.itemDescription}
                  </h2>
                  <p className="mt-1 text-xs text-cocoa/60">
                    {active.reference} · {formatDateTime(active.createdAt)}
                  </p>
                </div>
                <SelectInput
              value={active.status}
              onChange={(e) =>
              updateStatus(active.id, e.target.value as CustomRequestStatus)
              }
              className="w-auto">
              
                  {statusOptions.map((s) =>
              <option key={s} value={s} className="capitalize">
                      {s}
                    </option>
              )}
                </SelectInput>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <span className="text-cocoa">
                  From <span className="text-ink">{active.fullName}</span>
                </span>
                {active.email &&
            <a
              href={`mailto:${active.email}`}
              className="inline-flex items-center gap-1.5 text-cocoa hover:text-gold">
              
                    <Mail size={14} /> {active.email}
                  </a>
            }
                <a
              href={`https://wa.me/${active.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-cocoa hover:text-gold">
              
                  <Phone size={14} /> {active.phone}
                </a>
              </div>

              <dl className="mt-5 grid grid-cols-3 gap-4 rounded-sm bg-cream/50 p-4 text-sm">
                <div>
                  <dt className="text-[11px] uppercase tracking-widest text-chestnut">Qty</dt>
                  <dd className="mt-0.5 text-ink">{active.quantity}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-widest text-chestnut">Budget</dt>
                  <dd className="mt-0.5 text-ink">
                    {active.budget ? formatNaira(active.budget) : '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-widest text-chestnut">Need by</dt>
                  <dd className="mt-0.5 text-ink">{active.needBy ?? '—'}</dd>
                </div>
              </dl>

              {active.details &&
          <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-cocoa/85">
                  {active.details}
                </p>
          }

              {active.referenceImages.length > 0 &&
          <div className="mt-5 flex flex-wrap gap-2">
                  {active.referenceImages.map((src) =>
            <a key={src} href={src} target="_blank" rel="noopener noreferrer">
                      <img
                src={src}
                alt=""
                className="h-20 w-20 rounded-sm border border-cocoa/10 object-cover" />
              
                    </a>
            )}
                </div>
          }

              <div className="mt-6 border-t border-cocoa/10 pt-5">
                <label
              htmlFor="admin-notes"
              className="block text-xs font-medium uppercase tracking-widest text-chestnut">
              
                  Internal notes
                </label>
                <TextArea
              id="admin-notes"
              rows={3}
              className="mt-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Sourcing notes, quoted price, supplier link…" />
              
                <Button
              size="sm"
              variant="secondary"
              className="mt-3"
              disabled={isSaving}
              onClick={() => saveNotes(active.id)}>
              
                  {isSaving ? 'Saving…' : 'Save notes'}
                </Button>
              </div>
            </article>
        }
        </div>
      }
    </div>);

}
