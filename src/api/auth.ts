import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data.user, error };
}

export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { user: data.user, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  const { data: authListener } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      callback(session?.user || null);
    }
  );
  return authListener.subscription;
}
