// src/pages/ArticleDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "../components/Header";
import { MobileMenu } from "../components/MobileMenu";
import { Footer } from "../components/Footer";
import { NoiseOverlay } from "../components/NoiseOverlay";
import { IconArrowLeft, IconClock, IconCalendar, IconUser, IconLoader } from "../components/Icons";
import NewsletterSection from "../components/NewsletterSection";
import { fadeUpVariants, staggerContainer } from "../motionVariants";
import { useArticle } from "../hooks/useArticles";

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [menuOpen, setMenuOpen] = useState(false);
  const { article, loading, error } = useArticle(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const formattedDate = article?.published_at 
    ? new Date(article.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center">
        <IconLoader size={32} className="text-white/20 mb-4" />
        <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-white/20">Carregando conteúdo...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-10 text-center">
        <h2 className="[font-family:'Playfair_Display',serif] text-3xl mb-4">Artigo não encontrado</h2>
        <p className="text-white/40 mb-8 max-w-md">O conteúdo que você está procurando pode ter sido removido ou o link está incorreto.</p>
        <Link
          to="/artigos"
          className="bg-white text-black font-sans text-[12px] font-medium tracking-[0.1em] uppercase px-8 py-3.5 hover:bg-white/85 transition-colors no-underline"
        >
          Voltar aos Artigos
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <NoiseOverlay />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="flex-grow pt-[140px]">
        <article className="max-w-[800px] mx-auto px-10">
          {/* Back Link */}
          <Link
            to="/artigos"
            className="group inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors mb-12 no-underline"
          >
            <IconArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Voltar aos Artigos
          </Link>

          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-12"
          >
            {article.category && (
              <motion.div variants={fadeUpVariants} className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 border border-white/10 text-[10px] uppercase tracking-[0.2em] text-white/60">
                  {article.category}
                </span>
              </motion.div>
            )}

            <motion.h1
              variants={fadeUpVariants}
              className="[font-family:'Playfair_Display',serif] text-[40px] md:text-[64px] font-bold leading-[1.1] mb-8"
            >
              {article.title}
            </motion.h1>

            <motion.div
              variants={fadeUpVariants}
              className="flex flex-wrap items-center gap-x-8 gap-y-4 text-[11px] uppercase tracking-[0.15em] text-white/40 font-sans border-y border-white/5 py-6"
            >
              <span className="flex items-center gap-2"><IconUser size={14} /> {article.author_name}</span>
              <span className="flex items-center gap-2"><IconCalendar size={14} /> {formattedDate}</span>
              <span className="flex items-center gap-2"><IconClock size={14} /> {article.reading_time} de leitura</span>
            </motion.div>
          </motion.div>

          {/* Cover Image */}
          {article.image_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="aspect-[16/9] overflow-hidden border border-white/5 mb-16"
            >
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover grayscale opacity-80"
              />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-sans text-white/70 text-lg leading-[1.8] space-y-8 prose prose-invert prose-headings:font-serif prose-headings:text-white prose-blockquote:border-white/20 prose-blockquote:text-white/50"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="h-24" />
        </article>

        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}
