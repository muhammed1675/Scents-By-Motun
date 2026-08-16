import { Category, StoreLocation } from '../types';

const IMG = {
  amber: "/114886d9-688e-4210-83f9-bea62727678e.jpg",

  blush: "/e3a59ab0-5771-43a5-9155-550dc7a4670a.jpg",

  designer: "/faebb927-96b3-4242-b079-a3a54a804b67.jpg",

  mist: "/13d0cd31-7b4e-49b1-a1c2-aa624fa6ae1d.jpg",
  oil: "/dfba970f-1742-43ef-88a3-d1c0fe3ee083.jpg",
  giftset: "/faaaf0cd-fa17-45f6-bb91-31c63d521ce5.jpg",

  candle: "/e6f6428a-544d-4c3c-a210-cb5edf3c0030.jpg",

  diffuser: "/2c02ed84-d86e-4549-a2f7-685bd1395d33.jpg"

};

export const categories: Category[] = [
{
  id: 'cat-1',
  slug: 'for-her',
  name: 'For Her',
  description:
  'Soft florals, warm vanillas and powdery musks composed for the modern woman.',
  image: IMG.blush,
  isActive: true
},
{
  id: 'cat-2',
  slug: 'for-him',
  name: 'For Him',
  description: 'Woody, spiced and leather-led scents with quiet confidence.',
  image: IMG.amber,
  isActive: true
},
{
  id: 'cat-3',
  slug: 'unisex',
  name: 'Unisex',
  description: 'Shared signatures — amber, oud and clean citrus for everyone.',
  image: IMG.designer,
  isActive: true
},
{
  id: 'cat-4',
  slug: 'designer-perfume',
  name: 'Designer Perfume',
  description: 'Authentic designer houses, sourced and sealed.',
  image: IMG.designer,
  isActive: true
},
{
  id: 'cat-5',
  slug: 'body-mist',
  name: 'Body Mist',
  description: 'Light, refreshing veils of scent for everyday wear.',
  image: IMG.mist,
  isActive: true
},
{
  id: 'cat-6',
  slug: 'body-sprays',
  name: 'Body Sprays',
  description: 'All-day freshness with a generous, long-lasting spray.',
  image: IMG.mist,
  isActive: true
},
{
  id: 'cat-7',
  slug: 'perfume-oils',
  name: 'Perfume Oils',
  description: 'Concentrated, alcohol-free oils that bloom on the skin.',
  image: IMG.oil,
  isActive: true
},
{
  id: 'cat-8',
  slug: 'combo-deals',
  name: 'Combo Deals',
  description: 'Curated pairings at a kinder price.',
  image: IMG.giftset,
  isActive: true
},
{
  id: 'cat-9',
  slug: 'gift-sets',
  name: 'Gift Sets',
  description: 'Ready-to-give sets for birthdays, weddings and thank-yous.',
  image: IMG.giftset,
  isActive: true
},
{
  id: 'cat-10',
  slug: 'gift-boxes',
  name: 'Gift Boxes',
  description: 'Hand-packed boxes finished with ribbon and a note card.',
  image: IMG.giftset,
  isActive: true
},
{
  id: 'cat-11',
  slug: 'diffusers',
  name: 'Diffusers',
  description: 'Reed diffusers that hold a room in scent for months.',
  image: IMG.diffuser,
  isActive: true
},
{
  id: 'cat-12',
  slug: 'scented-candles',
  name: 'Scented Candles',
  description: 'Hand-poured soy candles with a warm, even throw.',
  image: IMG.candle,
  isActive: true
},
{
  id: 'cat-13',
  slug: 'miniatures',
  name: 'Miniatures',
  description: 'Travel-size bottles — try before you commit.',
  image: IMG.oil,
  isActive: true
},
{
  id: 'cat-14',
  slug: 'under-20k',
  name: 'Under ₦20k',
  description: 'Beautiful scent that stays within budget.',
  image: IMG.mist,
  isActive: true
}];


export const storeLocations: StoreLocation[] = [
{
  id: 'loc-1',
  name: 'Scent by Motun — Ibadan Studio',
  address: 'Ibadan, Oyo, Oyo State',
  city: 'Ibadan',
  hours: 'Mon – Sun, 10:00am – 9:00pm',
  phone: '+234 803 919 7889'
},
{
  id: 'loc-2',
  name: 'Scent by Motun — Lekki Flagship',
  address: 'Alimi Road Ilorin',
  city: 'Ilorin',
  hours: 'Mon – Sat, 9:00am – 8:00pm',
  phone: '+234 803 919 7889'
},
{
  id: 'loc-3',
  name: 'Scent by Motun — Ibadan Studio',
  address: 'Ibadan, Oyo, Oyo State',
  city: 'Ibadan',
  hours: 'Mon – Fri, 10:00am – 6:00pm',
  phone: '+234 803 919 7889'
}];