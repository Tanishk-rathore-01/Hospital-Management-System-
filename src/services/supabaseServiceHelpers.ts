import { assertSupabaseConfigured, supabase } from '../lib/supabase';

export function throwIfSupabaseError(error: { message?: string } | null) {
  if (error) {
    throw new Error(error.message || 'Supabase request failed');
  }
}

export function toNumber(value: unknown): number {
  return typeof value === 'number' ? value : Number(value || 0);
}

// Role management functions
export type UserRole = 'owner' | 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'pharmacist' | 'billing_staff';

export async function getUserRole(): Promise<UserRole | null> {
  assertSupabaseConfigured();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
  
  if (error || !data) return null;
  
  return data.role as UserRole;
}

export async function getUserHierarchyLevel(): Promise<number | null> {
  assertSupabaseConfigured();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_roles')
    .select('hierarchy_level')
    .eq('user_id', user.id)
    .single();
  
  if (error || !data) return null;
  
  return data.hierarchy_level;
}

export function hasSufficientHierarchy(userLevel: number | null, requiredLevel: number): boolean {
  if (userLevel === null) return false;
  return userLevel <= requiredLevel;
}
