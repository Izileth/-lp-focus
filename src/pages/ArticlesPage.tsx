// src/pages/ArticlesPage.tsx
import { motion } from "framer-motion";
import { ArticleCard } from "../components/ArticleCard";
import { fadeUpVariants, staggerContainer } from "../motionVariants";
import { useArticles } from "../hooks/useArticles";
import { IconLoader } from "../components/Icons";
import { FreeAccessSection } from "../components/ArticleProofBasement";
export default function ArticlesPage() {
  const { articles, loading, error } = useArticles();

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
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
        <section className="px-10 py-24 min-h-[400px]">
          <div className="max-w-[1200px] mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <IconLoader size={32} className="text-white/20" />
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-white/20">Carregando insights...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-white/40 font-sans">{error}</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-white/40 font-sans">Nenhum artigo publicado no momento.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {articles.map((article, index) => (
                  <ArticleCard key={article.id} article={article} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
        
        <section>
          <FreeAccessSection />
        </section>
      </main>
    </div>
  );
}
