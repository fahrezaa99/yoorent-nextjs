import { createClient } from "@supabase/supabase-js";

// Ambil environment variable dari .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Bikin instance supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
