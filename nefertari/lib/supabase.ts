import { createClient, SupabaseClient } from '@supabase/supabase-js';

type OnboardingRow = {
  id?: string;
  client_slug: string;
  essencia?: string | null;
  valores?: string | null;
  transformacao?: string | null;
  publico?: string | null;
  dores?: string | null;
  concorrencia?: string | null;
  estetica?: string | null;
  detesta?: string | null;
  cardapio?: string | null;
  estrategia?: string | null;
  operacao?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type Database = {
  public: {
    Tables: {
      client_onboardings: {
        Row: Required<OnboardingRow>;
        Insert: OnboardingRow;
        Update: OnboardingRow;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

/*
 * Supabase table DDL — run once in the Supabase SQL editor:
 *
 * create table client_onboardings (
 *   id            uuid        default gen_random_uuid() primary key,
 *   client_slug   text        unique not null,
 *   essencia      text,
 *   valores       text,
 *   transformacao text,
 *   publico       text,
 *   dores         text,
 *   concorrencia  text,
 *   estetica      text,
 *   detesta       text,
 *   cardapio      text,
 *   estrategia    text,
 *   operacao      text,
 *   created_at    timestamptz default now(),
 *   updated_at    timestamptz default now()
 * );
 *
 * -- RLS policy (allow anon read + write for now; tighten in prod):
 * alter table client_onboardings enable row level security;
 * create policy "public access" on client_onboardings for all using (true) with check (true);
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const SUPABASE_CONFIGURED = Boolean(url && key);

let _client: SupabaseClient<Database> | null = null;

export function getSupabase() {
  if (!_client && SUPABASE_CONFIGURED) {
    _client = createClient<Database>(url, key);
  }
  return _client;
}
