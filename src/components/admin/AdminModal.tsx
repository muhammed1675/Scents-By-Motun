import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface AdminModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AdminModal({
  title,
  isOpen,
  onClose,
  children,
  footer
}: AdminModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-ink/45" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-lg bg-ivory shadow-soft sm:rounded-sm">
        
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-cocoa/10 bg-ivory px-6 py-4">
          <h2 className="font-heading text-xl text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-cocoa hover:text-gold">
            
            <X size={20} />
          </button>
        </header>
        <div className="px-6 py-6">{children}</div>
        {footer &&
        <footer className="sticky bottom-0 flex justify-end gap-2 border-t border-cocoa/10 bg-cream/70 px-6 py-4">
            {footer}
          </footer>
        }
      </div>
    </div>);

}