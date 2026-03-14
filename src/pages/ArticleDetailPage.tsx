// src/pages/ArticleDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "../components/Header";
import { MobileMenu } from "../components/MobileMenu";
import { Footer } from "../components/Footer";
import { NoiseOverlay } from "../components/NoiseOverlay";
import { IconArrowLeft, IconClock, IconCalendar, IconUser } from "../components/Icons";
import NewsletterSection from "../components/NewsletterSection";
import { fadeUpVariants, staggerContainer } from "../motionVariants";
import type { Article } from "../types";

// Reaproveitando os mocks para demonstração
const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    slug: "a-arte-da-produtividade-minimalista",
    title: "A Arte da Produtividade Minimalista",
    excerpt: "Como focar no que realmente importa em um mundo cheio de distrações digitais e demandas constantes.",
    content: `
      <p>A produtividade não se trata de fazer mais coisas, mas de fazer as coisas certas. Em um mundo saturado de notificações e demandas infinitas, a habilidade de filtrar o essencial tornou-se um superpoder.</p>
      <p>O minimalismo aplicado ao trabalho exige coragem para dizer não. Significa limpar sua agenda de reuniões desnecessárias e sua mente de preocupações triviais. Quando reduzimos o ruído, o foco surge naturalmente.</p>
      <blockquote>"Simplicidade é o último grau de sofisticação." - Leonardo da Vinci</blockquote>
      <p>Para começar hoje, escolha apenas três tarefas fundamentais. Ignore o restante até que estas estejam concluídas. A satisfação de completar o que realmente importa supera qualquer lista de tarefas quilométrica.</p>
    `,
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
    content: "<p>Conteúdo detalhado sobre finanças...</p>",
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
    content: "<p>Conteúdo detalhado sobre leitura...</p>",
    cover_image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
    category: "Desenvolvimento",
    author: "Equipe Focus",
    published_at: "10 Mar, 2026",
    reading_time: "4 min"
  }
];

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const found = MOCK_ARTICLES.find(a => a.slug === slug);
    if (found) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setArticle(found);
    } else {
      navigate("/artigos");
    }
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  if (!article) return null;

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
            className="group inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors mb-12"
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
            <motion.div variants={fadeUpVariants} className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 border border-white/10 text-[10px] uppercase tracking-[0.2em] text-white/60">
                {article.category}
              </span>
            </motion.div>

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
              <span className="flex items-center gap-2"><IconUser size={14} /> {article.author}</span>
              <span className="flex items-center gap-2"><IconCalendar size={14} /> {article.published_at}</span>
              <span className="flex items-center gap-2"><IconClock size={14} /> {article.reading_time} de leitura</span>
            </motion.div>
          </motion.div>

          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="aspect-[16/9] overflow-hidden border border-white/5 mb-16"
          >
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover grayscale opacity-80"
            />
          </motion.div>

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
