import React, { useState } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import { Category, Product } from '../../types';
import { Checkbox, Field, SelectInput, TextArea, TextInput } from '../ui/Field';
import { adminApi } from '../../services';

export type ProductDraft = Omit<Product, 'id' | 'slug'> & {
  id?: string;
  slug?: string;
};

export const emptyProduct: ProductDraft = {
  name: '',
  brandLine: 'Signature Collection',
  description: '',
  notes: { top: [], heart: [], base: [] },
  price: 0,
  size: '100ml',
  images: [],
  categorySlugs: [],
  stock: 0,
  isNewArrival: false,
  isBestSeller: false,
  isActive: true,
  rating: 5,
  reviewCount: 0
};

const MAX_IMAGES = 3;

// Known collection lines used across the catalogue. If a product being
// edited has a custom value not in this list, it's added on the fly below
// so existing data is never silently dropped.
const COLLECTION_LINES = [
'Signature Collection',
'Designer',
'Everyday',
'City Series',
'Oil Collection',
'Combo',
'Gifting',
'Home',
'Miniatures',
'Archive'];


function parseNoteList(value: string): string[] {
  return value.
  split(',').
  map((n) => n.trim()).
  filter(Boolean);
}

interface ProductFormProps {
  draft: ProductDraft;
  categories: Category[];
  onChange: (draft: ProductDraft) => void;
  formId: string;
  onSubmit: () => void;
}

