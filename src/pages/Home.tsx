import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Phone, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import { Category, Product, StoreLocation, Testimonial } from '../types';
import {
  getApprovedTestimonials,
  getBestSellers,
  getCategories,
  getNewArrivals,
  getStoreLocations } from
'../services';
import { CategoryTile } from '../components/CategoryTile';
import { ProductRow } from '../components/ProductRow';
import { SectionHeader } from '../components/SectionHeader';
import { TestimonialsCarousel } from '../components/TestimonialsCarousel';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { Button } from '../components/ui/Button';

const HERO = "/3e5dd8ab-496c-4fdd-8c9c-d40a1d8b0071.jpg";

const STORY = "/5f02c4d8-2d05-4ddf-9d67-ad69c683aa03.jpg";


const promises = [
{
  icon: Sparkles,
  title: 'Blended in Ibadan',
  text: 'Small-batch compositions made with imported and locally sourced oils.'
},
{
  icon: ShieldCheck,
  title: '100% authentic',
  text: 'Every designer bottle is sealed, checked and guaranteed genuine.'
},
{
  icon: Truck,
  title: 'Nationwide delivery',
  text: '1–2 days within Ibadan, 2–4 days to every other state.'
}];


export function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [locations, setLocations] = useState<StoreLocation[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
    getCategories(),
    getBestSellers(4),
    getNewArrivals(4),
    getApprovedTestimonials(),
    getStoreLocations()]
    ).
    then(([c, b, n, t, l]) => {
      setCategories(c);
      setBestSellers(b);
      setNewArrivals(n);
      setTestimonials(t);
      setLocations(l);
    }).
    finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full bg-ivory">
      {/* Hero */}
      <section className="relative">
        <img
          src={HERO}
          alt="An amber glass perfume bottle resting on an ivory plinth with silk and dried petals"
          className="h-[78vh] max-h-[680px] w-full object-cover sm:h-[70vh]" />
        
        <div className="absolute inset-0 bg-ink/35" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="max-w-xl text-ivory">
              <p className="text-[11px] uppercase tracking-widest text-gold">
                New — Harmattan Gold
              </p>
              <h1 className="mt-3 font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Scent that stays with you
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/85 sm:text-base">
                Warm, long-wearing fragrance blended in Ibadan for the woman who
                is remembered before she is seen.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/shop" variant="gold" size="lg">
                  Shop the collection
                </Button>
                <Button
                  to="/product/harmattan-gold"
                  size="lg"
                  className="border border-ivory/50 bg-transparent text-ivory hover:bg-ivory hover:text-ink">
                  
                  Discover Harmattan Gold
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="border-b border-cocoa/10 bg-cream" aria-label="Why shop with us">
        <ul className="container grid gap-6 py-8 sm:grid-cols-3">
          {promises.map(({ icon: Icon, title, text }) =>
          <li key={title} className="flex gap-3">
              <Icon size={20} className="mt-0.5 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-medium text-cocoa">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-cocoa/65">
                  {text}
                </p>
              </div>
            </li>
          )}
        </ul>
      </section>

      {/* Categories */}
      <section className="container py-14 sm:py-20">
        <SectionHeader
          eyebrow="Shop by category"
          title="Find your kind of beautiful"
          description="From everyday body mists to sealed designer bottles and hand-poured candles."
          linkTo="/collections"
          linkLabel="All collections" />
        
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.slice(0, 10).map((c) =>
          <CategoryTile key={c.id} category={c} />
          )}
        </div>
      </section>

      {/* Best sellers */}
      <section className="container pb-14 sm:pb-20">
        <SectionHeader
          eyebrow="Loved most"
          title="Best sellers"
          linkTo="/shop?sort=featured" />
        
        <ProductRow products={bestSellers} isLoading={isLoading} />
      </section>

      {/* Brand story teaser */}
      <section className="bg-cream">
        <div className="container grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
          <img
            src={STORY}
            alt="Motun blending fragrance oils at a wooden atelier table"
            className="aspect-[4/3] w-full rounded-sm object-cover" />
          
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-chestnut">
              Our story
            </p>
            <h2 className="mt-2 font-heading text-3xl text-ink sm:text-4xl">
              Started at a kitchen table in Surulere
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-cocoa/75">
              Motun began blending oils for friends in 2019, chasing scents that
              could hold up to Ibadan heat without fading by noon. Six years and
              thousands of bottles later, Scents by Motun is a house built on the
              same belief: fragrance should feel personal, last all day, and
              never cost a fortune.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-cocoa/75">
              Every blend is still approved by Motun herself before it reaches a
              bottle.
            </p>
            <Button to="/about" variant="outline" className="mt-7">
              Read our story
            </Button>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="container py-14 sm:py-20">
        <SectionHeader
          eyebrow="Just landed"
          title="New arrivals"
          linkTo="/shop?sort=newest" />
        
        <ProductRow products={newArrivals} isLoading={isLoading} />
      </section>

      {/* Testimonials */}
      <section className="bg-cream py-14 sm:py-20">
        <div className="container">
          <SectionHeader
            eyebrow="From our customers"
            title="Worn and reviewed across Nigeria"
            align="center" />
          
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Store locations */}
      <section className="container py-14 sm:py-20">
        <SectionHeader
          eyebrow="Come smell in person"
          title="Our stores"
          description="Sample the full range, get a consultation and take your bottle home the same day." />
        
        <ul className="grid gap-4 sm:grid-cols-3">
          {locations.map((loc) =>
          <li
            key={loc.id}
            className="rounded-sm border border-cocoa/10 bg-white p-6">
            
              <h3 className="font-heading text-lg text-ink">{loc.name}</h3>
              <div className="mt-4 space-y-2.5 text-sm text-cocoa/75">
                <p className="flex gap-2">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                  {loc.address}, {loc.city}
                </p>
                <p className="flex gap-2">
                  <Clock size={16} className="mt-0.5 shrink-0 text-gold" />
                  {loc.hours}
                </p>
                <p className="flex gap-2">
                  <Phone size={16} className="mt-0.5 shrink-0 text-gold" />
                  <a href={`tel:${loc.phone.replace(/\s/g, '')}`} className="hover:text-gold">
                    {loc.phone}
                  </a>
                </p>
              </div>
            </li>
          )}
        </ul>
        <p className="mt-6 text-sm text-cocoa/70">
          Not near a store?{' '}
          <Link to="/contact" className="text-cocoa underline hover:text-gold">
            Message us
          </Link>{' '}
          and we will deliver anywhere in Nigeria.
        </p>
      </section>

      <NewsletterSignup />
    </div>);

}