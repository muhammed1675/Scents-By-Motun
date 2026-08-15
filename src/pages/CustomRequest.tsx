import React, { useRef, useState } from 'react';
import { CheckCircle2, ImagePlus, MessageCircle, Sparkles, X } from 'lucide-react';
import { submitCustomRequest, uploadRequestImages } from '../services';
import { PageHeader } from '../components/PageHeader';
import { Field, TextArea, TextInput } from '../components/ui/Field';
import { Button } from '../components/ui/Button';

interface FormState {
  itemDescription: string;
  details: string;
  quantity: string;
  budget: string;
  needBy: string;
  fullName: string;
  phone: string;
  email: string;
}

const empty: FormState = {
  itemDescription: '',
  details: '',
  quantity: '1',
  budget: '',
  needBy: '',
  fullName: '',
  phone: '',
  email: ''
};

const MAX_IMAGES = 5;

export function CustomRequest() {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSending, setSending] = useState(false);
  const [isSent, setSent] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list).slice(0, MAX_IMAGES - files.length);
    setFiles((f) => [...f, ...incoming]);
    setPreviews((p) => [...p, ...incoming.map((file) => URL.createObjectURL(file))]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeFile(index: number) {
    setFiles((f) => f.filter((_, i) => i !== index));
    setPreviews((p) => p.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Partial<FormState> = {};
    if (form.itemDescription.trim().length < 5)
    next.itemDescription = 'Tell us what you are looking for.';
    if (!form.fullName.trim()) next.fullName = 'Please tell us your name.';
    if (form.phone.replace(/\D/g, '').length < 10)
    next.phone = 'Enter a valid WhatsApp number.';
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
    next.email = 'Enter a valid email address, or leave it blank.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    setSubmitError('');
    try {
      const referenceImages = await uploadRequestImages(files);
      const request = await submitCustomRequest({
        itemDescription: form.itemDescription,
        details: form.details,
        quantity: Math.max(1, Number(form.quantity) || 1),
        budget: form.budget ? Number(form.budget) : undefined,
        needBy: form.needBy || undefined,
        referenceImages,
        fullName: form.fullName,
        phone: form.phone,
        email: form.email
      });
      setSent(request.reference);
      setForm(empty);
      setFiles([]);
      setPreviews([]);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Could not send your request right now.'
      );
    } finally {
      setSending(false);
    }
  }

  if (isSent) {
    return (
      <div className="w-full bg-ivory">
        <PageHeader
          eyebrow="Custom Request"
          title="Can't find your scent? We'll source it."
          crumbs={[{ label: 'Custom Request' }]} />
        
        <div className="container py-16">
          <div className="mx-auto max-w-lg rounded-sm border border-cocoa/10 bg-white p-8 text-center">
            <CheckCircle2 size={36} className="mx-auto text-[#2F5D3A]" />
            <h2 className="mt-4 font-heading text-2xl text-ink">Request received</h2>
            <p className="mt-2 text-sm text-cocoa/70">
              Your reference is{' '}
              <span className="font-medium text-ink">{isSent}</span>. We review
              every request and reply on WhatsApp or email — usually within one
              business day — with pricing and availability before anything is
              charged.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button to="/shop" variant="outline">
                Continue shopping
              </Button>
              <Button
                onClick={() => setSent(null)}
                variant="ghost">
                
                Send another request
              </Button>
            </div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="w-full bg-ivory">
      <PageHeader
        eyebrow="Custom Request"
        title="Can't find your scent? We'll source it."
        description="Looking for a specific fragrance, a discontinued bottle, or a gift set we don't currently stock? Describe it below — or attach a photo — and our team will find it and price it for you, delivered to you in Nigeria."
        crumbs={[{ label: 'Custom Request' }]} />
      

      <div className="container grid gap-10 py-12 lg:grid-cols-[1fr_340px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-sm border border-cocoa/10 bg-white p-6 sm:p-8"
          noValidate>
          
          <h2 className="font-heading text-xl text-ink">Describe what you need</h2>

          {submitError &&
          <p className="mt-5 rounded-sm border border-[#8F1E18]/25 bg-[#F8E7E5] px-4 py-3 text-sm text-[#8F1E18]">
              {submitError}
            </p>
          }

          <div className="mt-6 grid gap-5">
            <Field
              label="What are you looking for?"
              htmlFor="req-item"
              required
              error={errors.itemDescription}>
              
              <TextInput
                id="req-item"
                value={form.itemDescription}
                placeholder="e.g. Bleu de Chanel EDP, 100ml"
                onChange={(e) => set('itemDescription', e.target.value)} />
              
            </Field>

            <Field
              label="Details"
              htmlFor="req-details"
              hint="Brand, size, notes, or anything that helps us find the right bottle.">
              
              <TextArea
                id="req-details"
                rows={5}
                value={form.details}
                onChange={(e) => set('details', e.target.value)}
                placeholder="Tell us anything that will help us find the right product." />
              
            </Field>

            <Field label="Reference photos (optional, up to 5)" htmlFor="req-images">
              <div className="flex flex-wrap gap-3">
                {previews.map((src, i) =>
                <div
                  key={src}
                  className="relative h-20 w-20 overflow-hidden rounded-sm border border-cocoa/15">
                  
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button
                    type="button"
                    onClick={() => removeFile(i)}
                    aria-label="Remove image"
                    className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-ink/70 text-ivory">
                    
                      <X size={12} />
                    </button>
                  </div>
                )}
                {files.length < MAX_IMAGES &&
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="grid h-20 w-20 place-items-center rounded-sm border border-dashed border-cocoa/30 text-cocoa/50 hover:border-gold hover:text-gold">
                  
                    <span className="flex flex-col items-center gap-1 text-[10px]">
                      <ImagePlus size={18} />
                      Add
                    </span>
                  </button>
                }
              </div>
              <input
                ref={fileInputRef}
                id="req-images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)} />
              
            </Field>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Quantity" htmlFor="req-qty">
                <TextInput
                  id="req-qty"
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) => set('quantity', e.target.value)} />
                
              </Field>
              <Field label="Budget (₦)" htmlFor="req-budget">
                <TextInput
                  id="req-budget"
                  type="number"
                  min={0}
                  placeholder="50,000"
                  value={form.budget}
                  onChange={(e) => set('budget', e.target.value)} />
                
              </Field>
              <Field label="Need it by" htmlFor="req-need-by">
                <TextInput
                  id="req-need-by"
                  type="date"
                  value={form.needBy}
                  onChange={(e) => set('needBy', e.target.value)} />
                
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Your name"
                htmlFor="req-name"
                required
                error={errors.fullName}>
                
                <TextInput
                  id="req-name"
                  value={form.fullName}
                  autoComplete="name"
                  onChange={(e) => set('fullName', e.target.value)} />
                
              </Field>
              <Field
                label="Phone (WhatsApp)"
                htmlFor="req-phone"
                required
                error={errors.phone}>
                
                <TextInput
                  id="req-phone"
                  type="tel"
                  value={form.phone}
                  autoComplete="tel"
                  placeholder="+234 800 000 0000"
                  onChange={(e) => set('phone', e.target.value)} />
                
              </Field>
            </div>

            <Field
              label="Email (optional)"
              htmlFor="req-email"
              error={errors.email}>
              
              <TextInput
                id="req-email"
                type="email"
                value={form.email}
                autoComplete="email"
                onChange={(e) => set('email', e.target.value)} />
              
            </Field>
          </div>

          <Button type="submit" className="mt-6" disabled={isSending}>
            {isSending ? 'Sending…' : 'Send my request'}
          </Button>
          <p className="mt-3 text-xs text-cocoa/60">
            No payment now. We review your request and send you a quote first.
          </p>
        </form>

        <aside className="space-y-6">
          <div className="rounded-sm border border-cocoa/10 bg-cream/50 p-6">
            <Sparkles size={18} className="text-gold" />
            <h2 className="mt-3 font-heading text-lg text-ink">How sourcing works</h2>
            <ol className="mt-4 space-y-3 text-sm text-cocoa/80">
              <li>
                <span className="font-medium text-ink">1. You describe it.</span>{' '}
                A name, a photo, even a vague description of the scent works.
              </li>
              <li>
                <span className="font-medium text-ink">2. We find and price it.</span>{' '}
                Our team checks authenticity and gives you a landed price in
                Naira — nothing is charged yet.
              </li>
              <li>
                <span className="font-medium text-ink">3. You confirm, we deliver.</span>{' '}
                Approve the quote and we handle the rest, right to your door.
              </li>
            </ol>
          </div>
          <div className="rounded-sm border border-cocoa/10 bg-white p-6">
            <h2 className="font-heading text-lg text-ink">Prefer to chat?</h2>
            <p className="mt-2 text-sm text-cocoa/70">
              Send a photo straight to us on WhatsApp and skip the form.
            </p>
            <a
              href="https://wa.me/2348030001122"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cocoa hover:text-gold">
              
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </div>);

}
