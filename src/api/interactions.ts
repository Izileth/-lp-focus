import { supabase } from '../lib/supabaseClient';

export type InteractionType = 'page_view' | 'product_view' | 'cta_click' | 'ads_click';

export async function trackInteraction(
  type: InteractionType, 
  targetId?: string | number, 
  metadata: Record<string, unknown> = {}
) {
  if (!supabase) return;

  const { error } = await supabase
    .from('interactions')
    .insert({
      type,
      target_id: targetId?.toString(),
      metadata: {
        ...metadata,
        url: window.location.href,
        user_agent: navigator.userAgent
      }
    });

  if (error) throw error;
  return true;
}
