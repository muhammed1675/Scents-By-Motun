import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  ArrowLeft,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquareQuote,
  Package,
  PackageSearch,
  ShoppingCart,
  Tags,
  Ticket,
  X } from
'lucide-react';
import { cn } from '../../utils/format';

const nav = [
{ to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
{ to: '/admin/products', label: 'Products', icon: Package },
{ to: '/admin/categories', label: 'Categories', icon: Tags },
{ to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
{ to: '/admin/custom-requests', label: 'Custom requests', icon: PackageSearch },
{ to: '/admin/coupons', label: 'Coupons', icon: Ticket },
{ to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
{ to: '/admin/messages', label: 'Messages', icon: Mail }];


export function AdminLayout() {
  const [isOpen, setOpen] = useState(false);

  const sidebar =
  <div className="flex h-full flex-col">
      <div className="px-6 py-6">
        <p className="font-heading text-lg text-ivory">Scent by Motun</p>
        <p className="mt-0.5 text-[10px] uppercase tracking-widest text-gold">
          Admin console
        </p>
      </div>
      <nav aria-label="Admin" className="flex-1 space-y-1 px-3">
        {nav.map(({ to, label, icon: Icon, end }) =>
      <NavLink
        key={to}
        to={to}
        end={end}
        onClick={() => setOpen(false)}
        className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors',
          isActive ?
          'bg-ivory/10 text-gold' :
          'text-ivory/70 hover:bg-ivory/5 hover:text-ivory'
        )
        }>
        
            <Icon size={17} />
            {label}
          </NavLink>
      )}
      </nav>
      <div className="border-t border-ivory/10 px-3 py-4">
        <Link
        to="/"
        className="flex items-center gap-2 rounded-sm px-3 py-2 text-xs uppercase tracking-widest text-ivory/60 hover:text-gold">
        
          <ArrowLeft size={14} />
          Back to store
        </Link>
      </div>
    </div>;


  return (
    <div className="flex min-h-screen w-full bg-ivory">
      <aside className="hidden w-64 shrink-0 bg-ink lg:block">{sidebar}</aside>

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}>
        
        <div
          onClick={() => setOpen(false)}
          className={cn(
            'absolute inset-0 bg-ink/50 transition-opacity',
            isOpen ? 'opacity-100' : 'opacity-0'
          )} />
        
        <div
          className={cn(
            'absolute left-0 top-0 h-full w-64 bg-ink transition-transform duration-300',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}>
          
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close admin menu"
            className="absolute right-3 top-5 text-ivory/70">
            
            <X size={20} />
          </button>
          {sidebar}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-cocoa/10 bg-white px-4 py-3.5 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open admin menu"
            className="text-cocoa">
            
            <Menu size={20} />
          </button>
          <span className="font-heading text-lg text-ink">Admin</span>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-10">
          <Outlet />
        </main>
      </div>
    </div>);

}