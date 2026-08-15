import React from 'react';
import { Leaf, Heart, Users, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { Button } from '../components/ui/Button';

const STORY = "/5f02c4d8-2d05-4ddf-9d67-ad69c683aa03.jpg";

const HERO = "/3e5dd8ab-496c-4fdd-8c9c-d40a1d8b0071.jpg";


const values = [
{
  icon: Leaf,
  title: 'Blended for our climate',
  text: 'Every formula is tested through a full Lagos afternoon before it is approved. If it fades, it goes back to the bench.'
},
{
  icon: Heart,
  title: 'Made in small batches',
  text: 'We pour in batches of two hundred so each bottle is fresh and each blend can still be adjusted by hand.'
},
{
  icon: Users,
  title: 'Priced for real people',
  text: 'Luxury should not require a foreign account. We keep margins honest and skip the middlemen.'
},
{
  icon: Sparkles,
  title: 'Never a fake bottle',
  text: 'Designer stock is sourced directly and authenticity-checked twice before it reaches a shelf.'
}];


const milestones = [
{
  year: '2019',
  text: 'Motun begins blending oils at her kitchen table in Surulere for friends and family.'
},
{
  year: '2021',
  text: 'The first signature parfum, Motun Noir, sells out in eleven days on Instagram.'
},
{
  year: '2023',
  text: 'The Lekki flagship opens, with a sampling bar and made-to-order gift boxes.'
},
{
  year: '2025',
  text: 'Abuja studio launches and nationwide delivery reaches all 36 states.'
},
{
  year: '2026',
  text: 'Over 40,000 bottles worn across Nigeria — and counting.'
}];


export function About() {
  return (
    <div className="w-full bg-ivory">
      <PageHeader
        eyebrow="Our story"
        title="Scent, made in Nigeria, for Nigerians"
        description="Scent by Motun is a Lagos fragrance house built on one stubborn idea — that a Nigerian woman should not have to import her signature scent."
        crumbs={[{ label: 'About' }]} />
      

      <section className="container grid items-center gap-10 py-14 lg:grid-cols-2">
        <img
          src={STORY}
          alt="Motun blending fragrance oils at her atelier table"
          className="aspect-[4/3] w-full rounded-sm object-cover" />
        
        <div>
          <h2 className="font-heading text-3xl text-ink">
            It started with a complaint
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-cocoa/80">
            <p>
              In 2019, Motunrayo Adeyinka was spending more on shipping perfume
              into Lagos than on the perfume itself — and watching it fade by
              lunchtime anyway. So she started blending her own, sourcing oud
              and amber through the same traders her grandmother used and
              testing every batch on herself in the heat of the day.
            </p>
            <p>
              Friends started asking. Then friends of friends. The first
              hundred bottles sold out of a tote bag at a Saturday market in
              Yaba. Six years later Scent by Motun runs three locations, ships
              to all 36 states, and still refuses to release a blend that has
              not survived a full Lagos afternoon.
            </p>
            <p>
              We remain a small team, family-run, and deeply particular about
              what goes into a bottle.
            </p>
          </div>
          <Button to="/shop" className="mt-7">
            Shop the collection
          </Button>
        </div>
      </section>

      <section className="bg-cream py-14" aria-labelledby="values-heading">
        <div className="container">
          <h2
            id="values-heading"
            className="text-center font-heading text-3xl text-ink">
            
            What we hold to
          </h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }) =>
            <li
              key={title}
              className="rounded-sm border border-cocoa/10 bg-white p-6">
              
                <Icon size={22} className="text-gold" />
                <h3 className="mt-4 font-heading text-lg text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cocoa/70">
                  {text}
                </p>
              </li>
            )}
          </ul>
        </div>
      </section>

      <section className="container py-14" aria-labelledby="timeline-heading">
        <h2
          id="timeline-heading"
          className="font-heading text-3xl text-ink">
          
          The road so far
        </h2>
        <ol className="mt-8 border-l border-cocoa/15">
          {milestones.map((m) =>
          <li key={m.year} className="relative pb-8 pl-7 last:pb-0">
              <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-gold" />
              <p className="font-heading text-xl text-cocoa">{m.year}</p>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-cocoa/75">
                {m.text}
              </p>
            </li>
          )}
        </ol>
      </section>

      <section className="relative">
        <img
          src={HERO}
          alt=""
          className="h-64 w-full object-cover sm:h-80" />
        
        <div className="absolute inset-0 bg-ink/50" />
        <div className="absolute inset-0 grid place-items-center px-4 text-center">
          <div className="max-w-xl text-ivory">
            <h2 className="font-heading text-3xl sm:text-4xl">
              Come find your signature
            </h2>
            <p className="mt-3 text-sm text-ivory/80">
              Visit the Lekki sampling bar, or let us send three miniatures your
              way.
            </p>
            <Button to="/product/the-motun-discovery-set" variant="gold" className="mt-6">
              Try the Discovery Set
            </Button>
          </div>
        </div>
      </section>

      <NewsletterSignup />
    </div>);

}