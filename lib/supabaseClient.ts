import { createClient } from '@supabase/supabase-js';

// Ganti dengan Project URL & Anon Public Key dari dashboard Supabase kamu
const supabaseUrl = 'https://mqliwikxxktkvwtvwrks.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xbGl3aWt4eGt0a3Z3dHZ3cmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjI0NTAsImV4cCI6MjA2Nzg5ODQ1MH0.iX5w1-93bnmBdjSZh4jhXRsbz9_aZ6M4EuWTndi3SR0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
