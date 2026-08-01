import { Address, Order, User } from '../types';

const AMBER = "/114886d9-688e-4210-83f9-bea62727678e.jpg";

const OIL = "/dfba970f-1742-43ef-88a3-d1c0fe3ee083.jpg";

const GIFTSET = "/faaaf0cd-fa17-45f6-bb91-31c63d521ce5.jpg";


export const demoAddresses: Address[] = [
{
  id: 'a-1',
  label: 'Home',
  street: '12 Fola Osibo Street',
  city: 'Lekki Phase 1',
  state: 'Lagos',
  country: 'Nigeria',
  isDefault: true
},
{
  id: 'a-2',
  label: 'Office',
  street: '3rd Floor, 20 Marina',
  city: 'Lagos Island',
  state: 'Lagos',
  country: 'Nigeria',
  isDefault: false
}];


export const demoUser: User = {
  id: 'u-1',
  fullName: 'Adaeze Okonkwo',
  email: 'adaeze.o@example.com',
  phone: '+234 803 221 4410',
  addresses: demoAddresses
};

export const demoUserOrders: Order[] = [
{
  id: 'uo-1',
  reference: 'SBM-10431',
  customer: {
    fullName: demoUser.fullName,
    email: demoUser.email,
    phone: demoUser.phone
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
  }],

  subtotal: 78000,
  discount: 7800,
  shippingFee: 3500,
  total: 73700,
  status: 'processing',
  paymentMethod: 'online',
  createdAt: '2026-07-31T09:24:00.000Z'
},
{
  id: 'uo-2',
  reference: 'SBM-10388',
  customer: {
    fullName: demoUser.fullName,
    email: demoUser.email,
    phone: demoUser.phone
  },
  shipping: {
    street: '12 Fola Osibo Street',
    city: 'Lekki Phase 1',
    state: 'Lagos',
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
    productId: 'p-11',
    name: 'Attar Noir Perfume Oil',
    image: OIL,
    price: 22000,
    quantity: 1
  }],

  subtotal: 56000,
  discount: 0,
  shippingFee: 3500,
  total: 59500,
  status: 'delivered',
  paymentMethod: 'whatsapp',
  createdAt: '2026-06-14T12:08:00.000Z'
},
{
  id: 'uo-3',
  reference: 'SBM-10233',
  customer: {
    fullName: demoUser.fullName,
    email: demoUser.email,
    phone: demoUser.phone
  },
  shipping: {
    street: '3rd Floor, 20 Marina',
    city: 'Lagos Island',
    state: 'Lagos',
    country: 'Nigeria'
  },
  items: [
  {
    productId: 'p-07',
    name: 'Rose de Motun Body Mist',
    image: AMBER,
    price: 14500,
    quantity: 2
  }],

  subtotal: 29000,
  discount: 2900,
  shippingFee: 3500,
  total: 29600,
  status: 'delivered',
  paymentMethod: 'online',
  createdAt: '2026-04-02T09:55:00.000Z'
}];