import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Eğer env dosyası yoksa veya boşsa dummy (mock) modda çalışması için hata fırlatmayı engelliyoruz.
export const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'buraya_supabase_url_gelecek';

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
