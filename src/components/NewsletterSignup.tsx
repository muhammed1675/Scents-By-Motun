import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { subscribeToNewsletter } from '../services';
import { Button } from './ui/Button';
import { cn } from '../utils/format';

export function NewsletterSignup({ className }: {className?: string;}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(
    'idle'
  );
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    const result = await subscribeToNewsletter(email);
    setMessage(result.message);
    setStatus(result.ok ? 'done' : 'error');
    if (result.ok) setEmail('');
  }

  return (
    <section
      className={cn('bg-cocoa px-4 py-14 text-ivory sm:py-20', className)}
      aria-labelledby="newsletter-heading">
      
      <div className="mx-auto max-w-xl text-center">
        <p className="text-[11px] uppercase tracking-widest text-gold">
          The Motun List
        </p>
        <h2
          id="newsletter-heading"
          className="mt-2 font-heading text-3xl sm:text-4xl">
          
          10% off your first order
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ivory/70">
          Early access to new blends, restock alerts and gifting guides. One
          email a month — no more.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-7 flex flex-col gap-2.5 sm:flex-row">
          
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="flex-1 rounded-sm border border-ivory/25 bg-transparent px-4 py-3 text-sm text-ivory placeholder:text-ivory/40 focus:border-gold focus:outline-none" />
          
          <Button
            type="submit"
            variant="gold"
            disabled={status === 'loading'}
            className="sm:w-auto">
            
            {status === 'loading' ? 'Joining…' : 'Join the list'}
          </Button>
        </form>

        {message &&
        <p
          role="status"
          className={cn(
            'mt-3 flex items-center justify-center gap-1.5 text-xs',
            status === 'done' ? 'text-gold' : 'text-blush'
          )}>
          
            {status === 'done' && <Check size={14} />}
            {message}
          </p>
        }
      </div>
    </section>);

}