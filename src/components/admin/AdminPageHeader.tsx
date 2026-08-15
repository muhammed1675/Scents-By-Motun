import React from 'react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  actions
}: AdminPageHeaderProps) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl text-ink sm:text-3xl">{title}</h1>
        {description &&
        <p className="mt-1.5 text-sm text-cocoa/70">{description}</p>
        }
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>);

}