import { ContactMessage, StoreLocation, Testimonial } from '../types';
import { supabase } from './supabase';
import { toLocation, toMessage, toTestimonial } from './mappers';

export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase.
  from('testimonials').
  select('*').
  eq('status', 'approved').
  order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toTestimonial);
}

export async function getStoreLocations(): Promise<StoreLocation[]> {
  const { data, error } = await supabase.
  from('store_locations').
  select('*').
  order('name', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toLocation);
}

export async function submitContactMessage(input: {
  name: string;
  email: string;
  phone: string;
  comment: string;
}): Promise<ContactMessage> {
  const { data, error } = await supabase.
  from('contact_messages').
  insert({
    name: input.name,
    email: input.email,
    phone: input.phone,
    comment: input.comment
  }).
  select('*').
  single();
  if (error) throw new Error(error.message);
  return toMessage(data);
}

export async function subscribeToNewsletter(
email: string)
: Promise<{ok: boolean;message: string;}> {
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, message: 'Enter a valid email address.' };
  }
  const { error } = await supabase.
  from('newsletter_subscribers').
  insert({ email: email.toLowerCase().trim() });

  if (error) {
    // 23505 = unique violation: already subscribed.
    if ((error as { code?: string }).code === '23505') {
      return { ok: true, message: 'You are already on the list.' };
    }
    return { ok: false, message: 'Could not sign you up right now.' };
  }
  return { ok: true, message: 'Welcome in — check your inbox for 10% off.' };
}
