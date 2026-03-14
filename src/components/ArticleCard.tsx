// src/components/ArticleCard.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IconArrowRight, IconClock } from "./Icons";
import type { Article } from "../types";

interface ArticleCardProps {
  article: Article;
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/artigo/${article.slug}`} className="block no-underline">
        <div className="relative aspect-[16/10] overflow-hidden mb-6 border border-white/5 bg-white/[0.02]">
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70">
              {article.category}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.15em] text-white/30 font-sans">
            <span>{article.published_at}</span>
            <span className="flex items-center gap-1.5">
              <IconClock size={12} /> {article.reading_time}
            </span>
          </div>

          <h3 className="[font-family:'Playfair_Display',serif] text-xl md:text-2xl font-bold text-white group-hover:text-white/80 transition-colors leading-tight">
            {article.title}
          </h3>

          <p className="font-sans text-[13px] text-white/40 leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>

          <div className="pt-2">
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
              Ler Artigo <IconArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
