import React, { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { adminApi } from '../../services';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Loading';

/**
 * Role gate for the admin console.
 *
 * `checkAdminAccess()` checks the signed-in user's `profiles.role` in
 * Supabase — only accounts with role = 'admin' get past this gate.
 */
export function AdminGate({ children }: {children: React.ReactNode;}) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    adminApi.checkAdminAccess().then(setAllowed);
  }, []);

  if (allowed === null) {
    return (
      <div className="grid min-h-screen w-full place-items-center bg-ivory">
        <Spinner className="h-8 w-8" />
      </div>);

  }

  if (!allowed) {
    return (
      <div className="grid min-h-screen w-full place-items-center bg-ivory px-4">
        <div className="max-w-sm text-center">
          <ShieldAlert size={36} className="mx-auto text-cocoa/40" />
          <h1 className="mt-4 font-heading text-2xl text-ink">
            Admin access only
          </h1>
          <p className="mt-2 text-sm text-cocoa/70">
            Your account does not have permission to view the admin console.
          </p>
          <Button to="/" className="mt-6">
            Back to store
          </Button>
        </div>
      </div>);

  }

  return <>{children}</>;
}