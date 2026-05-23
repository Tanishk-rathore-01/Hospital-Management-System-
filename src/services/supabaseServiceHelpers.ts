import { assertSupabaseConfigured, supabase } from '../lib/supabase';

type IdRow = {
  id: string;
};

export function throwIfSupabaseError(error: { message?: string } | null) {
  if (error) {
    throw new Error(error.message || 'Supabase request failed');
  }
}

export async function getNextPrefixedId(table: string, prefix: string): Promise<string> {
  assertSupabaseConfigured();

  const { data, error } = await supabase.from(table).select('id');
  throwIfSupabaseError(error);

  const maxId = ((data || []) as IdRow[]).reduce((max, row) => {
    const id = String(row.id || '');
    if (!id.startsWith(prefix)) return max;
    const numeric = Number.parseInt(id.slice(prefix.length), 10);
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 0);

  return `${prefix}${String(maxId + 1).padStart(3, '0')}`;
}

export function toNumber(value: unknown): number {
  return typeof value === 'number' ? value : Number(value || 0);
}
