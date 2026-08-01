import React, { useEffect, useState } from 'react';
import { Mail, MailOpen, Phone } from 'lucide-react';
import { ContactMessage } from '../../types';
import { adminApi } from '../../services';
import { formatDateTime, cn } from '../../utils/format';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { EmptyState, Spinner } from '../../components/ui/Loading';

export function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.
    getAdminMessages().
    then((m) => {
      setMessages(m);
      setActiveId(m[0]?.id ?? null);
    }).
    finally(() => setLoading(false));
  }, []);

  async function toggleRead(id: string, isRead: boolean) {
    setMessages(await adminApi.markMessageRead(id, isRead));
  }

  const active = messages.find((m) => m.id === activeId);
  const unread = messages.filter((m) => !m.isRead).length;

  if (isLoading) {
    return (
      <div className="grid place-items-center py-24">
        <Spinner />
      </div>);

  }

  return (
    <div>
      <AdminPageHeader
        title="Contact messages"
        description={`${messages.length} messages · ${unread} unread`} />
      

      {messages.length === 0 ?
      <EmptyState title="Inbox is empty" /> :

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <ul className="divide-y divide-cocoa/10 overflow-hidden rounded-sm border border-cocoa/10 bg-white">
            {messages.map((m) =>
          <li key={m.id}>
                <button
              type="button"
              onClick={() => {
                setActiveId(m.id);
                if (!m.isRead) toggleRead(m.id, true);
              }}
              aria-current={m.id === activeId}
              className={cn(
                'flex w-full gap-3 px-4 py-4 text-left transition',
                m.id === activeId ? 'bg-cream/70' : 'hover:bg-cream/40'
              )}>
              
                  {m.isRead ?
              <MailOpen size={16} className="mt-0.5 shrink-0 text-cocoa/40" /> :

              <Mail size={16} className="mt-0.5 shrink-0 text-gold" />
              }
                  <div className="min-w-0">
                    <p
                  className={cn(
                    'truncate text-sm',
                    m.isRead ? 'text-cocoa' : 'font-medium text-ink'
                  )}>
                  
                      {m.name}
                    </p>
                    <p className="truncate text-xs text-cocoa/60">
                      {m.comment}
                    </p>
                    <p className="mt-1 text-[11px] text-cocoa/45">
                      {formatDateTime(m.createdAt)}
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
                    {active.name}
                  </h2>
                  <p className="mt-1 text-xs text-cocoa/60">
                    {formatDateTime(active.createdAt)}
                  </p>
                </div>
                <button
              type="button"
              onClick={() => toggleRead(active.id, !active.isRead)}
              className="rounded-sm border border-cocoa/20 px-3 py-1.5 text-xs text-cocoa hover:bg-cream">
              
                  Mark as {active.isRead ? 'unread' : 'read'}
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <a
              href={`mailto:${active.email}`}
              className="inline-flex items-center gap-1.5 text-cocoa hover:text-gold">
              
                  <Mail size={14} /> {active.email}
                </a>
                <a
              href={`tel:${active.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-1.5 text-cocoa hover:text-gold">
              
                  <Phone size={14} /> {active.phone}
                </a>
              </div>

              <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-cocoa/85">
                {active.comment}
              </p>

              <a
            href={`mailto:${active.email}?subject=Re: your message to Scent by Motun`}
            className="mt-6 inline-flex rounded-sm bg-cocoa px-5 py-2.5 text-xs uppercase tracking-widest text-ivory hover:bg-ink">
            
                Reply by email
              </a>
            </article>
        }
        </div>
      }
    </div>);

}