/**
 * Single entry point for every data operation in the app.
 *
 * Pages and components import from here only — never from `data/` directly.
 * Swapping the mock implementation for a real API or Supabase client means
 * rewriting the modules below, not the UI.
 */
export * from './catalog';
export * from './commerce';
export * from './auth';
export * from './content';
export * as adminApi from './admin';