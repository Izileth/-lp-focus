// src/hooks/useArticles.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Article } from '../types';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      if (!supabase) {
        setError("Database connection not available.");
        setLoading(false);
        return;
      }

      const query = supabase
        .from('articles')
        .select(`
          *,
          profiles:author_id (name)
        `)
        .order('published_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        const formattedArticles = (data as any[]).map(article => ({
          ...article,
          author_name: article.profiles?.name || 'Equipe Focus',
          // Simple reading time estimation: 200 words per minute
          reading_time: `${Math.ceil(article.content.split(/\s+/).length / 200)} min`
        }));
        setArticles(formattedArticles as Article[]);
      }
      setLoading(false);
    }

    fetchArticles();
  }, []);

  return { articles, loading, error };
}

export function useArticle(slug: string | undefined) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      if (!slug || !supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          profiles:author_id (name)
        `)
        .eq('slug', slug)
        .single();

      if (error) {
        setError(error.message);
      } else {
        const formattedArticle = {
          ...data,
          author_name: data.profiles?.name || 'Equipe Focus',
          reading_time: `${Math.ceil(data.content.split(/\s+/).length / 200)} min`
        };
        setArticle(formattedArticle as Article);
      }
      setLoading(false);
    }

    fetchArticle();
  }, [slug]);

  return { article, loading, error };
}
