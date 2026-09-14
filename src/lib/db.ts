import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { CATEGORY_IMAGES, PRODUCT_IMAGES } from './product-images';

// ---- Team detection --------------------------------------------------
const DEFAULT_TEAM_ID = '1';

export function getTeamId(): string {
  if (environment.team !== undefined && environment.team !== null && String(environment.team).trim() !== '') {
    return String(environment.team);
  }

  if (typeof window === 'undefined') return DEFAULT_TEAM_ID;
  return new URLSearchParams(window.location.search).get('team') ?? DEFAULT_TEAM_ID;
}

const NUMERIC_KEYS = ['price', 'compare_at_price', 'rating', 'total'];

function resolveImageForRow(row: any): string | undefined {
  const slug = row.slug;
  if (typeof slug !== 'string') return undefined;
  return (
    (PRODUCT_IMAGES as Record<string, string>)[slug] ??
    (CATEGORY_IMAGES as Record<string, string>)[slug]
  );
}

export function coerceNumericFields<T>(rows: any[] | null): T[] {
  if (!rows) return [];
  return rows.map((row: any) => {
    const out = { ...row };
    for (const key of NUMERIC_KEYS) {
      if (key in out && out[key] != null) {
        out[key] = Number(out[key]);
      }
    }
    const resolved = resolveImageForRow(out);
    if (resolved !== undefined) {
      out.image_url = resolved;
    }
    return out;
  });
}

let dbPromise: Promise<SupabaseClient<any, any, any>> | null = null;

export function getDb(): Promise<SupabaseClient<any, any, any>> {
  if (!dbPromise) {
    if (!environment.supabaseUrl || !environment.supabaseAnonKey) {
      return Promise.reject(
        new Error('[db] Supabase URL and anon key must be configured in environment.ts')
      );
    }

    const teamId = getTeamId();
    dbPromise = Promise.resolve(
      createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
        db: { schema: `team_${teamId}` },
      })
    );
  }
  return dbPromise;
}
