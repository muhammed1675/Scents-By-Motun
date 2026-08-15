import { Coupon } from '../types';

export const coupons: Coupon[] = [
{
  id: 'c-1',
  code: 'MOTUN10',
  type: 'percent',
  value: 10,
  minSpend: 30000,
  usageLimit: 500,
  timesUsed: 213,
  expiresAt: '2026-12-31',
  isActive: true
},
{
  id: 'c-2',
  code: 'WELCOME5K',
  type: 'fixed',
  value: 5000,
  minSpend: 50000,
  usageLimit: 200,
  timesUsed: 88,
  expiresAt: '2026-10-31',
  isActive: true
},
{
  id: 'c-3',
  code: 'GIFTING15',
  type: 'percent',
  value: 15,
  minSpend: 100000,
  usageLimit: 100,
  timesUsed: 41,
  expiresAt: '2026-09-30',
  isActive: true
},
{
  id: 'c-4',
  code: 'EASTER20',
  type: 'percent',
  value: 20,
  minSpend: 25000,
  usageLimit: 300,
  timesUsed: 300,
  expiresAt: '2026-04-30',
  isActive: false
}];