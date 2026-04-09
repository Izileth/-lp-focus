import { supabase } from '../lib/supabaseClient';

export async function checkAdminStatus() {
  if (!supabase) throw new Error("Database connection not available.");

  const { data, error } = await supabase.rpc('is_admin');

  if (error) throw error;
  return data as boolean;
}
