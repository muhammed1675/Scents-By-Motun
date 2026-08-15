import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { Category } from '../../types';
import { getCategories } from '../../services';

export function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then((c) => setCategories(c.slice(0, 8)));
  }, []);

  return (
    <footer className="bg-ink text-ivory">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-heading text-xl">Scents by Motun</p>
          <p className="mt-3 text-sm leading-relaxed text-ivory/60">
            Nigerian-made and Nigerian-loved fragrance. Blended in Lagos,
            bottled in small batches, worn everywhere.
          </p>
          <div className="mt-5 flex gap-4 text-ivory/70">
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="hover:text-gold">
              
              <Instagram size={18} />
            </a>
            <a href="mailto:hello@scentsbymotun.ng" aria-label="Email us" className="hover:text-gold">
              <Mail size={18} />
            </a>
            <a href="tel:+2348030001122" aria-label="Call us" className="hover:text-gold">
              <Phone size={18} />
            </a>
          </div>
        </div>

        <nav aria-label="Shop">
          <h2 className="text-[11px] uppercase tracking-widest text-gold">
            Shop
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory/70">
            {categories.map((c) =>
            <li key={c.id}>
                <Link to={`/category/${c.slug}`} className="hover:text-gold">
                  {c.name}
                </Link>
              </li>
            )}
            <li>
              <Link to="/collections" className="hover:text-gold">
                All collections
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="text-[11px] uppercase tracking-widest text-gold">
            Company
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory/70">
            <li>
              <Link to="/about" className="hover:text-gold">
                Our story
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gold">
                Contact us
              </Link>
            </li>
            <li>
              <Link to="/custom-request" className="hover:text-gold">
                Custom request
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-gold">
                Track my order
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-gold">
                My account
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-gold">
                My bag
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-[11px] uppercase tracking-widest text-gold">
            Visit us
          </h2>
          <address className="mt-4 space-y-3 text-sm not-italic text-ivory/70">
            <p className="flex gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
              14b Admiralty Way, Lekki Phase 1, Lagos
            </p>
            <p className="flex gap-2">
              <Phone size={16} className="mt-0.5 shrink-0 text-gold" />
              +234 803 000 1122
            </p>
            <p className="flex gap-2">
              <Mail size={16} className="mt-0.5 shrink-0 text-gold" />
              hello@Scentsbymotun.ng
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-ivory/10 py-5">
        <p className="container text-center text-xs text-ivory/50">
          © {new Date().getFullYear()} Scents by Motun. All rights reserved.
          Prices in Nigerian Naira (₦).
        </p>
      </div>
    </footer>);

}
