// src/components/book/BookCarousel.tsx
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants, PanInfo } from "framer-motion";
import { IconChevronLeft, IconChevronRight } from "../Icons";
import type { ProductImage } from "../../types";

interface BookCarouselProps {
  images: ProductImage[];
  name: string;
  category: string;
  badge?: string | null;
  showBadge?: boolean;
  showDots?: boolean;
  showThumbnailNav?: boolean;
  showDecorations?: boolean;
  className?: string;
}

type Direction = -1 | 1;

const SWIPE_THRESHOLD = 8_000;
const AUTOPLAY_DELAY_MS = 4_500;

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98, x: -10 },
  visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const slideVariants: Variants = {
  enter: (dir: Direction) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1, zIndex: 1, transition: { x: { type: "spring", stiffness: 320, damping: 32 }, opacity: { duration: 0.2 } } },
  exit: (dir: Direction) => ({ x: dir < 0 ? "100%" : "-100%", opacity: 0, zIndex: 0, transition: { x: { type: "spring", stiffness: 320, damping: 32 }, opacity: { duration: 0.2 } } }),
};

function swipePower(offset: number, velocity: number): number {
  return Math.abs(offset) * Math.abs(velocity);
}

function wrap(index: number, length: number): number {
  return ((index % length) + length) % length;
}

function CarouselPlaceholder({ category, className }: { category: string, className?: string }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`relative aspect-[3/4] w-full max-w-sm mx-auto border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.01] flex flex-col items-center justify-center gap-3 overflow-hidden ${className}`}
    >
      <span className="relative z-10 font-black text-white/[0.08] select-none" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(60px,10vw,100px)" }}>F</span>
      <span className="relative z-10 font-sans text-[10px] tracking-[0.22em] uppercase text-white/20">{category}</span>
    </motion.div>
  );
}

interface NavButtonProps {
  side: "left" | "right";
  visible: boolean;
  onClick: (e: React.MouseEvent) => void;
}

function NavButton({ side, visible, onClick }: NavButtonProps) {
  const isLeft = side === "left";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={isLeft ? "Imagem anterior" : "Próxima imagem"}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : (isLeft ? -4 : 4) }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={[
        "absolute top-1/2 -translate-y-1/2 z-20 w-8 h-8",
        "border border-white/[0.14] bg-black/40 backdrop-blur-sm",
        "flex items-center justify-center text-white/55 hover:text-white hover:border-white/30",
        "transition-colors duration-200",
        isLeft ? "left-2" : "right-2",
        !visible && "pointer-events-none"
      ].join(" ")}
    >
      {isLeft ? <IconChevronLeft size={14} /> : <IconChevronRight size={14} />}
    </motion.button>
  );
}

export function BookCarousel({
  images,
  name,
  category,
  badge,
  showBadge = true,
  showDots = true,
  showThumbnailNav = true,
  showDecorations = true,
  className = ""
}: BookCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<Direction>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasImages = images && images.length > 0;
  const hasMultiple = images && images.length > 1;

  const paginate = useCallback((dir: Direction, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(dir);
    setCurrentIndex((prev) => wrap(prev + dir, images.length));
  }, [images]);

  const goTo = useCallback((index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const dir: Direction = index > currentIndex ? 1 : -1;
    setDirection(dir);
    setCurrentIndex(index);
  }, [currentIndex]);

  useEffect(() => {
    if (!hasMultiple || isPaused || isHovered) return;
    timerRef.current = setTimeout(() => paginate(1), AUTOPLAY_DELAY_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [currentIndex, hasMultiple, isPaused, isHovered, paginate]);

  const handleDragEnd = useCallback((e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const power = swipePower(offset.x, velocity.x);
    if (power < -SWIPE_THRESHOLD) paginate(1);
    else if (power > SWIPE_THRESHOLD) paginate(-1);
  }, [paginate]);

  if (!hasImages) return <CarouselPlaceholder category={category} className={className} />;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`relative group select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPaused(false); }}
    >
      <AnimatePresence>
        {badge && showBadge && (
          <motion.span
            key="badge"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -top-3 -right-3 z-20 bg-white text-black font-sans text-[10px] font-medium tracking-[0.15em] uppercase px-3 py-1 pointer-events-none"
          >
            {badge}
          </motion.span>
        )}
      </AnimatePresence>

      <div role="region" aria-label={`Galeria: ${name}`} aria-live="polite" className="relative aspect-[3/4] w-full max-w-sm mx-auto border border-white/[0.08] overflow-hidden bg-black">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={currentIndex}
            src={images[currentIndex].image_url}
            alt={`${name} - imagem ${currentIndex + 1} de ${images.length}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag={hasMultiple ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragStart={() => setIsPaused(true)}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
          />
        </AnimatePresence>

        <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/65 to-transparent pointer-events-none z-10" />

        {hasMultiple && (
          <div className="absolute bottom-3.5 left-4 z-20">
            <span className="font-sans text-[9px] tracking-[0.18em] text-white/45 tabular-nums">
              {String(currentIndex + 1).padStart(2, "0")}
              <span className="text-white/20 mx-1">/</span>
              {String(images.length).padStart(2, "0")}
            </span>
          </div>
        )}

        {hasMultiple && (
          <>
            <NavButton side="left" visible={isHovered} onClick={(e) => { setIsPaused(true); paginate(-1, e); }} />
            <NavButton side="right" visible={isHovered} onClick={(e) => { setIsPaused(true); paginate(1, e); }} />
          </>
        )}
      </div>

      {hasMultiple && showDots && (
        <div role="tablist" aria-label="Selecionar imagem" className="flex items-center justify-center gap-1.5 mt-4">
          {images.map((_, i) => {
            const isActive = i === currentIndex;
            return (
              <motion.button
                key={i}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Imagem ${i + 1}`}
                onClick={(e) => { setIsPaused(true); goTo(i, e); }}
                animate={{
                  width: isActive ? 24 : 6,
                  backgroundColor: isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.18)",
                }}
                whileHover={isActive ? {} : { backgroundColor: "rgba(255,255,255,0.4)" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="h-px"
              />
            );
          })}
        </div>
      )}

      {hasMultiple && showThumbnailNav && images.length >= 4 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex gap-2 mt-4 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {images.map((img, i) => {
            const isActive = i === currentIndex;
            return (
              <motion.button
                key={i}
                type="button"
                aria-label={`Miniatura ${i + 1}`}
                onClick={(e) => { setIsPaused(true); goTo(i, e); }}
                animate={{
                  borderColor: isActive ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.08)",
                  opacity: isActive ? 1 : 0.45,
                }}
                whileHover={{ opacity: 0.85 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 w-10 h-14 border border-white/10 overflow-hidden"
              >
                <img src={img.image_url} alt={`Miniatura ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
              </motion.button>
            );
          })}
        </motion.div>
      )}

      {showDecorations && (
        <>
          <div aria-hidden="true" className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full border border-white/[0.04] pointer-events-none -z-10" />
          <div aria-hidden="true" className="absolute -bottom-12 -right-12 w-72 h-72 rounded-full border border-white/[0.02] pointer-events-none -z-10" />
        </>
      )}
    </motion.div>
  );
}
