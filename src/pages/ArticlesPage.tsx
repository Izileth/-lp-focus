// src/pages/ArticlesPage.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "../components/Header";
import { MobileMenu } from "../components/MobileMenu";
import { Footer } from "../components/Footer";
import { NoiseOverlay } from "../components/NoiseOverlay";
import NewsletterSection from "../components/NewsletterSection";
import { ArticleCard } from "../components/ArticleCard";
import { fadeUpVariants, staggerContainer } from "../motionVariants";
import type { Article } from "../types";

const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    slug: "a-arte-da-produtividade-minimalista",
    title: "A Arte da Produtividade Minimalista",
    excerpt: "Como focar no que realmente importa em um mundo cheio de distrações digitais e demandas constantes.",
    content: "Conteúdo completo aqui...",
    cover_image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200",
    category: "Produtividade",
    author: "Equipe Focus",
    published_at: "14 Mar, 2026",
    reading_time: "5 min"
  },
  {
    id: "2",
    slug: "financas-para-liberdade",
    title: "Finanças para a Liberdade",
    excerpt: "Entenda os pilares da construção de patrimônio e como a mentalidade correta pode acelerar sua independência financeira.",
    content: "Conteúdo completo aqui...",
    cover_image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200",
    category: "Finanças",
    author: "Equipe Focus",
    published_at: "12 Mar, 2026",
    reading_time: "7 min"
  },
  {
    id: "3",
    slug: "o-poder-do-habito-de-leitura",
    title: "O Poder do Hábito de Leitura",
    excerpt: "Descubra como transformar a leitura em um hábito diário e os benefícios cognitivos de consumir livros regularmente.",
    content: "Conteúdo completo aqui...",
    cover_image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
    category: "Desenvolvimento",
    author: "Equipe Focus",
    published_at: "10 Mar, 2026",
    reading_time: "4 min"
  }
];

export default function ArticlesPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <NoiseOverlay />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="flex-grow pt-[140px]">
        {/* Hero Section */}
        <section className="px-10 pb-20 border-b border-white/[0.05]">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.p
                variants={fadeUpVariants}
                className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/30 mb-3"
              >
                Journal & Insights
              </motion.p>
              <motion.h1
                variants={fadeUpVariants}
                className="[font-family:'Playfair_Display',serif] text-[48px] md:text-[80px] font-bold leading-[1.1] mb-8"
              >
                Nossos <em className="not-italic text-white/40">Artigos</em>
              </motion.h1>
              <motion.p
                variants={fadeUpVariants}
                className="font-sans text-white/50 text-base md:text-lg max-w-[600px] leading-relaxed"
              >
                Explorações profundas sobre conhecimento, produtividade e desenvolvimento pessoal para mentes inquietas.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="px-10 py-24">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {MOCK_ARTICLES.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </div>
          </div>
        </section>

        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}
