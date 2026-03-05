import { useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

interface UseNewsletterResult {
  subscribe: (email: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  submitted: boolean;
}

export function useNewsletter(): UseNewsletterResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const subscribe = useCallback(async (email: string) => {
    if (!email.trim() || loading) return false;

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email: email.trim().toLowerCase() }]);

      if (insertError) {
        // Handle unique constraint error (PostgreSQL error code 23505)
        if (insertError.code === '23505') {
          setError("Este e-mail já está inscrito em nossa newsletter.");
        } else {
          throw insertError;
        }
        return false;
      } else {
        setSubmitted(true);
        return true;
      }
    } catch (err) {
      console.error("Newsletter error:", err);
      setError("Ocorreu um erro ao processar sua inscrição. Tente novamente.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { subscribe, loading, error, submitted };
}
