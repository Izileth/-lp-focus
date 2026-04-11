// src/components/BookCard.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { cardVariants } from "../motionVariants";
import { IconBook, IconArrowRight, IconStar, IconMoreHorizontal, IconX, IconGift, IconVideo, IconMail, IconVerified } from "./Icons";
import { BookCarousel } from "./book/BookCarousel";
import type { Product } from "../types";

interface BookCardProps {
  book: Product;
  index: number;
}

export function BookCard({ book, index }: BookCardProps) {
  const navigate = useNavigate();
  const [showBonuses, setShowBonuses] = useState(false);

  const handleCardClick = () => {
    navigate(`/livros/${book.slug}`);
  };

  const handleNavigateBookId = () => {
    navigate(`/livros/${book.slug}`, { state: { category: book.category } });
  }

  const handleCheckout = () => {
    if (book.video_url) {
      navigate('/video-promotion', {
        state: {
          videoUrl: book.video_url,
          checkoutUrl: book.checkout_url,
          bookName: book.name
        }
      });
    } else if (book.checkout_url) {
      window.location.href = book.checkout_url;
    }
  };

  const toggleBonuses = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBonuses(!showBonuses);
  };

  const hasDiscount = book.discount_price && book.discount_price > 0 && book.discount_price < book.price;
  const hasBonuses = book.bonuses && book.bonuses.length > 0;

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -6, borderColor: "rgba(255,255,255,0.28)" }}
      className="relative border rounded-2xl border-white/[0.08] bg-[#000] p-8 cursor-pointer group overflow-hidden"
      style={{ transition: "border-color 0.25s" }}
      onClick={handleCardClick}
    >
      {book.badge !== null && (
        <span className="absolute top-5 left-5 bg-white text-black font-sans text-[10px] tracking-[0.15em] uppercase px-2.5 py-0.5 z-10">
          {book.badge}
        </span>
      )}

      {hasBonuses && (
        <button
          onClick={toggleBonuses}
          className="absolute top-5 right-5 z-20 w-8 h-8 flex items-center justify-center border border-white/10 bg-black/40 backdrop-blur-md text-white/50 hover:text-white hover:border-white/30 transition-all rounded-full"
          title="Ver bônus"
        >
          <IconMoreHorizontal size={16} />
        </button>
      )}

      {/* Bonus Overlay */}
      <AnimatePresence>
        {showBonuses && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 z-30 bg-black/95 backdrop-blur-xl p-8 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <IconGift className="text-white/40" size={14} />
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40">Bônus Exclusivos</span>
              </div>
              <button
                onClick={toggleBonuses}
                className="text-white/20 hover:text-white transition-colors"
              >
                <IconX size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 pr-2">
              {book.bonuses?.map((bonus, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <h4 className="font-sans text-[12px] font-bold text-white tracking-wide uppercase">{bonus.title}</h4>
                  <p className="font-sans text-[11px] leading-relaxed text-white/40">{bonus.description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleCardClick}
              className="mt-6 font-sans text-[10px] tracking-[0.15em] uppercase text-white/30 hover:text-white flex items-center gap-2 transition-colors border-t border-white/10 pt-4"
            >
              Ver detalhes completos <IconArrowRight size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cover */}
      <div className="relative w-full aspect-[3/4] mb-6 overflow-hidden">
        <BookCarousel
          images={book.product_images}
          name={book.name}
          category={book.category}
          showBadge={false}
          showDecorations={false}
          showDots={false}
          className="w-full h-full"
        />

        {/* Badge Offer */}
        <div className="absolute top-2 right-4 z-10 bg-emerald-500 text-white font-sans text-[9px] tracking-[0.15em] uppercase px-2 py-0.5">
          30% OFF
        </div>


        {/* Subtle category watermark + Rating */}
        <div className="absolute bottom-4 right-2 z-10 flex items-center gap-2 pointer-events-none">
          <Link
            to={`/categoria/${encodeURIComponent(book.category)}`}
            onClick={(e) => e.stopPropagation()}
            className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40 bg-black/40 px-2 py-0.5 backdrop-blur-sm pointer-events-auto hover:text-white transition-colors"
          >
            {book.category}
          </Link>
          <span className="font-sans text-[9px] tracking-[0.1em] text-white/60 bg-black/40 px-2 py-0.5 backdrop-blur-sm flex items-center gap-1">
            <IconStar size={10} /> {book.rating}
          </span>
        </div>

        {book.video_url && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
            <IconVideo size={20} />
          </div>
        )}
      </div>

      <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-white/40 mb-2 flex items-center gap-1.5">
        <span className="text-white/25"><IconBook /></span>
        <Link
          to={`/categoria/${encodeURIComponent(book.category)}`}
          onClick={(e) => e.stopPropagation()}
          className="hover:text-white transition-colors"
        >
          {book.category}
        </Link>
      </p>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <IconStar 
              key={i} 
              size={10} 
              className={i < Math.floor(book.rating || 5) ? "text-emerald-500" : "text-white/10"} 
            />
          ))}
        </div>
        <span className="text-[10px] text-white/30 font-sans tracking-wider font-medium mt-0.5">
          {book.rating?.toFixed(1) || "5.0"}
        </span>
      </div>

      <h3 className="[font-family:'Playfair_Display',serif] text-[18px] font-bold leading-[1.25] mb-4 h-[2.5em] line-clamp-2 flex items-center gap-2">
        {book.name}
        <IconVerified size={16} className="flex-shrink-0 mt-1" />
      </h3>

      <div className="flex items-center justify-between mb-5">
        <span className="font-sans text-[11px] text-white/35 tracking-wide">{book.pages} páginas</span>
        <div className="flex flex-col items-end">
          {hasDiscount ? (
            <>
              <span className="font-sans text-[10px] text-white/20 line-through">R${book.price} BRL</span>
              <span className="[font-family:'Playfair_Display',serif] text-lg font-bold text-white">R${book.discount_price} BRL</span>
            </>
          ) : (
            <span className="[font-family:'Playfair_Display',serif] text-lg font-bold">R${book.price} BRL</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full 3 bg-emerald-500 text-white font-sans text-[12px] font-medium tracking-[0.1em] uppercase py-3 flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-emerald-600"
          onClick={(e) => {
            e.stopPropagation();
            handleCheckout();
          }}
        >
          Adquirir
          <IconArrowRight />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white text-black font-sans text-[12px] font-medium tracking-[0.1em] uppercase py-3 flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-white/85"
          onClick={handleNavigateBookId}
        >
          Detalhes
          <IconArrowRight />
        </motion.button>

      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="w-full mt-4 font-sans text-[10px] tracking-[0.15em] uppercase text-white/30 hover:text-white flex items-center justify-center gap-2 transition-colors py-2 border border-white/0 hover:border-white/10"
      >
        <IconMail size={12} />
        Novidades por e-mail
      </button>
    </motion.article>
  );
}
