import React, { useEffect, useState } from 'react';
import { Check, Star, X } from 'lucide-react';
import { Testimonial, TestimonialStatus } from '../../types';
import { adminApi } from '../../services';
import { formatDate, cn } from '../../utils/format';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState, Spinner } from '../../components/ui/Loading';

const filters: Array<TestimonialStatus | 'all'> = [
'all',
'pending',
'approved',
'rejected'];


export function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filter, setFilter] = useState<TestimonialStatus | 'all'>('all');
  const [isLoading, setLoading] = useState(true);

  async function refresh() {
    setTestimonials(await adminApi.getAdminTestimonials());
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function setStatus(id: string, status: TestimonialStatus) {
    await adminApi.setTestimonialStatus(id, status);
    refresh();
  }

  const visible =
  filter === 'all' ?
  testimonials :
  testimonials.filter((t) => t.status === filter);

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Approve customer reviews before they appear on the storefront." />
      

      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto">
        {filters.map((f) =>
        <button
          key={f}
          type="button"
          onClick={() => setFilter(f)}
          aria-pressed={filter === f}
          className={cn(
            'whitespace-nowrap rounded-full border px-4 py-1.5 text-xs capitalize transition',
            filter === f ?
            'border-cocoa bg-cocoa text-ivory' :
            'border-cocoa/20 text-cocoa hover:bg-cream'
          )}>
          
            {f === 'all' ? 'All' : f}
          </button>
        )}
      </div>

      {isLoading ?
      <div className="grid place-items-center py-16">
          <Spinner />
        </div> :
      visible.length === 0 ?
      <EmptyState title="No testimonials with this status" /> :

      <ul className="grid gap-4 lg:grid-cols-2">
          {visible.map((t) =>
        <li
          key={t.id}
          className="rounded-sm border border-cocoa/10 bg-white p-5">
          
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{t.name}</p>
                  <p className="text-xs text-cocoa/60">
                    {t.location} · {formatDate(t.createdAt)}
                  </p>
                </div>
                <StatusBadge status={t.status} />
              </div>

              <div
            className="mt-3 flex gap-0.5"
            aria-label={`${t.rating} out of 5 stars`}>
            
                {Array.from({ length: 5 }).map((_, i) =>
            <Star
              key={i}
              size={13}
              className={
              i < t.rating ? 'fill-gold text-gold' : 'text-cocoa/20'
              } />

            )}
              </div>

              <blockquote className="mt-3 text-sm leading-relaxed text-cocoa/80">
                “{t.quote}”
              </blockquote>

              <div className="mt-5 flex gap-2">
                <button
              type="button"
              onClick={() => setStatus(t.id, 'approved')}
              disabled={t.status === 'approved'}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#2F5D3A]/30 bg-[#E8F1E9] px-3 py-1.5 text-xs text-[#2F5D3A] disabled:opacity-40">
              
                  <Check size={13} /> Approve
                </button>
                <button
              type="button"
              onClick={() => setStatus(t.id, 'rejected')}
              disabled={t.status === 'rejected'}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#8F1E18]/30 bg-[#F8E7E5] px-3 py-1.5 text-xs text-[#8F1E18] disabled:opacity-40">
              
                  <X size={13} /> Reject
                </button>
              </div>
            </li>
        )}
        </ul>
      }
    </div>);

}