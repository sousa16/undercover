import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  // Don't throw at import time during build — surface a useful message client-side.
  // eslint-disable-next-line no-console
  console.warn("[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(url ?? "http://localhost", anon ?? "anon", {
  auth: { persistSession: false },
});

export type WordPair = {
  id: string;
  word_civilian: string;
  word_undercover: string;
  created_at: string;
};
