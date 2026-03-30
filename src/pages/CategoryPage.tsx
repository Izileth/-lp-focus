// src/pages/CategoryPage.tsx
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BookCard } from "../components/BookCard";
import { useProducts } from "../hooks/useProducts";
import { LoadingState, ErrorState } from "../components/ui/StatesScreens";
import { IconBook } from "../components/Icons";
import { fadeUpVariants, staggerContainer } from "../motionVariants";
import type { Product } from "../types";

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  
  const decodedCategory = categorySlug ? decodeURIComponent(categorySlug) : "";
  const { products, loading, error } = useProducts(decodedCategory);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <main className="pt-[120px] pb-[100px]">
      <section className="px-10">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-16"
          >
            <motion.p
              variants={fadeUpVariants}
              className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/30 mb-3 flex items-center gap-2"
            >
              <span className="text-white/20"><IconBook /></span>
              Categoria
            </motion.p>
            <motion.h1
              variants={fadeUpVariants}
              className="[font-family:'Playfair_Display',serif] font-bold leading-[1.1]"
              style={{ fontSize: "clamp(32px,5vw,56px)" }}
            >
              Explorar
              <br />
              <em className="not-italic capitalize">{decodedCategory || "Todas"}</em>
            </motion.h1>
          </motion.div>

          {products.length === 0 ? (
            <div className="py-20 text-center text-white/40 font-sans italic text-lg border border-dashed border-white/10 rounded-xl">
              Nenhum e-book encontrado nesta categoria.
            </div>
          ) : (
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
              {products.map((book: Product, i: number) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
