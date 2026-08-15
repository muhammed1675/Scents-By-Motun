/**
 * Shared helpers for the service layer.
 *
 * The in-memory mock database that used to live here is gone — every service
 * module now talks to Supabase directly.
 */

export function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function slugify(value: string): string {
  return value.
  toLowerCase().
  trim().
  replace(/[^a-z0-9]+/g, '-').
  replace(/(^-|-$)/g, '');
}
