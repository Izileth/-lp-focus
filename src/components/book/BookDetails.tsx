import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IconArrowRight, IconShield, IconMail, IconBook, IconStar } from "../Icons";
import { fadeUpVariants, stagger } from "./variants";
import { useInteractions } from "../../hooks/useInteractions";

import type { Bonus } from "../../types";

interface BookDetailsType {
  id: string;
  category: string;
  name: string;
  rating: number;
  description?: string;
  pages?: string | number;
  language: string;
  checkout_url?: string;
  access_url?: string;
  bonuses?: Bonus[];
}

interface StatItemProps {
  label: string;
  value: string;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-1 px-6">
      <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-white/35">
        {label}
      </span>
      <span
        className="font-bold text-white"
        style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(17px,2vw,22px)" }}
      >
        {value}
      </span>
    </div>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-white/35 font-sans text-[11px] tracking-wide">
      <span className="text-white/25">{icon}</span>
      {label}
    </div>
  );
}

interface BookDetailsProps {
  book: BookDetailsType;
  formattedPrice: string;
  formattedDiscountPrice: string | null;
  hasDiscount: boolean;
}

export function BookDetails({ book, formattedPrice, formattedDiscountPrice, hasDiscount }: BookDetailsProps) {
  const { trackInteraction } = useInteractions();

  const handleCheckout = () => {
    trackInteraction('cta_click', book.id, {
      name: book.name,
      action: 'checkout_from_details'
    });
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="flex flex-col"
    >
      <motion.div variants={fadeUpVariants} custom={0} className="mb-4">
        <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/35 border-l-2 border-white/20 pl-3.5">
          {book.category}
        </span>
      </motion.div>

      <motion.h1
        variants={fadeUpVariants}
        custom={0.05}
        className="font-bold leading-[1.05] tracking-[-0.02em] mb-5"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(32px,4.5vw,58px)",
        }}
      >
        {book.name}
      </motion.h1>

      <motion.div
        variants={fadeUpVariants}
        custom={0.1}
        className="flex items-center gap-2 mb-6"
      >
        <div className="flex gap-0.5 text-white/70">
          {Array.from({ length: 5 }).map((_, i) => (
            <IconStar key={i} className={i < Math.floor(book.rating) ? "text-white/70" : "text-white/20"} />
          ))}
        </div>
        <span className="font-sans text-[11px] text-white/35 tracking-wide">
          {book.rating} · Verificado
        </span>
      </motion.div>

      <motion.p
        variants={fadeUpVariants}
        custom={0.15}
        className="font-sans font-light leading-[1.75] text-white/55 mb-8"
        style={{ fontSize: "clamp(14px,1.2vw,16px)" }}
      >
        {book.description ??
          "Um guia prático e direto ao ponto para quem busca evolução real. Conteúdo baseado em evidências, linguagem acessível e resultados aplicáveis desde a primeira leitura."}
      </motion.p>

      <motion.div
        variants={fadeUpVariants}
        custom={0.2}
        className="flex items-stretch divide-x divide-white/[0.08] border border-white/[0.08] mb-8"
      >
        <StatItem label="Páginas" value={book.pages ? String(book.pages) : "–"} />
        <StatItem label="Idioma" value={book.language} />
        <StatItem label="Formato" value="Digital" />
        <StatItem label="Entrega" value="Imediata" />
      </motion.div>

      {/* Bonuses Section */}
      {book.bonuses && book.bonuses.length > 0 && (
        <motion.div
          variants={fadeUpVariants}
          custom={0.22}
          className="mb-8 flex flex-col gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/35 border-l-2 border-white/20 pl-3">
              Bônus Inclusos
            </span>
            <div className="h-px bg-white/[0.08] flex-1" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {book.bonuses.map((bonus, index) => (
              <div 
                key={index}
                className="p-4 border border-white/[0.06] bg-white/[0.02] flex flex-col gap-1.5"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="font-sans text-[12px] font-bold text-white/90 uppercase tracking-wider">
                    {bonus.title}
                  </span>
                </div>
                <p className="font-sans text-[11px] leading-relaxed text-white/40">
                  {bonus.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        variants={fadeUpVariants}
        custom={0.25}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8"
      >
        <div className="flex flex-col">
          {hasDiscount && (
            <span className="font-sans text-[14px] text-white/30 line-through mb-1">
              {formattedPrice}
            </span>
          )}
          <span
            className="font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,3.5vw,44px)" }}
          >
            {hasDiscount ? formattedDiscountPrice : formattedPrice}
          </span>
        </div>

        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <motion.a
            href={book.checkout_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCheckout}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto bg-white text-black font-sans text-[13px] font-medium tracking-[0.1em] uppercase py-4 px-8 flex items-center justify-center gap-2 hover:bg-white/85 transition-colors duration-200"
          >
            Adquirir Agora
            <IconArrowRight />
          </motion.a>
          
          {book.access_url && (
            <Link
              to={book.access_url}
              className="font-sans text-[11px] tracking-[0.1em] uppercase text-white/40 hover:text-white transition-colors text-center"
            >
              Já possui? Acessar agora
            </Link>
          )}
        </div>
      </motion.div>

      <motion.div
        variants={fadeUpVariants}
        custom={0.3}
        className="flex flex-wrap gap-5 pt-6 border-t border-white/[0.06]"
      >
        <TrustBadge icon={<IconShield />} label="Pagamento seguro" />
        <TrustBadge icon={<IconMail />} label="Enviado por e-mail" />
        <TrustBadge icon={<IconBook />} label="Acesso vitalício" />
        <TrustBadge icon={<IconStar />} label="Satisfação garantida" />
      </motion.div>
    </motion.div>
  );
}