export function ProductForm({
  draft,
  categories,
  onChange,
  formId,
  onSubmit
}: ProductFormProps) {
  const [uploading, setUploading] = useState<boolean[]>([false, false, false]);
  const [uploadError, setUploadError] = useState('');

  function set<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    onChange({ ...draft, [key]: value });
  }

  function toggleCategory(slug: string) {
    const next = draft.categorySlugs.includes(slug) ?
    draft.categorySlugs.filter((s) => s !== slug) :
    [...draft.categorySlugs, slug];
    set('categorySlugs', next);
  }

  async function handleFileSelect(index: number, file: File | undefined) {
    if (!file) return;
    setUploadError('');
    setUploading((u) => u.map((v, i) => i === index ? true : v));
    try {
      const url = await adminApi.uploadProductImage(file);
      const next = [...draft.images];
      while (next.length <= index) next.push('');
      next[index] = url;
      set('images', next.filter(Boolean));
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Could not upload that image.'
      );
    } finally {
      setUploading((u) => u.map((v, i) => i === index ? false : v));
    }
  }

  function removeImage(index: number) {
    set('images', draft.images.filter((_, i) => i !== index));
  }

  const lineOptions =
  draft.brandLine && !COLLECTION_LINES.includes(draft.brandLine) ?
  [draft.brandLine, ...COLLECTION_LINES] :
  COLLECTION_LINES;

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6">
      
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Product name" htmlFor="p-name" required className="sm:col-span-2">
          <TextInput
            id="p-name"
            required
            value={draft.name}
            onChange={(e) => set('name', e.target.value)} />
          
        </Field>

        <Field label="Collection line" htmlFor="p-line">
          <SelectInput
            id="p-line"
            value={draft.brandLine}
            onChange={(e) => set('brandLine', e.target.value)}>
            
            {lineOptions.map((line) =>
            <option key={line} value={line}>
                {line}
              </option>
            )}
          </SelectInput>
        </Field>

        <Field label="Size" htmlFor="p-size">
          <TextInput
            id="p-size"
            value={draft.size}
            placeholder="100ml"
            onChange={(e) => set('size', e.target.value)} />
          
        </Field>

        <Field label="Price (₦)" htmlFor="p-price" required>
          <TextInput
            id="p-price"
            type="number"
            min={0}
            required
            value={draft.price}
            onChange={(e) => set('price', Number(e.target.value))} />
          
        </Field>

        <Field
          label="Compare-at price (₦)"
          htmlFor="p-compare"
          hint="Leave blank if not on sale.">
          
          <TextInput
            id="p-compare"
            type="number"
            min={0}
            value={draft.compareAtPrice ?? ''}
            onChange={(e) =>
            set(
              'compareAtPrice',
              e.target.value ? Number(e.target.value) : undefined
            )
            } />
          
        </Field>

        <Field label="Stock quantity" htmlFor="p-stock" required>
          <TextInput
            id="p-stock"
            type="number"
            min={0}
            required
            value={draft.stock}
            onChange={(e) => set('stock', Number(e.target.value))} />
          
        </Field>

        <Field label="Rating" htmlFor="p-rating">
          <SelectInput
            id="p-rating"
            value={draft.rating}
            onChange={(e) => set('rating', Number(e.target.value))}>
            
            {[5, 4.9, 4.8, 4.7, 4.6, 4.5, 4, 3.5, 3].map((r) =>
            <option key={r} value={r}>
                {r}
              </option>
            )}
          </SelectInput>
        </Field>

        <Field
          label="Description"
          htmlFor="p-description"
          className="sm:col-span-2">
          
          <TextArea
            id="p-description"
            rows={4}
            value={draft.description}
            onChange={(e) => set('description', e.target.value)} />
          
        </Field>

        <Field
          label="Product images"
          htmlFor="p-image-0"
          hint={`Upload up to ${MAX_IMAGES} photos. The first is the cover image.`}
          error={uploadError}
          className="sm:col-span-2">
          
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: MAX_IMAGES }).map((_, i) => {
              const url = draft.images[i];
              return (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-sm border border-dashed border-cocoa/25 bg-cream">
                  
                  {url ?
                  <>
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                      type="button"
                      onClick={() => removeImage(i)}
                      aria-label="Remove image"
                      className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-ink/70 text-ivory hover:bg-ink">
                      
                        <X size={13} />
                      </button>
                      {i === 0 &&
                    <span className="absolute left-1.5 top-1.5 bg-cocoa px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-ivory">
                          Cover
                        </span>
                    }
                    </> :

                  <label
                    htmlFor={`p-image-${i}`}
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 text-cocoa/50 transition hover:text-cocoa">
                    
                      {uploading[i] ?
                    <Loader2 size={18} className="animate-spin" /> :

                    <>
                          <Upload size={18} />
                          <span className="text-[10px] uppercase tracking-widest">
                            Upload
                          </span>
                        </>
                    }
                      <input
                      id={`p-image-${i}`}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={uploading[i]}
                      onChange={(e) => {
                        handleFileSelect(i, e.target.files?.[0]);
                        e.target.value = '';
                      }} />
                    
                    </label>
                  }
                </div>);

            })}
          </div>
        </Field>
      </div>

      <fieldset>
        <legend className="mb-1 text-xs font-medium uppercase tracking-widest text-chestnut">
          Fragrance notes
        </legend>
        <p className="mb-3 text-xs text-cocoa/55">
          Separate each note with a comma. These show on the product page
          under Top / Heart / Base notes.
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Top notes" htmlFor="p-notes-top">
            <TextInput
              id="p-notes-top"
              value={draft.notes.top.join(', ')}
              placeholder="Bergamot, Black plum"
              onChange={(e) =>
              set('notes', { ...draft.notes, top: parseNoteList(e.target.value) })
              } />
            
          </Field>
          <Field label="Heart notes" htmlFor="p-notes-heart">
            <TextInput
              id="p-notes-heart"
              value={draft.notes.heart.join(', ')}
              placeholder="Rose absolute, Saffron"
              onChange={(e) =>
              set('notes', { ...draft.notes, heart: parseNoteList(e.target.value) })
              } />
            
          </Field>
          <Field label="Base notes" htmlFor="p-notes-base">
            <TextInput
              id="p-notes-base"
              value={draft.notes.base.join(', ')}
              placeholder="Oud, Smoked vanilla, Amber"
              onChange={(e) =>
              set('notes', { ...draft.notes, base: parseNoteList(e.target.value) })
              } />
            
          </Field>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-medium uppercase tracking-widest text-chestnut">
          Categories
        </legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {categories.map((c) =>
          <Checkbox
            key={c.id}
            label={c.name}
            checked={draft.categorySlugs.includes(c.slug)}
            onChange={() => toggleCategory(c.slug)} />

          )}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-medium uppercase tracking-widest text-chestnut">
          Flags
        </legend>
        <div className="grid gap-2 sm:grid-cols-3">
          <Checkbox
            label="New arrival"
            checked={draft.isNewArrival}
            onChange={(e) => set('isNewArrival', e.target.checked)} />
          
          <Checkbox
            label="Best seller"
            checked={draft.isBestSeller}
            onChange={(e) => set('isBestSeller', e.target.checked)} />
          
          <Checkbox
            label="Active (visible in store)"
            checked={draft.isActive}
            onChange={(e) => set('isActive', e.target.checked)} />
          
        </div>
      </fieldset>
    </form>);

}