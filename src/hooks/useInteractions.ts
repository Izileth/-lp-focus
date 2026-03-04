// src/hooks/useInteractions.ts
import { useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

type InteractionType = 'page_view' | 'product_view' | 'cta_click';

export function useInteractions() {
  // Use a ref to track what has already been recorded in this component session
  // This prevents duplicates if the user clicks multiple times or if a component re-renders
  const trackedItems = useRef<Set<string>>(new Set());

  const trackInteraction = useCallback(async (
    type: InteractionType, 
    targetId?: string | number, 
    metadata: Record<string, unknown> = {}
  ) => {
    if (!supabase) return;

    // Create a unique key for this interaction to prevent immediate duplicates
    const trackingKey = `${type}-${targetId || 'global'}`;
    
    if (trackedItems.current.has(trackingKey)) {
      return; // Already tracked in this session/component instance
    }

    // Mark as tracked before the async call to prevent race conditions
    trackedItems.current.add(trackingKey);

    try {
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

      if (error) {
        // If it failed, we might want to try again later, so remove from set
        trackedItems.current.delete(trackingKey);
        console.error('Error tracking interaction:', error.message);
      }
    } catch (err) {
      trackedItems.current.delete(trackingKey);
      console.error('Failed to track interaction:', err);
    }
  }, []);

  return { trackInteraction };
}
