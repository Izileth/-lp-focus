-- supabase/migrations/0029_newsletter_templates.sql

-- 1. Create newsletter_templates table
CREATE TABLE IF NOT EXISTS public.newsletter_templates (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    content_html TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.newsletter_templates ENABLE ROW LEVEL SECURITY;

-- 2. RLS Policies
-- Allow anyone to read (needed for functions and potentially preview)
CREATE POLICY "Templates are viewable by everyone" ON public.newsletter_templates
    FOR SELECT USING (true);

-- Only admins can manage (INSERT, UPDATE, DELETE)
CREATE POLICY "Templates are manageable by admins" ON public.newsletter_templates
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- 3. Trigger for updated_at
CREATE TRIGGER newsletter_templates_updated_at_trigger
BEFORE UPDATE ON public.newsletter_templates
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 4. Seed initial templates (based on 0016 and 0017)
INSERT INTO public.newsletter_templates (id, subject, content_html)
VALUES 
('welcome', 'Bem-vindo à nossa Newsletter! 📚', '<h1>Obrigado por se inscrever!</h1><p>Em breve você receberá nossos conteúdos exclusivos diretamente no seu e-mail: {{email}}</p>'),
('weekly', 'Novidades da Semana! 🚀', '
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
        <div style="border: 1px solid #eee; padding: 30px; border-radius: 10px; background-color: #fff;">
          <h1 style="font-size: 22px; color: #000; margin-bottom: 20px;">Sua dose semanal de conhecimento 📚</h1>
          <p style="font-size: 16px; line-height: 1.6;">Olá!</p>
          <p style="font-size: 16px; line-height: 1.6;">Aqui estão as novidades e conteúdos exclusivos que preparamos para você esta semana.</p>
          
          <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #000;">
            <p style="margin: 0; font-weight: bold; font-size: 16px;">Destaque da Semana:</p>
            <p style="margin: 10px 0 0 0; color: #444;">Como os novos hábitos de leitura estão transformando a retenção de conhecimento no meio digital.</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">Para ler o conteúdo completo e conferir nossas novas ofertas, acesse nosso portal clicando no botão abaixo:</p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="{{base_url}}" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; display: inline-block;">ACESSAR CONTEÚDO</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
          
          <div style="text-align: center; font-size: 12px; color: #999; line-height: 1.5;">
            <p>Você recebeu este e-mail porque faz parte da nossa newsletter.</p>
            <p>
              Deseja parar de receber? 
              <br>
              <a href="{{base_url}}/unsubscribe?email={{email}}" 
                 style="color: #666; font-weight: bold; text-decoration: underline;">
                 Clique aqui para cancelar sua inscrição
              </a>
            </p>
          </div>
        </div>
      </div>')
ON CONFLICT (id) DO NOTHING;

-- 5. Update welcome email function to use templates
CREATE OR REPLACE FUNCTION public.send_welcome_email()
RETURNS TRIGGER AS $$
DECLARE
  resend_api_key TEXT := 're_QT3i4w4D_Nic1kvdQ9Pxzg2HrSzamKQyX'; -- Using the key from 0016
  template_record RECORD;
  final_html TEXT;
  response_id BIGINT;
BEGIN
  -- Get template
  SELECT * INTO template_record FROM public.newsletter_templates WHERE id = 'welcome';
  
  -- Fallback in case template is missing
  IF template_record.id IS NULL THEN
    final_html := '<h1>Obrigado por se inscrever!</h1><p>Em breve você receberá nossos conteúdos exclusivos diretamente no seu e-mail: ' || NEW.email || '</p>';
    template_record.subject := 'Bem-vindo à nossa Newsletter! 📚';
  ELSE
    -- Replace placeholders
    final_html := replace(template_record.content_html, '{{email}}', NEW.email);
  END IF;

  -- HTTP Call via pg_net
  SELECT net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || resend_api_key
    ),
    body := jsonb_build_object(
      'from', 'Newsletter <onboarding@resend.dev>',
      'to', ARRAY[NEW.email],
      'subject', template_record.subject,
      'html', final_html
    )
  ) INTO response_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Update weekly newsletter job to use templates
CREATE OR REPLACE FUNCTION public.run_weekly_newsletter_job()
RETURNS VOID AS $$
DECLARE
  resend_api_key TEXT := 're_QT3i4w4D_Nic1kvdQ9Pxzg2HrSzamKQyX';
  sub RECORD;
  template_record RECORD;
  final_html TEXT;
  base_url TEXT := 'http://localhost:5173'; -- Default dev URL
BEGIN
  -- Get template
  SELECT * INTO template_record FROM public.newsletter_templates WHERE id = 'weekly';
  
  IF template_record.id IS NULL THEN
    RETURN;
  END IF;

  FOR sub IN SELECT email FROM public.newsletter_subscriptions LOOP
    -- Replace placeholders
    final_html := replace(template_record.content_html, '{{email}}', sub.email);
    final_html := replace(final_html, '{{base_url}}', base_url);

    PERFORM net.http_post(
      url := 'https://api.resend.com/emails',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || resend_api_key
      ),
      body := jsonb_build_object(
        'from', 'Newsletter <onboarding@resend.dev>',
        'to', ARRAY[sub.email],
        'subject', template_record.subject,
        'html', final_html
      )
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
