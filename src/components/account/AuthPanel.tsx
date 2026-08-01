import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Field, TextInput } from '../ui/Field';
import { Button } from '../ui/Button';
import { cn } from '../../utils/format';

type Mode = 'login' | 'signup';

export function AuthPanel() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isBusy, setBusy] = useState(false);

  function set(key: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const result =
    mode === 'login' ?
    await login(values.email, values.password) :
    await signup(values);
    setBusy(false);
    if (!result.ok) setError(result.message ?? 'Something went wrong.');
  }

  return (
    <div className="mx-auto max-w-md rounded-sm border border-cocoa/10 bg-white p-7">
      <div
        className="mb-6 grid grid-cols-2 rounded-sm bg-cream p-1"
        role="tablist"
        aria-label="Account access">
        
        {(['login', 'signup'] as Mode[]).map((m) =>
        <button
          key={m}
          role="tab"
          aria-selected={mode === m}
          type="button"
          onClick={() => {
            setMode(m);
            setError('');
          }}
          className={cn(
            'rounded-sm py-2 text-xs uppercase tracking-widest transition',
            mode === m ? 'bg-cocoa text-ivory' : 'text-cocoa'
          )}>
          
            {m === 'login' ? 'Sign in' : 'Create account'}
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {mode === 'signup' &&
        <>
            <Field label="Full name" htmlFor="auth-name" required>
              <TextInput
              id="auth-name"
              required
              value={values.fullName}
              autoComplete="name"
              onChange={(e) => set('fullName', e.target.value)} />
            
            </Field>
            <Field label="Phone" htmlFor="auth-phone" required>
              <TextInput
              id="auth-phone"
              type="tel"
              required
              value={values.phone}
              autoComplete="tel"
              placeholder="+234 800 000 0000"
              onChange={(e) => set('phone', e.target.value)} />
            
            </Field>
          </>
        }

        <Field label="Email" htmlFor="auth-email" required>
          <TextInput
            id="auth-email"
            type="email"
            required
            value={values.email}
            autoComplete="email"
            onChange={(e) => set('email', e.target.value)} />
          
        </Field>

        <Field
          label="Password"
          htmlFor="auth-password"
          required
          hint={mode === 'signup' ? 'At least 6 characters.' : undefined}
          error={error}>
          
          <TextInput
            id="auth-password"
            type="password"
            required
            value={values.password}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            onChange={(e) => set('password', e.target.value)} />
          
        </Field>

        <Button type="submit" fullWidth disabled={isBusy}>
          {isBusy ?
          'Please wait…' :
          mode === 'login' ?
          'Sign in' :
          'Create account'}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-cocoa/60">
        {mode === 'login' ?
        'Forgot your details? Contact us and we\u2019ll help you back in.' :
        'By creating an account you agree to our terms and privacy policy.'}
      </p>
    </div>);

}