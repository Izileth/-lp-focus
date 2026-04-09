import { supabase } from '../lib/supabaseClient';

export async function subscribeToNewsletter(email: string) {
  if (!supabase) throw new Error("Database connection not available.");

  const { error } = await supabase
    .from('newsletter_subscriptions')
    .insert([{ email: email.trim().toLowerCase() }]);

  if (error) {
    if (error.code === '23505') {
      throw new Error("Este e-mail já está inscrito em nossa newsletter.");
    }
    throw error;
  }
  return true;
}
