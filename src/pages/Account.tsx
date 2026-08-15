import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PageHeader } from '../components/PageHeader';
import { AuthPanel } from '../components/account/AuthPanel';
import { OrderHistory } from '../components/account/OrderHistory';
import { AddressBook } from '../components/account/AddressBook';
import { WishlistPanel } from '../components/account/WishlistPanel';
import { ProfileForm } from '../components/account/ProfileForm';
import { Spinner } from '../components/ui/Loading';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/format';

const tabs = [
{ id: 'orders', label: 'Order history' },
{ id: 'wishlist', label: 'Wishlist' },
{ id: 'addresses', label: 'Addresses' },
{ id: 'profile', label: 'Profile' }] as
const;

type TabId = (typeof tabs)[number]['id'];

export function Account() {
  const { user, isLoading, isAdmin } = useAuth();
  const [params, setParams] = useSearchParams();
  const active = params.get('tab') as TabId ?? 'orders';

  if (isLoading) {
    return (
      <div className="grid place-items-center py-32">
        <Spinner className="h-8 w-8" />
      </div>);

  }

  if (!user) {
    return (
      <div className="w-full bg-ivory">
        <PageHeader
          eyebrow="Account"
          title="Sign in to Scent by Motun"
          description="Track orders, save addresses and keep your wishlist in one place."
          crumbs={[{ label: 'Account' }]} />
        
        <div className="container py-12">
          <AuthPanel />
        </div>
      </div>);

  }

  return (
    <div className="w-full bg-ivory">
      <PageHeader
        eyebrow="My account"
        title={`Hello, ${user.fullName.split(' ')[0]}`}
        description={user.email}
        crumbs={[{ label: 'Account' }]} />
      

      <div className="container py-10">
        {isAdmin &&
        <div className="mb-8 flex items-center justify-between gap-4 rounded-sm border border-gold/30 bg-gold/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <Shield size={20} className="shrink-0 text-gold" />
              <p className="text-sm text-ink">
                Your account has admin access to Scents by Motun.
              </p>
            </div>
            <Button to="/admin" variant="gold" size="sm">
              Go to admin dashboard
            </Button>
          </div>
        }

        <div className="no-scrollbar -mx-4 mb-8 flex gap-1 overflow-x-auto border-b border-cocoa/10 px-4">
          {tabs.map((tab) =>
          <button
            key={tab.id}
            type="button"
            onClick={() => setParams({ tab: tab.id })}
            aria-current={active === tab.id ? 'page' : undefined}
            className={cn(
              'whitespace-nowrap border-b-2 px-4 py-3 text-xs uppercase tracking-widest transition',
              active === tab.id ?
              'border-cocoa text-cocoa' :
              'border-transparent text-cocoa/55 hover:text-cocoa'
            )}>
            
              {tab.label}
            </button>
          )}
        </div>

        {active === 'orders' && <OrderHistory />}
        {active === 'wishlist' && <WishlistPanel />}
        {active === 'addresses' && <AddressBook />}
        {active === 'profile' && <ProfileForm />}
      </div>
    </div>);

}