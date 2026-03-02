// src/components/BookCard.tsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { cardVariants } from "../motionVariants";
import { IconBook, IconArrowRight, IconStar } from "./Icons";
import { BookCarousel } from "./book/BookCarousel";
interface BookCardProps {
  book: Product;
  index: number;
}

export function BookCard({ book, index }: BookCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/ebook/${book.id}`);
  };

  const handleCheckout = () => {
    if (book.checkout_url) {
      window.location.href = book.checkout_url;
    }
  };

  const imageUrl = book.product_images?.[0]?.image_url || '/placeholder.jpg'; // Use a placeholder if no image

  const hasDiscount = book.discount_price && book.discount_price > 0 && book.discount_price < book.price;

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -6, borderColor: "rgba(255,255,255,0.28)" }}
      className="relative border border-white/[0.08] bg-[#000] p-8 cursor-pointer group"
      style={{ transition: "border-color 0.25s" }}
      onClick={handleCardClick}
    >
      {book.badge !== null && (
        <span className="absolute top-5 right-5 bg-white text-black font-sans text-[10px] tracking-[0.15em] uppercase px-2.5 py-0.5 z-10">
          {book.badge}
        </span>
      )}

      {/* Cover */}
      <div className="relative w-full aspect-[3/4] mb-6 overflow-hidden">
        <BookCarousel 
          images={book.product_images}
          name={book.name}
          category={book.category}
          showBadge={false}
          showDecorations={false}
          showThumbnailNav={false}
          showDots={false}
          className="w-full h-full"
        />
        
        {/* Subtle category watermark + Rating */}
        <div className="absolute bottom-4 left-4 z-50 flex items-center gap-2 pointer-events-none">
          <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40 bg-black/40 px-2 py-0.5 backdrop-blur-sm">
            {book.category}
          </span>
          <span className="font-sans text-[9px] tracking-[0.1em] text-white/60 bg-black/40 px-2 py-0.5 backdrop-blur-sm flex items-center gap-1">
            <IconStar size={10} /> {book.rating}
          </span>
        </div>
      </div>

      <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-white/40 mb-2 flex items-center gap-1.5">
        <span className="text-white/25"><IconBook /></span>
        {book.category}
      </p>
      <h3 className="[font-family:'Playfair_Display',serif] text-[18px] font-bold leading-[1.25] mb-4">
        {book.name}
      </h3>

      <div className="flex items-center justify-between mb-5">
        <span className="font-sans text-[11px] text-white/35 tracking-wide">{book.pages} páginas</span>
        <div className="flex flex-col items-end">
          {hasDiscount ? (
            <>
              <span className="font-sans text-[10px] text-white/20 line-through">R${book.price}</span>
              <span className="[font-family:'Playfair_Display',serif] text-lg font-bold text-white">R${book.discount_price}</span>
            </>
          ) : (
            <span className="[font-family:'Playfair_Display',serif] text-lg font-bold">R${book.price}</span>
          )}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-white text-black font-sans text-[12px] font-medium tracking-[0.1em] uppercase py-3 flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-white/85"
        onClick={(e) => {
          e.stopPropagation();
          handleCheckout();
        }}
      >
        Adquirir
        <IconArrowRight />
      </motion.button>
    </motion.article>
  );
}
