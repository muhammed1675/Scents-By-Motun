import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { StoreLocation } from '../types';
import { getStoreLocations, submitContactMessage } from '../services';
import { PageHeader } from '../components/PageHeader';
import { Field, TextArea, TextInput } from '../components/ui/Field';
import { Button } from '../components/ui/Button';

interface FormState {
  name: string;
  email: string;
  phone: string;
  comment: string;
}

const empty: FormState = { name: '', email: '', phone: '', comment: '' };

export function Contact() {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isSending, setSending] = useState(false);
  const [isSent, setSent] = useState(false);
  const [locations, setLocations] = useState<StoreLocation[]>([]);

  useEffect(() => {
    getStoreLocations().then(setLocations);
  }, []);

  function set(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = 'Please tell us your name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
    next.email = 'Enter a valid email address.';
    if (form.phone.replace(/\D/g, '').length < 10)
    next.phone = 'Enter a valid phone number.';
    if (form.comment.trim().length < 10)
    next.comment = 'Tell us a little more (10 characters minimum).';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    await submitContactMessage(form);
    setSending(false);
    setSent(true);
    setForm(empty);
  }

  return (
    <div className="w-full bg-ivory">
      <PageHeader
        eyebrow="Contact"
        title="We would love to hear from you"
        description="Questions about a scent, an order, corporate gifting or a partnership — send a note and we reply within one business day."
        crumbs={[{ label: 'Contact' }]} />
      

      <div className="container grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-sm border border-cocoa/10 bg-white p-6 sm:p-8"
          noValidate>
          
          <h2 className="font-heading text-xl text-ink">Send a message</h2>

          {isSent &&
          <p
            role="status"
            className="mt-5 flex items-center gap-2 rounded-sm border border-[#2F5D3A]/25 bg-[#E8F1E9] px-4 py-3 text-sm text-[#2F5D3A]">
            
              <CheckCircle2 size={16} />
              Thank you — your message is with our team.
            </p>
          }

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Name" htmlFor="contact-name" required error={errors.name}>
              <TextInput
                id="contact-name"
                value={form.name}
                autoComplete="name"
                onChange={(e) => set('name', e.target.value)} />
              
            </Field>
            <Field
              label="Email"
              htmlFor="contact-email"
              required
              error={errors.email}>
              
              <TextInput
                id="contact-email"
                type="email"
                value={form.email}
                autoComplete="email"
                onChange={(e) => set('email', e.target.value)} />
              
            </Field>
            <Field
              label="Phone"
              htmlFor="contact-phone"
              required
              error={errors.phone}
              className="sm:col-span-2">
              
              <TextInput
                id="contact-phone"
                type="tel"
                value={form.phone}
                autoComplete="tel"
                placeholder="+234 800 000 0000"
                onChange={(e) => set('phone', e.target.value)} />
              
            </Field>
            <Field
              label="Comment"
              htmlFor="contact-comment"
              required
              error={errors.comment}
              className="sm:col-span-2">
              
              <TextArea
                id="contact-comment"
                rows={6}
                value={form.comment}
                onChange={(e) => set('comment', e.target.value)}
                placeholder="How can we help?" />
              
            </Field>
          </div>

          <Button type="submit" className="mt-6" disabled={isSending}>
            {isSending ? 'Sending…' : 'Send message'}
          </Button>
        </form>

        <aside className="space-y-6">
          <div className="rounded-sm border border-cocoa/10 bg-cream/50 p-6">
            <h2 className="font-heading text-lg text-ink">Reach us directly</h2>
            <ul className="mt-4 space-y-3 text-sm text-cocoa/80">
              <li className="flex gap-2.5">
                <MessageCircle size={16} className="mt-0.5 shrink-0 text-gold" />
                <a
                  href="https://wa.me/2348030001122"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold">
                  
                  WhatsApp: +234 803 000 1122
                </a>
              </li>
              <li className="flex gap-2.5">
                <Phone size={16} className="mt-0.5 shrink-0 text-gold" />
                <a href="tel:+2348030001122" className="hover:text-gold">
                  Call: +234 803 000 1122
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail size={16} className="mt-0.5 shrink-0 text-gold" />
                <a href="mailto:hello@scentbymotun.ng" className="hover:text-gold">
                  hello@scentbymotun.ng
                </a>
              </li>
              <li className="flex gap-2.5">
                <Clock size={16} className="mt-0.5 shrink-0 text-gold" />
                Mon – Sat, 9:00am – 8:00pm WAT
              </li>
            </ul>
          </div>

          <div className="rounded-sm border border-cocoa/10 bg-white p-6">
            <h2 className="font-heading text-lg text-ink">Our stores</h2>
            <ul className="mt-4 space-y-4 text-sm text-cocoa/80">
              {locations.map((loc) =>
              <li key={loc.id} className="flex gap-2.5">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                  <span>
                    <span className="block font-medium text-ink">
                      {loc.city}
                    </span>
                    {loc.address}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>);

}