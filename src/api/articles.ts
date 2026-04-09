import { supabase } from '../lib/supabaseClient';
import type { Article } from '../types';

function formatArticle(data: any): Article {
  return {
    ...data,
    author_name: data.profiles?.name || 'Equipe Focus',
    // Simple reading time estimation: 200 words per minute
    reading_time: `${Math.ceil(data.content.split(/\s+/).length / 200)} min`
  } as Article;
}

export async function fetchArticles() {
  if (!supabase) throw new Error("Database connection not available.");

  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      profiles:author_id (name)
    `)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return (data as any[]).map(formatArticle);
}

export async function fetchArticleBySlug(slug: string) {
  if (!supabase) throw new Error("Database connection not available.");

  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      profiles:author_id (name)
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return formatArticle(data);
}

export async function createArticle(articleData: {
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  category?: string;
  tags?: string[];
  is_published?: boolean;
  author_id?: string;
  content_format?: string;
}) {
  if (!supabase) throw new Error("Database connection not available.");
  const { data, error } = await supabase.rpc('create_article', {
    p_title: articleData.title,
    p_content: articleData.content,
    p_excerpt: articleData.excerpt,
    p_image_url: articleData.image_url,
    p_category: articleData.category,
    p_tags: articleData.tags,
    p_is_published: articleData.is_published,
    p_author_id: articleData.author_id,
    p_content_format: articleData.content_format || 'html'
  });
  return { data, error };
}

export async function updateArticle(articleId: string, articleData: {
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  category: string;
  tags: string[];
  is_published: boolean;
  content_format?: string;
}) {
  if (!supabase) throw new Error("Database connection not available.");
  const { data, error } = await supabase.rpc('update_article', {
    p_id: articleId,
    p_title: articleData.title,
    p_content: articleData.content,
    p_excerpt: articleData.excerpt,
    p_image_url: articleData.image_url,
    p_category: articleData.category,
    p_tags: articleData.tags,
    p_is_published: articleData.is_published,
    p_content_format: articleData.content_format || 'html'
  });
  return { data, error };
}

export async function deleteArticle(articleId: string) {
  if (!supabase) throw new Error("Database connection not available.");
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', articleId);
  return { error };
}
