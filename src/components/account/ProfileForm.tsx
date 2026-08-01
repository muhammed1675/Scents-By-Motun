import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Field, TextInput } from '../ui/Field';
import { Button } from '../ui/Button';

export function ProfileForm() {
  const { user, updateProfile, logout } = useAuth();
  const [values, setValues] = useState({
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? ''
  });
  const [isSaving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set(key: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await updateProfile(values);
    setSaving(false);
    setSaved(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg rounded-sm border border-cocoa/10 bg-white p-6">
      
      <h2 className="font-heading text-lg text-ink">Profile details</h2>
      <div className="mt-5 space-y-5">
        <Field label="Full name" htmlFor="profile-name" required>
          <TextInput
            id="profile-name"
            required
            value={values.fullName}
            onChange={(e) => set('fullName', e.target.value)} />
          
        </Field>
        <Field label="Email" htmlFor="profile-email" required>
          <TextInput
            id="profile-email"
            type="email"
            required
            value={values.email}
            onChange={(e) => set('email', e.target.value)} />
          
        </Field>
        <Field label="Phone" htmlFor="profile-phone" required>
          <TextInput
            id="profile-phone"
            type="tel"
            required
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)} />
          
        </Field>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
        <Button type="button" variant="ghost" onClick={logout}>
          Sign out
        </Button>
        {saved &&
        <span
          role="status"
          className="inline-flex items-center gap-1.5 text-xs text-[#2F5D3A]">
          
            <Check size={14} /> Profile updated
          </span>
        }
      </div>
    </form>);

}