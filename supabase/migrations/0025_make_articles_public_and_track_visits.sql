-- supabase/migrations/0025_make_articles_public_and_track_visits.sql

-- 1. Tornar os artigos disponíveis para o público geral
-- Removemos a política restritiva anterior
DROP POLICY IF EXISTS "Anyone can view published articles" ON articles;

-- Criamos uma nova política que permite que qualquer pessoa visualize os artigos
-- Nota: Se quiser manter o rascunho (draft), use 'USING (is_published = TRUE OR is_admin())'
-- Mas seguindo sua instrução "disponíveis para o público geral", permitiremos SELECT irrestrito.
CREATE POLICY "Anyone can view articles"
ON articles FOR SELECT
USING (true);

-- 2. Atualizar a função de estatísticas administrativas
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Segurança
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  SELECT jsonb_build_object(
    'users_count', (SELECT count(*) FROM profiles),
    'products_count', (SELECT count(*) FROM products),
    'admins_count', (SELECT count(*) FROM admin_users),
    'articles_count', (SELECT count(*) FROM articles),
    'total_interactions', (SELECT count(*) FROM interactions),
    'visits_count', (SELECT count(*) FROM interactions WHERE type = 'visit'),
    'last_updated', NOW()
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Função para registrar visitas à plataforma
-- Esta função deve ser chamada via supabase.rpc('track_site_visit') no frontend
CREATE OR REPLACE FUNCTION track_site_visit()
RETURNS VOID AS $$
BEGIN
  -- O trigger 'tr_exclude_admin_interactions' (da migração 0021) 
  -- impedirá que admins sejam inseridos nesta tabela, mantendo o contador limpo.
  INSERT INTO interactions (type, user_id)
  VALUES ('visit', auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
