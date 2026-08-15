import { CustomRequest } from '../types';
import { supabase } from './supabase';
import { toCustomRequest } from './mappers';

export async function uploadRequestImages(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];
  const urls: string[] = [];
  for (const file of files) {
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name}`;
    const { error } = await supabase.storage.
    from('custom-request-images').
    upload(path, file);
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from('custom-request-images').getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

export async function submitCustomRequest(input: {
  itemDescription: string;
  details: string;
  quantity: number;
  budget?: number;
  needBy?: string;
  referenceImages: string[];
  fullName: string;
  phone: string;
  email: string;
}): Promise<CustomRequest> {
  const { data, error } = await supabase.
  from('custom_requests').
  insert({
    item_description: input.itemDescription,
    details: input.details,
    quantity: input.quantity,
    budget: input.budget ?? null,
    need_by: input.needBy || null,
    reference_images: input.referenceImages,
    full_name: input.fullName,
    phone: input.phone,
    email: input.email
  }).
  select('*').
  single();
  if (error) throw new Error(error.message);
  return toCustomRequest(data);
}
