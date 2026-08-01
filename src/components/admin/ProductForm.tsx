import React, { useState } from 'react';
import { Category, Product } from '../../types';
import { Checkbox, Field, SelectInput, TextArea, TextInput } from '../ui/Field';

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

const COLLECTION_LINES = [
  'Signature Collection',
  'Premium Line',
  'Limited Edition',
  'Seasonal Collection',
  'Exclusive Blend'
];

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
  const [imagesText, setImagesText] = useState(draft.images.join('\n'));
  const [topNotesText, setTopNotesText] = useState(draft.notes.top.join(', '));
  const [heartNotesText, setHeartNotesText] = useState(draft.notes.heart.join(', '));
  const [baseNotesText, setBaseNotesText] = useState(draft.notes.base.join(', '));

  function set<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    onChange({ ...draft, [key]: value });
  }

  function toggleCategory(slug: string) {
    const next = draft.categorySlugs.includes(slug) ?
    draft.categorySlugs.filter((s) => s !== slug) :
    [...draft.categorySlugs, slug];
    set('categorySlugs', next);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 3);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    set('images', imageUrls);
  }

  function updateTopNotes(text: string) {
    setTopNotesText(text);
    set('notes', {
      ...draft.notes,
      top: text.split(',').map(s => s.trim()).filter(Boolean)
    });
  }

  function updateHeartNotes(text: string) {
    setHeartNotesText(text);
    set('notes', {
      ...draft.notes,
      heart: text.split(',').map(s => s.trim()).filter(Boolean)
    });
  }

  function updateBaseNotes(text: string) {
    setBaseNotesText(text);
    set('notes', {
      ...draft.notes,
      base: text.split(',').map(s => s.trim()).filter(Boolean)
    });
  }

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

        <Field label="Collection line" htmlFor="p-line" required>
          <SelectInput
            id="p-line"
            required
            value={draft.brandLine}
            onChange={(e) => set('brandLine', e.target.value)}>
            
            {COLLECTION_LINES.map((line) =>
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
          htmlFor="p-images"
          hint="Upload up to 3 images. First image is the cover."
          className="sm:col-span-2">
          
          <input
            id="p-images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-cocoa/10 file:text-cocoa hover:file:bg-cocoa/20" />
          
          {draft.images.length > 0 && (
            <div className="mt-2 flex gap-2">
              {draft.images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img} alt={`Preview ${idx + 1}`} className="h-20 w-20 rounded object-cover" />
                  <button
                    type="button"
                    onClick={() => set('images', draft.images.filter((_, i) => i !== idx))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </Field>
      </div>

      <fieldset className="space-y-3">
        <legend className="mb-3 text-xs font-medium uppercase tracking-widest text-chestnut">
          Fragrance Notes
        </legend>
        
        <Field label="Top notes" htmlFor="p-top-notes" hint="Comma-separated (e.g., Bergamot, Lemon, Pink Pepper)">
          <TextInput
            id="p-top-notes"
            placeholder="Enter top notes separated by commas"
            value={topNotesText}
            onChange={(e) => updateTopNotes(e.target.value)} />
          
        </Field>

        <Field label="Heart notes" htmlFor="p-heart-notes" hint="Comma-separated (e.g., Jasmine, Rose, Vanilla)">
          <TextInput
            id="p-heart-notes"
            placeholder="Enter heart notes separated by commas"
            value={heartNotesText}
            onChange={(e) => updateHeartNotes(e.target.value)} />
          
        </Field>

        <Field label="Base notes" htmlFor="p-base-notes" hint="Comma-separated (e.g., Sandalwood, Musk, Oud)">
          <TextInput
            id="p-base-notes"
            placeholder="Enter base notes separated by commas"
            value={baseNotesText}
            onChange={(e) => updateBaseNotes(e.target.value)} />
          
        </Field>
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
