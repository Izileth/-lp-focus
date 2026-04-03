// src/components/BooksSection.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fadeUpVariants, staggerContainer } from "../motionVariants";
import { IconBook, IconArrowRight, IconMail } from "./Icons";
import { BookCard } from "./BookCard";
import { useProducts } from "../hooks/useProducts";
import { LoadingState, ErrorState } from "./ui/StatesScreens";
import type { Product } from "../types";

export function BooksSection() {
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error}/>;
  }

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  return (
    <section id="livros" className="px-10 py-[100px] border-b border-white/[0.05]">
      <div className="max-w-[1200px] mx-auto">

        {/* Section header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-12"
        >
          <motion.p
            variants={fadeUpVariants}
            className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/30 mb-3 flex items-center gap-2"
          >
            <span className="text-white/20"><IconBook /></span>
            Catálogo
          </motion.p>
          <motion.h2
            variants={fadeUpVariants}
            className="[font-family:'Playfair_Display',serif] font-bold leading-[1.1]"
            style={{ fontSize: "clamp(32px,5vw,56px)" }}
          >
            Nossos
            <br />
            <em className="not-italic">Títulos</em>
          </motion.h2>
        </motion.div>

        {/* Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center gap-3 mb-10 pb-6 border-b border-white/5"
        >
          <button
            onClick={() => navigate('/')}
            className="text-[11px] uppercase tracking-[0.15em] px-6 py-2.5 rounded-sm transition-all duration-300 flex items-center gap-2 bg-white text-black font-bold"
          >
            Ver Todos <IconArrowRight size={12} />
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => navigate(`/categoria/${encodeURIComponent(cat)}`)}
              className="text-[11px] uppercase tracking-[0.15em] px-6 py-2.5 rounded-sm transition-all duration-300 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div 
          layout
          className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]"
        >
          <AnimatePresence mode="popLayout">
            {products.map((book: Product, i: number) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <BookCard book={book} index={i} />
              </motion.div>
            ))}

            {products.length > 0 && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: products.length * 0.05 }}
                className="relative border border-white/[0.08] bg-white/[0.02] p-8 flex flex-col justify-center items-center text-center group overflow-hidden h-full min-h-[400px]"
              >
                 <div className="mb-6 w-12 h-12 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/30 transition-all duration-500">
                    <IconMail size={20} />
                 </div>
                 <h3 className="[font-family:'Playfair_Display',serif] text-[20px] font-bold leading-tight mb-4">
                    Fique por dentro<br/><em className="not-italic text-white/50">das novidades</em>
                 </h3>
                 <p className="font-sans text-[12px] text-white/30 mb-8 leading-relaxed max-w-[200px]">
                    Receba notificações de novos ebooks e conteúdos exclusivos diretamente no seu e-mail.
                 </p>
                 <button
                    onClick={() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })}
                    className="font-sans text-[10px] tracking-[0.2em] uppercase text-white border-b border-white/20 pb-1 hover:border-white transition-all"
                 >
                    Inscrever-se agora
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {products.length === 0 && (
          <div className="py-20 text-center text-white/20 italic font-sans">
            Nenhum título encontrado.
          </div>
        )}
      </div>
    </section>
  );
}
