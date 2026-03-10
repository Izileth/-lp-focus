// src/components/BooksSection.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { fadeUpVariants, staggerContainer } from "../motionVariants";
import { IconBook, IconArrowRight } from "./Icons";
import { BookCard } from "./BookCard";
import { useProducts } from "../hooks/useProducts";
import { LoadingState, ErrorState } from "./ui/StatesScreens";
import type { Product } from "../types";

export function BooksSection() {
  const { products, loading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error}/>;
  }

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  // Filter products based on selection
  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products;

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
            onClick={() => setSelectedCategory(null)}
            className={`text-[11px] uppercase tracking-[0.15em] px-6 py-2.5 transition-all duration-300 flex items-center gap-2 ${
              selectedCategory === null 
              ? "bg-white text-black font-bold" 
              : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
            }`}
          >
            Ver Todos {selectedCategory === null && <IconArrowRight size={12} />}
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[11px] uppercase tracking-[0.15em] px-6 py-2.5 transition-all duration-300 ${
                selectedCategory === cat 
                ? "bg-white text-black font-bold" 
                : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
              }`}
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
            {filteredProducts.map((book: Product, i: number) => (
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
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center text-white/20 italic font-sans">
            Nenhum título encontrado nesta categoria.
          </div>
        )}
      </div>
    </section>
  );
}
