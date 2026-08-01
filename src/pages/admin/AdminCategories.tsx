import React, { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Category } from '../../types';
import { adminApi } from '../../services';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminTable, Column } from '../../components/admin/AdminTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Checkbox, Field, TextArea, TextInput } from '../../components/ui/Field';

type CategoryDraft = Omit<Category, 'id' | 'slug'> & {
  id?: string;
  slug?: string;
};

const emptyCategory: CategoryDraft = {
  name: '',
  description: '',
  image: '',
  isActive: true
};

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [draft, setDraft] = useState<CategoryDraft | null>(null);
  const [isSaving, setSaving] = useState(false);

  async function refresh() {
    setCategories(await adminApi.getAdminCategories());
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    await adminApi.saveCategory(draft);
    await refresh();
    setSaving(false);
    setDraft(null);
  }

  async function handleDelete(category: Category) {
    if (!window.confirm(`Delete the “${category.name}” collection?`)) return;
    await adminApi.deleteCategory(category.id);
    refresh();
  }

  function set<K extends keyof CategoryDraft>(
  key: K,
  value: CategoryDraft[K])
  {
    setDraft((d) => d ? { ...d, [key]: value } : d);
  }

  const columns: Column<Category>[] = [
  {
    key: 'name',
    header: 'Collection',
    render: (c) =>
    <div className="flex items-center gap-3">
          {c.image &&
      <img
        src={c.image}
        alt=""
        className="h-10 w-10 rounded-sm object-cover" />

      }
          <div>
            <p className="font-medium text-ink">{c.name}</p>
            <p className="text-xs text-cocoa/60">/{c.slug}</p>
          </div>
        </div>

  },
  {
    key: 'description',
    header: 'Description',
    hideOnMobile: true,
    render: (c) =>
    <span className="line-clamp-2 max-w-md text-xs text-cocoa/70">
          {c.description}
        </span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (c) =>
    <StatusBadge
      status={c.isActive ? 'active' : 'hidden'}
      tone={c.isActive ? 'success' : 'neutral'} />


  },
  {
    key: 'actions',
    header: 'Actions',
    className: 'text-right',
    render: (c) =>
    <div className="flex justify-end gap-1">
          <button
        type="button"
        onClick={() => setDraft({ ...c })}
        aria-label={`Edit ${c.name}`}
        className="p-1.5 text-cocoa/60 hover:text-cocoa">
        
            <Pencil size={15} />
          </button>
          <button
        type="button"
        onClick={() => handleDelete(c)}
        aria-label={`Delete ${c.name}`}
        className="p-1.5 text-cocoa/60 hover:text-[#b3261e]">
        
            <Trash2 size={15} />
          </button>
        </div>

  }];


  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description={`${categories.length} collections shown on the storefront.`}
        actions={
        <Button onClick={() => setDraft({ ...emptyCategory })}>
            <Plus size={15} /> Add category
          </Button>
        } />
      

      <AdminTable
        columns={columns}
        rows={categories}
        rowKey={(c) => c.id}
        isLoading={isLoading} />
      

      <AdminModal
        title={draft?.id ? 'Edit category' : 'New category'}
        isOpen={draft !== null}
        onClose={() => setDraft(null)}
        footer={
        <>
            <Button variant="ghost" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button type="submit" form="category-form" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save category'}
            </Button>
          </>
        }>
        
        {draft &&
        <form id="category-form" onSubmit={handleSave} className="space-y-5">
            <Field label="Name" htmlFor="c-name" required>
              <TextInput
              id="c-name"
              required
              value={draft.name}
              onChange={(e) => set('name', e.target.value)} />
            
            </Field>
            <Field label="Description" htmlFor="c-description">
              <TextArea
              id="c-description"
              rows={3}
              value={draft.description}
              onChange={(e) => set('description', e.target.value)} />
            
            </Field>
            <Field
            label="Tile image URL"
            htmlFor="c-image"
            hint="Square images work best.">
            
              <TextInput
              id="c-image"
              value={draft.image}
              onChange={(e) => set('image', e.target.value)} />
            
            </Field>
            <Checkbox
            label="Visible on the storefront"
            checked={draft.isActive}
            onChange={(e) => set('isActive', e.target.checked)} />
          
          </form>
        }
      </AdminModal>
    </div>);

}