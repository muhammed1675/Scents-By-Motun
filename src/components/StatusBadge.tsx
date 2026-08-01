import React from 'react';
import { OrderStatus, TestimonialStatus } from '../types';
import { cn } from '../utils/format';

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'gold';

const tones: Record<Tone, string> = {
  neutral: 'bg-cream text-chestnut border-cocoa/15',
  info: 'bg-[#EAF1F5] text-[#2C5567] border-[#2C5567]/20',
  success: 'bg-[#E8F1E9] text-[#2F5D3A] border-[#2F5D3A]/20',
  warning: 'bg-[#FBF0DC] text-[#8A6512] border-[#8A6512]/20',
  danger: 'bg-[#F8E7E5] text-[#8F1E18] border-[#8F1E18]/20',
  gold: 'bg-gold/15 text-[#7C6412] border-gold/40'
};

const orderTones: Record<OrderStatus, Tone> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'gold',
  delivered: 'success',
  cancelled: 'danger'
};

const testimonialTones: Record<TestimonialStatus, Tone> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger'
};

interface StatusBadgeProps {
  status: OrderStatus | TestimonialStatus | string;
  tone?: Tone;
  className?: string;
}

export function StatusBadge({ status, tone, className }: StatusBadgeProps) {
  const resolved: Tone =
  tone ??
  orderTones[status as OrderStatus] ??
  testimonialTones[status as TestimonialStatus] ??
  'neutral';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize tracking-wide',
        tones[resolved],
        className
      )}>
      
      {status}
    </span>);

}