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

  function set<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    onChange({ ...draft, [key]: value });
  }

  function toggleCategory(slug: string) {
    const next = draft.categorySlugs.includes(slug) ?
    draft.categorySlugs.filter((s) => s !== slug) :
    [...draft.categorySlugs, slug];
    set('categorySlugs', next);
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

        <Field label="Collection line" htmlFor="p-line">
          <TextInput
            id="p-line"
            value={draft.brandLine}
            onChange={(e) => set('brandLine', e.target.value)} />
          
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
          label="Image URLs"
          htmlFor="p-images"
          hint="One URL per line. The first image is the cover."
          className="sm:col-span-2">
          
          <TextArea
            id="p-images"
            rows={3}
            value={imagesText}
            onChange={(e) => {
              setImagesText(e.target.value);
              set(
                'images',
                e.target.value.
                split('\n').
                map((s) => s.trim()).
                filter(Boolean)
              );
            }} />
          
        </Field>
      </div>

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