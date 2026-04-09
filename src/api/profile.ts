import { supabase } from '../lib/supabaseClient';
import type { Profile } from '../types';

export async function fetchProfile(userId: string) {
  if (!supabase) throw new Error("Database connection not available.");

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  if (!supabase) throw new Error("Database connection not available.");

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}
