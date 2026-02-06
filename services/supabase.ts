import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

console.log("SUPABASE URL =", supabaseUrl);
console.log("SUPABASE KEY starts with =", supabaseAnonKey?.slice(0, 25));

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase env vars: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
