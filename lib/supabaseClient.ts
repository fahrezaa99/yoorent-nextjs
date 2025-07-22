import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Pastikan dua env di atas sudah diisi di .env.local

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
