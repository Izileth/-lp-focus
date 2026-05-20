import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'book';
  publishedTime?: string;
  author?: string;
  canonical?: string;
  jsonLd?: Record<string, any>;
}

const DEFAULT_TITLE = 'Modus Focus | Produtividade, Conhecimento e Evolução Pessoal';
const DEFAULT_DESCRIPTION = 'Desenvolva foco, disciplina e produtividade com a FOCUS. Conteúdos práticos sobre conhecimento, evolução pessoal e alta performance.';
const DEFAULT_KEYWORDS = 'produtividade, foco, disciplina, evolução pessoal, alta performance, desenvolvimento pessoal, mentalidade, hábitos, sucesso, conhecimento';
const SITE_URL = 'https://modusfocus.online';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  author = 'Modus Focus',
  canonical,
  jsonLd,
}: SEOProps) => {
  const seoTitle = title ? `${title} | Modus Focus` : DEFAULT_TITLE;
  const seoDescription = description || DEFAULT_DESCRIPTION;
  const seoKeywords = keywords || DEFAULT_KEYWORDS;
  const seoImage = image || DEFAULT_IMAGE;
  const seoUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const seoCanonical = canonical ? `${SITE_URL}${canonical}` : seoUrl;

  return (
    <Helmet>
      {/* Basic Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={seoCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content="Modus Focus" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};
