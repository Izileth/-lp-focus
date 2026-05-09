import { supabase } from '../lib/supabaseClient';
import type { NewsletterTemplate } from '../types';

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

export async function getNewsletterTemplates() {
  const { data, error } = await supabase
    .from('newsletter_templates')
    .select('*')
    .order('id');

  if (error) throw error;
  return data as NewsletterTemplate[];
}

export async function updateNewsletterTemplate(id: string, updates: Partial<NewsletterTemplate>) {
  const { data, error } = await supabase
    .from('newsletter_templates')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as NewsletterTemplate;
}
