import { Address, Order, User } from '../types';
import { supabase } from './supabase';
import { toAddress, toOrder } from './mappers';

export interface SignupAddress {
  street: string;
  city: string;
  state: string;
  country?: string;
}

async function loadAddresses(userId: string): Promise<Address[]> {
  const { data, error } = await supabase.
  from('addresses').
  select('*').
  eq('user_id', userId).
  order('is_default', { ascending: false }).
  order('label', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toAddress);
}

async function buildUser(authUser: { id: string; email?: string }): Promise<User> {
  const [{ data: profile }, addresses] = await Promise.all([
  supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle(),
  loadAddresses(authUser.id)]
  );
  return {
    id: authUser.id,
    fullName: profile?.full_name ?? '',
    email: profile?.email ?? authUser.email ?? '',
    phone: profile?.phone ?? '',
    addresses
  };
}

export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return buildUser(data.user);
}

export async function login(
email: string,
password: string)
: Promise<{ok: boolean;message?: string;user?: User;}> {
  if (!email || !password) {
    return { ok: false, message: 'Enter your email and password.' };
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { ok: false, message: error?.message ?? 'Could not sign you in.' };
  }
  return { ok: true, user: await buildUser(data.user) };
}

export async function signup(input: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  address?: SignupAddress;
}): Promise<{ok: boolean;message?: string;user?: User;}> {
  if (input.password.length < 6) {
    return { ok: false, message: 'Password must be at least 6 characters.' };
  }
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: window.location.origin,
      data: { full_name: input.fullName, phone: input.phone }
    }
  });
  if (error) return { ok: false, message: error.message };
  if (!data.session) {
    return {
      ok: false,
      message: 'Check your inbox to confirm your email, then sign in.'
    };
  }

  // Address is optional — a signup shouldn't fail just because saving the
  // address afterwards hit a snag, so this is best-effort.
  if (input.address?.street && input.address.city && input.address.state) {
    try {
      await saveAddress({
        label: 'Home',
        street: input.address.street,
        city: input.address.city,
        state: input.address.state,
        country: input.address.country || 'Nigeria',
        isDefault: true
      });
    } catch {
      // Ignored: the account still exists even if the address save failed.
    }
  }

  return { ok: true, user: await buildUser(data.user!) };
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function updateProfile(patch: Partial<User>): Promise<User> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('You are not signed in.');

  const row: Record<string, unknown> = {};
  if (patch.fullName !== undefined) row.full_name = patch.fullName;
  if (patch.phone !== undefined) row.phone = patch.phone;
  if (patch.email !== undefined) row.email = patch.email;

  if (Object.keys(row).length > 0) {
    const { error } = await supabase.
    from('profiles').
    update(row).
    eq('id', auth.user.id);
    if (error) throw new Error(error.message);
  }

  return buildUser(auth.user);
}

export async function getMyOrders(): Promise<Order[]> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];
  const { data, error } = await supabase.
  from('orders').
  select('*').
  eq('user_id', auth.user.id).
  order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toOrder);
}

export async function getMyAddresses(): Promise<Address[]> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];
  return loadAddresses(auth.user.id);
}

export async function saveAddress(
address: Omit<Address, 'id'> & {id?: string;})
: Promise<Address[]> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('You are not signed in.');
  const userId = auth.user.id;

  const row = {
    user_id: userId,
    label: address.label,
    street: address.street,
    city: address.city,
    state: address.state,
    country: address.country,
    is_default: address.isDefault
  };

  let savedId = address.id;
  if (address.id) {
    const { error } = await supabase.
    from('addresses').
    update(row).
    eq('id', address.id).
    eq('user_id', userId);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase.
    from('addresses').
    insert(row).
    select('id').
    single();
    if (error) throw new Error(error.message);
    savedId = data.id;
  }

  if (address.isDefault && savedId) {
    const { error } = await supabase.
    from('addresses').
    update({ is_default: false }).
    eq('user_id', userId).
    neq('id', savedId);
    if (error) throw new Error(error.message);
  }

  return loadAddresses(userId);
}

export async function deleteAddress(id: string): Promise<Address[]> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('You are not signed in.');
  const { error } = await supabase.
  from('addresses').
  delete().
  eq('id', id).
  eq('user_id', auth.user.id);
  if (error) throw new Error(error.message);
  return loadAddresses(auth.user.id);
}