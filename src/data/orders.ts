import { Order } from '../types';

const AMBER = "/114886d9-688e-4210-83f9-bea62727678e.jpg";

const BLUSH = "/e3a59ab0-5771-43a5-9155-550dc7a4670a.jpg";

const MIST = "/13d0cd31-7b4e-49b1-a1c2-aa624fa6ae1d.jpg";

const GIFTSET = "/faaaf0cd-fa17-45f6-bb91-31c63d521ce5.jpg";

const CANDLE = "/e6f6428a-544d-4c3c-a210-cb5edf3c0030.jpg";


export const orders: Order[] = [
{
  id: 'o-1',
  reference: 'SBM-10431',
  customer: {
    fullName: 'Adaeze Okonkwo',
    email: 'adaeze.o@example.com',
    phone: '+234 803 221 4410'
  },
  shipping: {
    street: '12 Fola Osibo Street',
    city: 'Lekki Phase 1',
    state: 'Lagos',
    country: 'Nigeria'
  },
  items: [
  {
    productId: 'p-01',
    name: 'Motun Noir',
    image: AMBER,
    price: 78000,
    quantity: 1
  },
  {
    productId: 'p-07',
    name: 'Rose de Motun Body Mist',
    image: MIST,
    price: 14500,
    quantity: 2
  }],

  subtotal: 107000,
  discount: 10700,
  shippingFee: 3500,
  total: 99800,
  status: 'processing',
  paymentMethod: 'online',
  createdAt: '2026-07-31T09:24:00.000Z'
},
{
  id: 'o-2',
  reference: 'SBM-10430',
  customer: {
    fullName: 'Tunde Ajayi',
    email: 'tunde.ajayi@example.com',
    phone: '+234 805 990 1123'
  },
  shipping: {
    street: '9 Opebi Road',
    city: 'Ikeja',
    state: 'Lagos',
    country: 'Nigeria',
    notes: 'Call on arrival, gate is blue.'
  },
  items: [
  {
    productId: 'p-14',
    name: 'His & Hers Combo',
    image: GIFTSET,
    price: 128000,
    quantity: 1
  }],

  subtotal: 128000,
  discount: 0,
  shippingFee: 3500,
  total: 131500,
  status: 'shipped',
  paymentMethod: 'whatsapp',
  createdAt: '2026-07-30T16:02:00.000Z'
},
{
  id: 'o-3',
  reference: 'SBM-10429',
  customer: {
    fullName: 'Fatima Bello',
    email: 'fatima.bello@example.com',
    phone: '+234 807 442 8890'
  },
  shipping: {
    street: '7 Gana Street',
    city: 'Maitama',
    state: 'Abuja (FCT)',
    country: 'Nigeria'
  },
  items: [
  {
    productId: 'p-15',
    name: 'The Motun Discovery Set',
    image: GIFTSET,
    price: 34000,
    quantity: 1
  },
  {
    productId: 'p-20',
    name: 'Brown Sugar & Oud Candle',
    image: CANDLE,
    price: 19500,
    quantity: 1
  }],

  subtotal: 53500,
  discount: 5000,
  shippingFee: 5000,
  total: 53500,
  status: 'delivered',
  paymentMethod: 'online',
  createdAt: '2026-07-24T11:45:00.000Z'
},
{
  id: 'o-4',
  reference: 'SBM-10428',
  customer: {
    fullName: 'Halima Danjuma',
    email: 'halima.d@example.com',
    phone: '+234 809 330 2211'
  },
  shipping: {
    street: '22 Rumuola Road',
    city: 'Port Harcourt',
    state: 'Rivers',
    country: 'Nigeria'
  },
  items: [
  {
    productId: 'p-21',
    name: 'Coconut & Shea Candle',
    image: CANDLE,
    price: 17500,
    quantity: 2
  }],

  subtotal: 35000,
  discount: 0,
  shippingFee: 6000,
  total: 41000,
  status: 'delivered',
  paymentMethod: 'whatsapp',
  createdAt: '2026-07-19T13:10:00.000Z'
},
{
  id: 'o-5',
  reference: 'SBM-10427',
  customer: {
    fullName: 'Zainab Yusuf',
    email: 'zainab.yusuf@example.com',
    phone: '+234 802 774 5510'
  },
  shipping: {
    street: '4 Zoo Road',
    city: 'Kano',
    state: 'Kano',
    country: 'Nigeria'
  },
  items: [
  {
    productId: 'p-11',
    name: 'Attar Noir Perfume Oil',
    image: AMBER,
    price: 22000,
    quantity: 3
  }],

  subtotal: 66000,
  discount: 6600,
  shippingFee: 6000,
  total: 65400,
  status: 'pending',
  paymentMethod: 'whatsapp',
  createdAt: '2026-08-01T07:15:00.000Z'
},
{
  id: 'o-6',
  reference: 'SBM-10426',
  customer: {
    fullName: 'Chidinma Eze',
    email: 'chidinma.eze@example.com',
    phone: '+234 806 118 9922'
  },
  shipping: {
    street: '18 Aba Road',
    city: 'Port Harcourt',
    state: 'Rivers',
    country: 'Nigeria'
  },
  items: [
  {
    productId: 'p-02',
    name: 'Ivory Bloom',
    image: BLUSH,
    price: 64000,
    quantity: 1
  }],

  subtotal: 64000,
  discount: 0,
  shippingFee: 6000,
  total: 70000,
  status: 'cancelled',
  paymentMethod: 'online',
  createdAt: '2026-07-12T20:41:00.000Z'
}];