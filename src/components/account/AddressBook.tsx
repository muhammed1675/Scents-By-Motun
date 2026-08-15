import React, { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Address } from '../../types';
import { nigerianStates } from '../../data/nigeria';
import { deleteAddress, saveAddress } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import { Checkbox, Field, SelectInput, TextInput } from '../ui/Field';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/Loading';

const blank: Omit<Address, 'id'> & {id?: string;} = {
  label: 'Home',
  street: '',
  city: '',
  state: 'Lagos',
  country: 'Nigeria',
  isDefault: false
};

export function AddressBook() {
  const { user, setUser } = useAuth();
  const [draft, setDraft] = useState<typeof blank | null>(null);
  const [isSaving, setSaving] = useState(false);

  const addresses = user?.addresses ?? [];

  function set<K extends keyof typeof blank>(key: K, value: (typeof blank)[K]) {
    setDraft((d) => d ? { ...d, [key]: value } : d);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!draft || !user) return;
    setSaving(true);
    const next = await saveAddress(draft);
    setUser({ ...user, addresses: next });
    setSaving(false);
    setDraft(null);
  }

  async function handleDelete(id: string) {
    if (!user) return;
    const next = await deleteAddress(id);
    setUser({ ...user, addresses: next });
  }

  return (
    <div>
      {addresses.length === 0 && !draft ?
      <EmptyState
        title="No saved addresses"
        description="Save an address to check out faster next time."
        action={
        <Button onClick={() => setDraft({ ...blank })}>
              <Plus size={15} /> Add address
            </Button>
        } /> :


      <>
          <ul className="grid gap-4 sm:grid-cols-2">
            {addresses.map((address) =>
          <li
            key={address.id}
            className="rounded-sm border border-cocoa/10 bg-white p-5">
            
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {address.label}
                      {address.isDefault &&
                  <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] uppercase tracking-widest text-[#7C6412]">
                          Default
                        </span>
                  }
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-cocoa/75">
                      {address.street}
                      <br />
                      {address.city}, {address.state}
                      <br />
                      {address.country}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                  type="button"
                  onClick={() => setDraft({ ...address })}
                  aria-label={`Edit ${address.label} address`}
                  className="p-1 text-cocoa/60 hover:text-cocoa">
                  
                      <Pencil size={15} />
                    </button>
                    <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  aria-label={`Delete ${address.label} address`}
                  className="p-1 text-cocoa/60 hover:text-[#b3261e]">
                  
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </li>
          )}
          </ul>
          {!draft &&
        <Button
          variant="outline"
          className="mt-5"
          onClick={() => setDraft({ ...blank })}>
          
              <Plus size={15} /> Add address
            </Button>
        }
        </>
      }

      {draft &&
      <form
        onSubmit={handleSave}
        className="mt-6 rounded-sm border border-cocoa/15 bg-cream/40 p-6">
        
          <h3 className="font-heading text-lg text-ink">
            {draft.id ? 'Edit address' : 'New address'}
          </h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Label" htmlFor="addr-label" required>
              <TextInput
              id="addr-label"
              required
              value={draft.label}
              onChange={(e) => set('label', e.target.value)} />
            
            </Field>
            <Field label="State" htmlFor="addr-state" required>
              <SelectInput
              id="addr-state"
              value={draft.state}
              onChange={(e) => set('state', e.target.value)}>
              
                {nigerianStates.map((s) =>
              <option key={s} value={s}>
                    {s}
                  </option>
              )}
              </SelectInput>
            </Field>
            <Field
            label="Street address"
            htmlFor="addr-street"
            required
            className="sm:col-span-2">
            
              <TextInput
              id="addr-street"
              required
              value={draft.street}
              onChange={(e) => set('street', e.target.value)} />
            
            </Field>
            <Field label="City" htmlFor="addr-city" required>
              <TextInput
              id="addr-city"
              required
              value={draft.city}
              onChange={(e) => set('city', e.target.value)} />
            
            </Field>
            <Field label="Country" htmlFor="addr-country" required>
              <TextInput
              id="addr-country"
              required
              value={draft.country}
              onChange={(e) => set('country', e.target.value)} />
            
            </Field>
          </div>
          <Checkbox
          className="mt-4"
          label="Make this my default address"
          checked={draft.isDefault}
          onChange={(e) => set('isDefault', e.target.checked)} />
        
          <div className="mt-6 flex gap-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save address'}
            </Button>
            <Button
            type="button"
            variant="ghost"
            onClick={() => setDraft(null)}>
            
              Cancel
            </Button>
          </div>
        </form>
      }
    </div>);

}