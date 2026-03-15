// src/hooks/useArticleMutations.ts
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useCreateArticle() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createArticle = async (articleData: {
    title: string;
    content: string;
    excerpt?: string;
    image_url?: string;
    category?: string;
    tags?: string[];
    is_published?: boolean;
    author_id?: string;
  }) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.rpc('create_article', {
      p_title: articleData.title,
      p_content: articleData.content,
      p_excerpt: articleData.excerpt,
      p_image_url: articleData.image_url,
      p_category: articleData.category,
      p_tags: articleData.tags,
      p_is_published: articleData.is_published,
      p_author_id: articleData.author_id
    });

    setLoading(false);
    return { data, error };
  };

  return { createArticle, loading, error };
}

export function useUpdateArticle() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateArticle = async (articleId: string, articleData: {
    title: string;
    content: string;
    excerpt: string;
    image_url: string;
    category: string;
    tags: string[];
    is_published: boolean;
  }) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.rpc('update_article', {
      p_id: articleId,
      p_title: articleData.title,
      p_content: articleData.content,
      p_excerpt: articleData.excerpt,
      p_image_url: articleData.image_url,
      p_category: articleData.category,
      p_tags: articleData.tags,
      p_is_published: articleData.is_published
    });

    setLoading(false);
    return { data, error };
  };

  return { updateArticle, loading, error };
}

export function useDeleteArticle() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteArticle = async (articleId: string) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleId);

    if (error) setError(error.message);

    setLoading(false);
    return { error };
  };

  return { deleteArticle, loading, error };
}
