import React, { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Category, Product } from '../../types';
import { adminApi } from '../../services';
import { formatNaira } from '../../utils/format';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminTable, Column } from '../../components/admin/AdminTable';
import { AdminModal } from '../../components/admin/AdminModal';
import {
  ProductDraft,
  ProductForm,
  emptyProduct } from
'../../components/admin/ProductForm';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/ui/Button';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [draft, setDraft] = useState<ProductDraft | null>(null);
  const [isSaving, setSaving] = useState(false);

  async function refresh() {
    const [p, c] = await Promise.all([
    adminApi.getAdminProducts(),
    adminApi.getAdminCategories()]
    );
    setProducts(p);
    setCategories(c);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSave() {
    if (!draft) return;
    setSaving(true);
    await adminApi.saveProduct(draft);
    await refresh();
    setSaving(false);
    setDraft(null);
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`))
    return;
    await adminApi.deleteProduct(product.id);
    refresh();
  }

  const columns: Column<Product>[] = [
  {
    key: 'product',
    header: 'Product',
    render: (p) =>
    <div className="flex items-center gap-3">
          <img
        src={p.images[0]}
        alt=""
        className="h-11 w-9 rounded-sm object-cover" />
      
          <div>
            <p className="font-medium text-ink">{p.name}</p>
            <p className="text-xs text-cocoa/60">
              {p.brandLine} · {p.size}
            </p>
          </div>
        </div>

  },
  {
    key: 'categories',
    header: 'Categories',
    hideOnMobile: true,
    render: (p) =>
    <span className="text-xs text-cocoa/70">
          {p.categorySlugs.join(', ')}
        </span>

  },
  {
    key: 'price',
    header: 'Price',
    render: (p) => formatNaira(p.price)
  },
  {
    key: 'stock',
    header: 'Stock',
    render: (p) =>
    <span
      className={
      p.stock === 0 ?
      'text-[#b3261e]' :
      p.stock <= 8 ?
      'text-[#8A6512]' :
      'text-cocoa'
      }>
      
          {p.stock}
        </span>

  },
  {
    key: 'flags',
    header: 'Flags',
    hideOnMobile: true,
    render: (p) =>
    <div className="flex flex-wrap gap-1.5">
          {p.isNewArrival && <StatusBadge status="new" tone="info" />}
          {p.isBestSeller && <StatusBadge status="best seller" tone="gold" />}
          <StatusBadge
        status={p.isActive ? 'active' : 'inactive'}
        tone={p.isActive ? 'success' : 'neutral'} />
      
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    className: 'text-right',
    render: (p) =>
    <div className="flex justify-end gap-1">
          <button
        type="button"
        onClick={() => setDraft({ ...p })}
        aria-label={`Edit ${p.name}`}
        className="p-1.5 text-cocoa/60 hover:text-cocoa">
        
            <Pencil size={15} />
          </button>
          <button
        type="button"
        onClick={() => handleDelete(p)}
        aria-label={`Delete ${p.name}`}
        className="p-1.5 text-cocoa/60 hover:text-[#b3261e]">
        
            <Trash2 size={15} />
          </button>
        </div>

  }];


  return (
    <div>
      <AdminPageHeader
        title="Products"
        description={`${products.length} products in the catalogue.`}
        actions={
        <Button onClick={() => setDraft({ ...emptyProduct })}>
            <Plus size={15} /> Add product
          </Button>
        } />
      

      <AdminTable
        columns={columns}
        rows={products}
        rowKey={(p) => p.id}
        isLoading={isLoading}
        emptyMessage="No products yet — add your first bottle." />
      

      <AdminModal
        title={draft?.id ? 'Edit product' : 'New product'}
        isOpen={draft !== null}
        onClose={() => setDraft(null)}
        footer={
        <>
            <Button variant="ghost" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button type="submit" form="product-form" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save product'}
            </Button>
          </>
        }>
        
        {draft &&
        <ProductForm
          key={draft.id ?? 'new'}
          formId="product-form"
          draft={draft}
          categories={categories}
          onChange={setDraft}
          onSubmit={handleSave} />

        }
      </AdminModal>
    </div>);

}