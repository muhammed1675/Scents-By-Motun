import { Product } from '../types';

const AMBER = "/114886d9-688e-4210-83f9-bea62727678e.jpg";

const BLUSH = "/e3a59ab0-5771-43a5-9155-550dc7a4670a.jpg";

const DESIGNER = "/faebb927-96b3-4242-b079-a3a54a804b67.jpg";

const MIST = "/13d0cd31-7b4e-49b1-a1c2-aa624fa6ae1d.jpg";

const OIL = "/dfba970f-1742-43ef-88a3-d1c0fe3ee083.jpg";

const GIFTSET = "/faaaf0cd-fa17-45f6-bb91-31c63d521ce5.jpg";

const CANDLE = "/e6f6428a-544d-4c3c-a210-cb5edf3c0030.jpg";

const DIFFUSER = "/2c02ed84-d86e-4549-a2f7-685bd1395d33.jpg";


export const products: Product[] = [
{
  id: 'p-01',
  slug: 'motun-noir-eau-de-parfum',
  name: 'Motun Noir',
  brandLine: 'Signature Collection',
  description:
  'Our house signature. A velvet trail of Nigerian oud, smoked vanilla and dark plum that settles into the skin and lingers long after you leave the room.',
  notes: {
    top: ['Black plum', 'Bergamot'],
    heart: ['Rose absolute', 'Saffron'],
    base: ['Oud', 'Smoked vanilla', 'Amber']
  },
  price: 78000,
  compareAtPrice: 92000,
  size: '100ml',
  images: [AMBER, DESIGNER, GIFTSET],
  categorySlugs: ['unisex', 'designer-perfume'],
  stock: 24,
  isNewArrival: false,
  isBestSeller: true,
  isActive: true,
  rating: 4.9,
  reviewCount: 214
},
{
  id: 'p-02',
  slug: 'ivory-bloom-eau-de-parfum',
  name: 'Ivory Bloom',
  brandLine: 'Signature Collection',
  description:
  'A soft, luminous floral built on Nigerian frangipani and white peony, finished with a powdery musk that feels like clean linen in the sun.',
  notes: {
    top: ['Pear nectar', 'Pink pepper'],
    heart: ['White peony', 'Frangipani'],
    base: ['Cashmere musk', 'Sandalwood']
  },
  price: 64000,
  size: '100ml',
  images: [BLUSH, AMBER, GIFTSET],
  categorySlugs: ['for-her'],
  stock: 18,
  isNewArrival: false,
  isBestSeller: true,
  isActive: true,
  rating: 4.8,
  reviewCount: 168
},
{
  id: 'p-03',
  slug: 'harmattan-gold',
  name: 'Harmattan Gold',
  brandLine: 'Signature Collection',
  description:
  'Dry, golden and warm — inspired by harmattan mornings in Lagos. Toasted almond and honeyed tobacco over a resinous amber base.',
  notes: {
    top: ['Toasted almond', 'Cardamom'],
    heart: ['Honeyed tobacco', 'Orris'],
    base: ['Benzoin', 'Amber', 'Cedar']
  },
  price: 71500,
  size: '75ml',
  images: [DESIGNER, AMBER],
  categorySlugs: ['unisex', 'for-him'],
  stock: 9,
  isNewArrival: true,
  isBestSeller: true,
  isActive: true,
  rating: 4.7,
  reviewCount: 91
},
{
  id: 'p-04',
  slug: 'oud-royale-pour-homme',
  name: 'Oud Royale Pour Homme',
  brandLine: 'Designer',
  description:
  'A commanding leather and oud composition for evening wear. Deep, dry and unmistakably masculine.',
  notes: {
    top: ['Grapefruit', 'Nutmeg'],
    heart: ['Leather', 'Clary sage'],
    base: ['Oud', 'Vetiver', 'Patchouli']
  },
  price: 96000,
  compareAtPrice: 110000,
  size: '100ml',
  images: [AMBER, DESIGNER],
  categorySlugs: ['for-him', 'designer-perfume'],
  stock: 6,
  isNewArrival: false,
  isBestSeller: true,
  isActive: true,
  rating: 4.6,
  reviewCount: 77
},
{
  id: 'p-05',
  slug: 'velvet-hibiscus',
  name: 'Velvet Hibiscus',
  brandLine: 'Signature Collection',
  description:
  'Juicy hibiscus and blackcurrant wrapped in creamy tonka. Playful in the first hour, sensual by the third.',
  notes: {
    top: ['Hibiscus', 'Blackcurrant'],
    heart: ['Jasmine sambac', 'Peach'],
    base: ['Tonka bean', 'Vanilla']
  },
  price: 58500,
  size: '50ml',
  images: [BLUSH, GIFTSET],
  categorySlugs: ['for-her'],
  stock: 31,
  isNewArrival: true,
  isBestSeller: false,
  isActive: true,
  rating: 4.8,
  reviewCount: 63
},
{
  id: 'p-06',
  slug: 'lagos-midnight',
  name: 'Lagos Midnight',
  brandLine: 'City Series',
  description:
  'The city after dark — salt air, spiced rum and warm skin musk. A bold unisex evening scent.',
  notes: {
    top: ['Sea salt', 'Mandarin'],
    heart: ['Spiced rum', 'Iris'],
    base: ['Skin musk', 'Labdanum']
  },
  price: 69000,
  size: '75ml',
  images: [DESIGNER, AMBER],
  categorySlugs: ['unisex'],
  stock: 0,
  isNewArrival: true,
  isBestSeller: false,
  isActive: true,
  rating: 4.5,
  reviewCount: 42
},
{
  id: 'p-07',
  slug: 'rose-de-motun-body-mist',
  name: 'Rose de Motun Body Mist',
  brandLine: 'Everyday',
  description:
  'A weightless rose and lychee mist to layer over lotion or refresh through the day.',
  notes: {
    top: ['Lychee', 'Bergamot'],
    heart: ['Damask rose'],
    base: ['White musk']
  },
  price: 14500,
  size: '250ml',
  images: [MIST, BLUSH],
  categorySlugs: ['body-mist', 'for-her', 'under-20k'],
  stock: 64,
  isNewArrival: false,
  isBestSeller: true,
  isActive: true,
  rating: 4.7,
  reviewCount: 289
},
{
  id: 'p-08',
  slug: 'vanilla-sun-body-mist',
  name: 'Vanilla Sun Body Mist',
  brandLine: 'Everyday',
  description:
  'Warm vanilla and coconut water — the easiest scent in your bag.',
  notes: {
    top: ['Coconut water'],
    heart: ['Vanilla orchid'],
    base: ['Soft amber']
  },
  price: 12500,
  size: '250ml',
  images: [MIST],
  categorySlugs: ['body-mist', 'under-20k'],
  stock: 48,
  isNewArrival: true,
  isBestSeller: false,
  isActive: true,
  rating: 4.6,
  reviewCount: 131
},
{
  id: 'p-09',
  slug: 'citrus-drift-body-spray',
  name: 'Citrus Drift Body Spray',
  brandLine: 'Everyday',
  description:
  'A crisp lime, mint and cedar spray built for Lagos heat. Generous, fast-drying and long-wearing.',
  notes: {
    top: ['Lime', 'Mint'],
    heart: ['Green apple'],
    base: ['Cedar']
  },
  price: 9500,
  size: '200ml',
  images: [MIST, DESIGNER],
  categorySlugs: ['body-sprays', 'under-20k', 'for-him'],
  stock: 87,
  isNewArrival: false,
  isBestSeller: false,
  isActive: true,
  rating: 4.4,
  reviewCount: 96
},
{
  id: 'p-10',
  slug: 'amber-musk-body-spray',
  name: 'Amber Musk Body Spray',
  brandLine: 'Everyday',
  description:
  'A soft amber and musk spray that layers beautifully under any of our parfums.',
  notes: {
    top: ['Pink pepper'],
    heart: ['Amber'],
    base: ['White musk', 'Vanilla']
  },
  price: 10500,
  size: '200ml',
  images: [MIST],
  categorySlugs: ['body-sprays', 'under-20k', 'unisex'],
  stock: 52,
  isNewArrival: false,
  isBestSeller: false,
  isActive: true,
  rating: 4.3,
  reviewCount: 58
},
{
  id: 'p-11',
  slug: 'attar-noir-perfume-oil',
  name: 'Attar Noir Perfume Oil',
  brandLine: 'Oil Collection',
  description:
  'Alcohol-free concentrated oil of oud, rose and sandalwood. One roll on the wrist lasts the whole day.',
  notes: {
    top: ['Saffron'],
    heart: ['Taif rose'],
    base: ['Oud', 'Sandalwood']
  },
  price: 22000,
  size: '12ml',
  images: [OIL, AMBER],
  categorySlugs: ['perfume-oils', 'unisex'],
  stock: 27,
  isNewArrival: false,
  isBestSeller: true,
  isActive: true,
  rating: 4.9,
  reviewCount: 143
},
{
  id: 'p-12',
  slug: 'shea-vanilla-perfume-oil',
  name: 'Shea & Vanilla Perfume Oil',
  brandLine: 'Oil Collection',
  description:
  'Nutty shea butter accord over Madagascan vanilla. Comforting, skin-close and gently sweet.',
  notes: {
    top: ['Almond milk'],
    heart: ['Shea accord'],
    base: ['Madagascan vanilla', 'Tonka']
  },
  price: 18000,
  size: '12ml',
  images: [OIL],
  categorySlugs: ['perfume-oils', 'for-her', 'under-20k'],
  stock: 40,
  isNewArrival: true,
  isBestSeller: false,
  isActive: true,
  rating: 4.7,
  reviewCount: 74
},
{
  id: 'p-13',
  slug: 'the-duo-combo',
  name: 'The Duo — Parfum + Body Mist',
  brandLine: 'Combo',
  description:
  'Pair any signature parfum with its matching body mist and save. Layering made simple.',
  notes: { top: ['Varies'], heart: ['Varies'], base: ['Varies'] },
  price: 74000,
  compareAtPrice: 92500,
  size: '100ml + 250ml',
  images: [GIFTSET, MIST],
  categorySlugs: ['combo-deals'],
  stock: 15,
  isNewArrival: false,
  isBestSeller: true,
  isActive: true,
  rating: 4.8,
  reviewCount: 88
},
{
  id: 'p-14',
  slug: 'his-hers-combo',
  name: 'His & Hers Combo',
  brandLine: 'Combo',
  description:
  'Motun Noir and Ivory Bloom together — our most gifted pairing for couples.',
  notes: { top: ['Varies'], heart: ['Varies'], base: ['Varies'] },
  price: 128000,
  compareAtPrice: 142000,
  size: '2 × 100ml',
  images: [GIFTSET, DESIGNER],
  categorySlugs: ['combo-deals', 'gift-sets'],
  stock: 11,
  isNewArrival: false,
  isBestSeller: false,
  isActive: true,
  rating: 4.9,
  reviewCount: 51
},
{
  id: 'p-15',
  slug: 'the-motun-discovery-set',
  name: 'The Motun Discovery Set',
  brandLine: 'Gifting',
  description:
  'Five 10ml miniatures of our best-loved scents in a keepsake box. The best way to find your signature.',
  notes: { top: ['Varies'], heart: ['Varies'], base: ['Varies'] },
  price: 34000,
  size: '5 × 10ml',
  images: [GIFTSET, OIL],
  categorySlugs: ['gift-sets', 'miniatures'],
  stock: 22,
  isNewArrival: true,
  isBestSeller: true,
  isActive: true,
  rating: 4.9,
  reviewCount: 197
},
{
  id: 'p-16',
  slug: 'celebration-gift-box',
  name: 'Celebration Gift Box',
  brandLine: 'Gifting',
  description:
  'A parfum, a candle and a hand-written note card, packed in our ribboned brown keepsake box.',
  notes: { top: ['Varies'], heart: ['Varies'], base: ['Varies'] },
  price: 89000,
  size: 'Box set',
  images: [GIFTSET, CANDLE],
  categorySlugs: ['gift-boxes', 'gift-sets'],
  stock: 8,
  isNewArrival: false,
  isBestSeller: false,
  isActive: true,
  rating: 4.8,
  reviewCount: 39
},
{
  id: 'p-17',
  slug: 'bridal-gift-box',
  name: 'Bridal Gift Box',
  brandLine: 'Gifting',
  description:
  'Curated for the bride — Ivory Bloom parfum, matching oil and a soy candle in ivory wrapping.',
  notes: { top: ['Varies'], heart: ['Varies'], base: ['Varies'] },
  price: 112000,
  size: 'Box set',
  images: [GIFTSET, BLUSH],
  categorySlugs: ['gift-boxes', 'for-her'],
  stock: 5,
  isNewArrival: true,
  isBestSeller: false,
  isActive: true,
  rating: 5,
  reviewCount: 24
},
{
  id: 'p-18',
  slug: 'amber-oud-reed-diffuser',
  name: 'Amber Oud Reed Diffuser',
  brandLine: 'Home',
  description:
  'Eight rattan reeds in smoked amber glass. Holds a living room in warm oud for up to four months.',
  notes: {
    top: ['Bergamot'],
    heart: ['Amber'],
    base: ['Oud', 'Cedarwood']
  },
  price: 27500,
  size: '200ml',
  images: [DIFFUSER, CANDLE],
  categorySlugs: ['diffusers'],
  stock: 19,
  isNewArrival: false,
  isBestSeller: false,
  isActive: true,
  rating: 4.6,
  reviewCount: 47
},
{
  id: 'p-19',
  slug: 'jasmine-tea-reed-diffuser',
  name: 'Jasmine Tea Reed Diffuser',
  brandLine: 'Home',
  description:
  'Green tea and jasmine — a lighter, brighter option for bedrooms and studies.',
  notes: {
    top: ['Green tea'],
    heart: ['Jasmine'],
    base: ['Soft musk']
  },
  price: 24000,
  size: '200ml',
  images: [DIFFUSER],
  categorySlugs: ['diffusers'],
  stock: 0,
  isNewArrival: false,
  isBestSeller: false,
  isActive: true,
  rating: 4.4,
  reviewCount: 21
},
{
  id: 'p-20',
  slug: 'brown-sugar-oud-candle',
  name: 'Brown Sugar & Oud Candle',
  brandLine: 'Home',
  description:
  'Hand-poured soy wax with a cotton wick. Burns clean for 45 hours with a deep, even throw.',
  notes: {
    top: ['Brown sugar'],
    heart: ['Clove'],
    base: ['Oud', 'Vanilla']
  },
  price: 19500,
  size: '220g',
  images: [CANDLE, DIFFUSER],
  categorySlugs: ['scented-candles', 'under-20k'],
  stock: 36,
  isNewArrival: false,
  isBestSeller: true,
  isActive: true,
  rating: 4.8,
  reviewCount: 156
},
{
  id: 'p-21',
  slug: 'coconut-shea-candle',
  name: 'Coconut & Shea Candle',
  brandLine: 'Home',
  description:
  'Creamy coconut over toasted shea. A softer, sweeter candle for open living spaces.',
  notes: {
    top: ['Coconut'],
    heart: ['Shea accord'],
    base: ['Sandalwood']
  },
  price: 17500,
  size: '220g',
  images: [CANDLE],
  categorySlugs: ['scented-candles', 'under-20k'],
  stock: 29,
  isNewArrival: true,
  isBestSeller: false,
  isActive: true,
  rating: 4.5,
  reviewCount: 68
},
{
  id: 'p-22',
  slug: 'motun-noir-miniature',
  name: 'Motun Noir Miniature',
  brandLine: 'Miniatures',
  description:
  'The full Motun Noir experience in a 10ml purse spray. Refillable and travel-safe.',
  notes: {
    top: ['Black plum'],
    heart: ['Rose absolute'],
    base: ['Oud', 'Smoked vanilla']
  },
  price: 15000,
  size: '10ml',
  images: [OIL, AMBER],
  categorySlugs: ['miniatures', 'under-20k', 'unisex'],
  stock: 73,
  isNewArrival: false,
  isBestSeller: true,
  isActive: true,
  rating: 4.9,
  reviewCount: 204
},
{
  id: 'p-23',
  slug: 'ivory-bloom-miniature',
  name: 'Ivory Bloom Miniature',
  brandLine: 'Miniatures',
  description: 'Our bestselling floral, sized for a handbag.',
  notes: {
    top: ['Pear nectar'],
    heart: ['White peony'],
    base: ['Cashmere musk']
  },
  price: 13500,
  size: '10ml',
  images: [OIL, BLUSH],
  categorySlugs: ['miniatures', 'under-20k', 'for-her'],
  stock: 58,
  isNewArrival: false,
  isBestSeller: false,
  isActive: true,
  rating: 4.7,
  reviewCount: 112
},
{
  id: 'p-24',
  slug: 'blanc-de-luxe-designer',
  name: 'Blanc de Luxe',
  brandLine: 'Designer',
  description:
  'A crisp designer classic — aldehydic citrus over iris and blonde woods. Sealed and authenticity-checked.',
  notes: {
    top: ['Aldehydes', 'Lemon'],
    heart: ['Iris', 'Neroli'],
    base: ['Blonde woods', 'Musk']
  },
  price: 145000,
  compareAtPrice: 168000,
  size: '100ml',
  images: [DESIGNER, AMBER],
  categorySlugs: ['designer-perfume', 'for-her'],
  stock: 4,
  isNewArrival: true,
  isBestSeller: false,
  isActive: true,
  rating: 4.8,
  reviewCount: 33
},
{
  id: 'p-25',
  slug: 'terre-boisee-designer',
  name: 'Terre Boisée',
  brandLine: 'Designer',
  description:
  'Earthy vetiver and dry grapefruit — a refined designer daily driver for him.',
  notes: {
    top: ['Grapefruit'],
    heart: ['Vetiver', 'Geranium'],
    base: ['Cedar', 'Benzoin']
  },
  price: 132000,
  size: '100ml',
  images: [DESIGNER],
  categorySlugs: ['designer-perfume', 'for-him'],
  stock: 7,
  isNewArrival: false,
  isBestSeller: false,
  isActive: true,
  rating: 4.6,
  reviewCount: 45
},
{
  id: 'p-26',
  slug: 'archive-fig-parfum',
  name: 'Archive Fig',
  brandLine: 'Archive',
  description:
  'A discontinued favourite kept in the archive — green fig, coconut milk and warm stone.',
  notes: {
    top: ['Fig leaf'],
    heart: ['Coconut milk'],
    base: ['Warm stone', 'Cedar']
  },
  price: 61000,
  size: '75ml',
  images: [AMBER],
  categorySlugs: ['unisex'],
  stock: 3,
  isNewArrival: false,
  isBestSeller: false,
  isActive: false,
  rating: 4.5,
  reviewCount: 18
}];