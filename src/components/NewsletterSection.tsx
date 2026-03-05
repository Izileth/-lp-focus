import { useState, useCallback } from "react";
import type { FormEvent } from "react";
import { motion,  AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { IconMail, IconArrowRight, IconCheck, IconLoader, IconAlertCircle } from "./Icons";
import { useNewsletter } from "../hooks/useNewsletter";

// ─── Variants ─────────────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};

// ─── Component ────────────────────────────────────────────────────────────────

const NewsletterSection = () => {
  const [email, setEmail]       = useState<string>("");
  const { subscribe, loading, error, submitted } = useNewsletter();
  const [focused, setFocused]   = useState<boolean>(false);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await subscribe(email);
  }, [email, subscribe]);

  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className="relative overflow-hidden border-y border-white/[0.06] py-24 px-8 md:px-16"
    >
      {/* Noise overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_50%_50%,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none"
      />

      {/* Decorative vertical line */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.07] to-transparent pointer-events-none"
      />

      <div className="relative max-w-[600px] mx-auto text-center">

        {/* Icon */}
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center justify-center w-11 h-11 border border-white/[0.12] text-white/40 mb-8 mx-auto"
        >
          <IconMail size={18} />
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          variants={fadeUp}
          className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/35 mb-4"
        >
          Newsletter
        </motion.p>

        {/* Headline */}
        <motion.h2
          variants={fadeUp}
          className="[font-family:'Playfair_Display',serif] font-bold leading-[1.08] tracking-[-0.02em] mb-5"
          style={{ fontSize: "clamp(28px,4vw,48px)" }}
        >
          Conhecimento direto
          <br />
          <em className="not-italic text-white/65">na sua caixa de entrada.</em>
        </motion.h2>

        {/* Body */}
        <motion.p
          variants={fadeUp}
          className="font-sans font-light leading-[1.7] text-white/45 mb-10"
          style={{ fontSize: "clamp(14px,1.1vw,16px)" }}
        >
          Receba novidades, lançamentos e conteúdos exclusivos.
          Sem spam. Cancele quando quiser.
        </motion.p>

        {/* Form / Success */}
        <motion.div variants={fadeUp}>
          <AnimatePresence mode="wait">
            {submitted ? (
              /* ── Success state ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-3"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-white text-black">
                  <IconCheck size={18} />
                </div>
                <p
                  className="[font-family:'Playfair_Display',serif] font-bold text-white"
                  style={{ fontSize: "clamp(16px,1.5vw,20px)" }}
                >
                  Inscrição confirmada!
                </p>
                <p className="font-sans text-[13px] text-white/40 tracking-wide">
                  Em breve você receberá nossos conteúdos.
                </p>
              </motion.div>
            ) : (
              /* ── Input form ── */
              <div className="flex flex-col gap-4">
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-stretch gap-0 w-full max-w-[460px] mx-auto"
                >
                  {/* Input */}
                  <div
                    className="relative flex-1 border border-white/[0.12] transition-[border-color] duration-200"
                    style={{ borderColor: focused ? "rgba(255,255,255,0.35)" : undefined }}
                  >
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none">
                      <IconMail size={15} />
                    </span>
                    <input
                      type="email"
                      required
                      disabled={loading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="Seu melhor e-mail"
                      className="w-full h-full bg-transparent text-white placeholder-white/25 font-sans text-[13px] tracking-wide py-4 pl-10 pr-4 outline-none disabled:opacity-50"
                    />
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={loading ? {} : { scale: 1.02 }}
                    whileTap={loading ? {} : { scale: 0.97 }}
                    className="bg-white text-black font-sans text-[12px] font-medium tracking-[0.1em] uppercase px-7 py-4 flex items-center justify-center gap-2 hover:bg-white/85 transition-colors duration-200 whitespace-nowrap disabled:opacity-50"
                  >
                    {loading ? (
                      <><IconLoader size={14} className="animate-spin" /> Processando...</>
                    ) : (
                      <>Inscrever-se <IconArrowRight size={14} /></>
                    )}
                  </motion.button>
                </motion.form>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-center justify-center gap-2 text-red-500/80 font-sans text-[12px] tracking-wide"
                    >
                      <IconAlertCircle size={14} />
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Fine print */}
        {!submitted && (
          <motion.p
            variants={fadeUp}
            className="font-sans text-[10px] tracking-[0.1em] uppercase text-white/20 mt-5"
          >
            Sem spam · Cancele a qualquer momento
          </motion.p>
        )}
      </div>
    </motion.section>
  );
};

export default NewsletterSection;

