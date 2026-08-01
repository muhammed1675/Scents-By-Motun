import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
}

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs = []
}: PageHeaderProps) {
  return (
    <div className="border-b border-cocoa/10 bg-cream/50">
      <div className="container py-8 sm:py-12">
        {crumbs.length > 0 &&
        <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-cocoa/60">
              <li>
                <Link to="/" className="hover:text-gold">
                  Home
                </Link>
              </li>
              {crumbs.map((crumb) =>
            <li key={crumb.label} className="flex items-center gap-1">
                  <ChevronRight size={12} />
                  {crumb.to ?
              <Link to={crumb.to} className="hover:text-gold">
                      {crumb.label}
                    </Link> :

              <span className="text-cocoa">{crumb.label}</span>
              }
                </li>
            )}
            </ol>
          </nav>
        }
        {eyebrow &&
        <p className="text-[11px] font-medium uppercase tracking-widest text-chestnut">
            {eyebrow}
          </p>
        }
        <h1 className="mt-1.5 font-heading text-3xl text-ink sm:text-4xl">
          {title}
        </h1>
        {description &&
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cocoa/70">
            {description}
          </p>
        }
      </div>
    </div>);

}