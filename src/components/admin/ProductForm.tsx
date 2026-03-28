// src/components/admin/ProductForm.tsx
import { useState, useCallback } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useCreateProduct, useUpdateProduct } from "../../hooks/useProductMutations";
import { ImageUpload } from "../ui/ImageUpload";
import {
  IconLoader,
  IconArrowRight,
  IconAlertCircle,
  IconCheck,
  IconFileText,
  IconTag,
  IconBook,
  IconX,
  IconPlus,
  IconInfo,
} from "../Icons";
import type { Product, Bonus } from "../../types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  discount_price: string;
  slug: string;
  language: string;
  rating: string;
  category: string;
  badge: string;
  pages: string;
  image_urls: string[];
  checkout_url: string;
  access_url: string;
  share_url: string;
  video_url: string;
  bonuses: Bonus[];
  subtitle: string;
  author_note: string;
  author_note_limit: string;
  is_featured: boolean;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildInitialFormData(product?: Product): FormData {
  return {
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    discount_price: product?.discount_price?.toString() ?? "",
    slug: product?.slug ?? "",
    language: product?.language ?? "Português",
    rating: product?.rating?.toString() ?? "5.0",
    category: product?.category ?? "",
    badge: product?.badge ?? "",
    pages: product?.pages ?? "",
    image_urls: product
      ? product.product_images.map((img) => img.image_url)
      : [],
    checkout_url: product?.checkout_url ?? "",
    access_url: product?.access_url ?? "",
    share_url: product?.share_url ?? "",
    video_url: product?.video_url ?? "",
    bonuses: product?.bonuses ?? [],
    subtitle: product?.subtitle ?? "",
    author_note: product?.author_note ?? "",
    author_note_limit: product?.author_note_limit?.toString() ?? "500",
    is_featured: product?.is_featured ?? false,
  };
}

// ─── Motion Variants ──────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const bannerVariants: Variants = {
  hidden: { opacity: 0, height: 0, y: -6 },
  visible: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, height: 0, y: -4, transition: { duration: 0.22 } },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  icon?: React.ReactNode;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, icon, hint, required, children }: FieldProps) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col gap-2">
      <label className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/40 font-medium flex items-center gap-1.5">
        {icon && <span className="text-white/25">{icon}</span>}
        {label}
        {required && <span className="text-white/20 ml-0.5">*</span>}
      </label>
      <div className="relative border border-white/[0.1] transition-[border-color] duration-200 focus-within:border-white/30">
        {children}
      </div>
      {hint && (
        <p className="font-sans text-[10px] italic text-white/20 leading-relaxed">{hint}</p>
      )}
    </motion.div>
  );
}

// Price field with currency prefix
interface PriceFieldProps {
  value: string;
  onChange: (v: string) => void;
}

function PriceField({ value, onChange }: PriceFieldProps) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col gap-2">
      <label className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/40 font-medium">
        Preço <span className="text-white/20">*</span>
      </label>
      <div className="relative flex items-center border border-white/[0.1] transition-[border-color] duration-200 focus-within:border-white/30">
        <span className="absolute left-4 font-sans text-[12px] text-white/30 pointer-events-none select-none">
          R$
        </span>
        <input
          type="text"
          name="price"
          value={value}
          required
          inputMode="decimal"
          onChange={(e) => {
            const val = e.target.value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
            // Prevent multiple dots
            if ((val.match(/\./g) || []).length <= 1) {
              onChange(val);
            }
          }}
          className="w-full bg-transparent py-4 pl-10 pr-4 font-sans text-[13px] text-white outline-none tabular-nums"
        />
      </div>
    </motion.div>
  );
}

// Status banner
interface BannerProps {
  status: "success" | "error";
  message: string;
  onDismiss?: () => void;
}

function Banner({ status, message, onDismiss }: BannerProps) {
  const isSuccess = status === "success";
  return (
    <motion.div
      variants={bannerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="overflow-hidden"
    >
      <div className="flex items-start gap-3 border border-white/[0.1] px-4 py-3">
        <span className="text-white/50 mt-0.5 shrink-0">
          {isSuccess ? <IconCheck size={14} /> : <IconAlertCircle size={14} />}
        </span>
        <p className="font-sans text-[12px] leading-[1.55] text-white/55 flex-1">
          {message}
        </p>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Fechar"
            className="text-white/25 hover:text-white/55 transition-colors shrink-0 mt-0.5"
          >
            <IconX size={13} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── ProductForm ──────────────────────────────────────────────────────────────

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const isEditing = product !== undefined;

  // Stable initial data — only computed once during initial render
  const [formData, setFormData] = useState<FormData>(() => buildInitialFormData(product));

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { createProduct, loading: createLoading } = useCreateProduct();
  const { updateProduct, loading: updateLoading } = useUpdateProduct();
  const loading = createLoading || updateLoading;

  // ── Generic text/textarea field handler ──────────────────────────────────
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // ── Price handler (separate to keep type safety) ──────────────────────────
  const handlePriceChange = useCallback((v: string) => {
    setFormData((prev) => ({ ...prev, price: v }));
  }, []);

  // ── Image upload ──────────────────────────────────────────────────────────
  const handleImageUpload = useCallback((urls: string[]) => {
    setFormData((prev) => ({ ...prev, image_urls: urls }));
  }, []);

  // ── Bonus management ────────────────────────────────────────────────────
  const addBonus = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      bonuses: [...prev.bonuses, { title: "", description: "", icon: "" }],
    }));
  }, []);

  const removeBonus = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      bonuses: prev.bonuses.filter((_, i) => i !== index),
    }));
  }, []);

  const handleBonusChange = useCallback((index: number, field: keyof Bonus, value: string) => {
    setFormData((prev) => ({
      ...prev,
      bonuses: prev.bonuses.map((bonus, i) =>
        i === index ? { ...bonus, [field]: value } : bonus
      ),
    }));
  }, []);

  // ── Dismiss banner ────────────────────────────────────────────────────────
  const dismissBanner = useCallback(() => {
    setSubmitStatus("idle");
    setErrorMsg(null);
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setSubmitStatus("loading");
      setErrorMsg(null);

      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : undefined,
        rating: parseFloat(formData.rating) || 0,
        author_note_limit: parseInt(formData.author_note_limit) || 500,
        bonuses: formData.bonuses.filter(b => b.title.trim() !== "") // Filter out empty bonuses
      };

      let result: { error?: { message: string } | null } | null | undefined;

      if (isEditing && product) {
        result = await updateProduct(product.id, productData as any);
      } else {
        result = await createProduct(productData);
      }

      if (result && result.error) {
        setErrorMsg(result.error.message);
        setSubmitStatus("error");
        return;
      }

      setSubmitStatus("success");
      setTimeout(() => {
        setSubmitStatus("idle");
        onSuccess();
      }, 1500);
    },
    [formData, isEditing, product, createProduct, updateProduct, onSuccess]
  );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit}>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

          {/* ── Left: Basic Info ──────────────────────────────────────── */}
          <motion.div variants={stagger} className="flex flex-col gap-6">

            {/* Section eyebrow */}
            <motion.div variants={fadeUp}>
              <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/25 border-l-2 border-white/15 pl-3">
                Informações básicas
              </span>
            </motion.div>

            {/* Name */}
            <Field label="Nome do produto" icon={<IconTag size={12} />} required>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Guia Mestre de Design"
                required
                className="w-full bg-transparent py-4 px-4 font-sans text-[13px] text-white placeholder-white/20 outline-none"
              />
            </Field>

            {/* Subtitle */}
            <Field label="Subtítulo" icon={<IconTag size={12} />}>
              <input
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Ex: O guia definitivo para o sucesso"
                className="w-full bg-transparent py-4 px-4 font-sans text-[13px] text-white placeholder-white/20 outline-none"
              />
            </Field>

            {/* Author Note */}
            <Field 
              label="Nota do Autor" 
              icon={<IconFileText size={12} />} 
              hint={`Limite de ${formData.author_note_limit} caracteres.`}
            >
              <textarea
                name="author_note"
                value={formData.author_note}
                onChange={handleChange}
                rows={3}
                maxLength={parseInt(formData.author_note_limit)}
                placeholder="Uma nota pessoal do autor sobre o livro..."
                className="w-full bg-transparent py-4 px-4 font-sans text-[13px] text-white placeholder-white/20 outline-none resize-none leading-relaxed"
              />
              <div className="absolute bottom-2 right-4 text-[9px] text-white/20 font-sans">
                {formData.author_note.length} / {formData.author_note_limit}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Limite da Nota" icon={<IconTag size={12} />}>
                <input
                  type="number"
                  name="author_note_limit"
                  value={formData.author_note_limit}
                  onChange={handleChange}
                  placeholder="500"
                  className="w-full bg-transparent py-4 px-4 font-sans text-[13px] text-white placeholder-white/20 outline-none"
                />
              </Field>
              <motion.div variants={fadeUp} className="flex flex-col gap-2">
                <label className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/40 font-medium">
                  Destaque
                </label>
                <div className="flex items-center h-[53px] px-4 border border-white/[0.1]">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4 bg-transparent border-white/20 rounded-sm outline-none cursor-pointer"
                  />
                  <span className="ml-3 font-sans text-[11px] text-white/40">Produto em destaque</span>
                </div>
              </motion.div>
            </div>

            {/* Description */}
            <Field label="Descrição" icon={<IconFileText size={12} />} required>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Descreva o que torna este ebook especial..."
                required
                className="w-full bg-transparent py-4 px-4 font-sans text-[13px] text-white placeholder-white/20 outline-none resize-none leading-relaxed"
              />
            </Field>

            {/* Price + Discount Price */}
            <div className="grid grid-cols-2 gap-4">
              <PriceField
                value={formData.price}
                onChange={handlePriceChange}
              />
              <motion.div variants={fadeUp} className="flex flex-col gap-2">
                <label className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/40 font-medium">
                  Preço com Desconto
                </label>
                <div className="relative flex items-center border border-white/[0.1] transition-[border-color] duration-200 focus-within:border-white/30">
                  <span className="absolute left-4 font-sans text-[12px] text-white/30 pointer-events-none select-none">
                    R$
                  </span>
                  <input
                    type="text"
                    name="discount_price"
                    value={formData.discount_price}
                    inputMode="decimal"
                    onChange={(e) => {
                      const val = e.target.value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
                      if ((val.match(/\./g) || []).length <= 1) {
                        setFormData(prev => ({ ...prev, discount_price: val }));
                      }
                    }}
                    className="w-full bg-transparent py-4 pl-10 pr-4 font-sans text-[13px] text-white outline-none tabular-nums"
                  />
                </div>
              </motion.div>
            </div>

            {/* Slug + Language */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Slug" icon={<IconTag size={12} />} hint="Opcional. Auto-gerado se vazio.">
                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="guia-design"
                  className="w-full bg-transparent py-4 px-4 font-sans text-[13px] text-white placeholder-white/20 outline-none"
                />
              </Field>
              <Field label="Idioma" icon={<IconBook size={12} />} required>
                <input
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="Português"
                  required
                  className="w-full bg-transparent py-4 px-4 font-sans text-[13px] text-white placeholder-white/20 outline-none"
                />
              </Field>
            </div>

            {/* Links Section */}
            <motion.div variants={fadeUp} className="mt-2">
              <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/25 border-l-2 border-white/15 pl-3">
                Links do Produto
              </span>
            </motion.div>

            <Field label="Link de Checkout (Compra)" icon={<IconArrowRight size={12} />}>
              <input
                name="checkout_url"
                value={formData.checkout_url}
                onChange={handleChange}
                placeholder="https://pay.hotmart.com/..."
                className="w-full bg-transparent py-4 px-4 font-sans text-[13px] text-white placeholder-white/20 outline-none"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Link de Acesso">
                <input
                  name="access_url"
                  value={formData.access_url}
                  onChange={handleChange}
                  placeholder="https://area-membros.com/..."
                  className="w-full bg-transparent py-4 px-4 font-sans text-[13px] text-white placeholder-white/20 outline-none"
                />
              </Field>
              <Field label="Link de Compartilhamento">
                <input
                  name="share_url"
                  value={formData.share_url}
                  onChange={handleChange}
                  placeholder="https://lp-ebook.com/p/guia"
                  className="w-full bg-transparent py-4 px-4 font-sans text-[13px] text-white placeholder-white/20 outline-none"
                />
              </Field>
            </div>

            <Field label="URL do Vídeo Profissional" hint="Link do YouTube, Vimeo ou MP4 direto.">
              <input
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-transparent py-4 px-4 font-sans text-[13px] text-white placeholder-white/20 outline-none"
              />
            </Field>

            {/* Bonuses Section */}
            <motion.div variants={fadeUp} className="mt-6 flex items-center justify-between">
              <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/25 border-l-2 border-white/15 pl-3">
                Bônus Exclusivos
              </span>
              <button
                type="button"
                onClick={addBonus}
                className="font-sans text-[10px] tracking-widest uppercase text-white/40 hover:text-white transition-colors flex items-center gap-2"
              >
                <IconPlus size={12} /> Adicionar Bônus
              </button>
            </motion.div>

            <div className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {formData.bonuses.map((bonus, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="p-4 border border-white/[0.07] bg-white/[0.02] flex flex-col gap-4 relative group"
                  >
                    <button
                      type="button"
                      onClick={() => removeBonus(index)}
                      className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <IconX size={14} />
                    </button>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/30 font-medium">
                          Título do Bônus
                        </label>
                        <input
                          value={bonus.title}
                          onChange={(e) => handleBonusChange(index, "title", e.target.value)}
                          placeholder="Ex: Checklist de Design"
                          className="w-full bg-transparent border-b border-white/[0.1] py-2 font-sans text-[12px] text-white placeholder-white/10 outline-none focus:border-white/30 transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/30 font-medium">
                          Descrição do Bônus
                        </label>
                        <textarea
                          value={bonus.description}
                          onChange={(e) => handleBonusChange(index, "description", e.target.value)}
                          placeholder="Uma breve descrição do que o usuário recebe..."
                          rows={2}
                          className="w-full bg-transparent border-b border-white/[0.1] py-2 font-sans text-[12px] text-white placeholder-white/10 outline-none resize-none focus:border-white/30 transition-colors"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {formData.bonuses.length === 0 && (
                <div className="border border-dashed border-white/10 py-8 flex flex-col items-center justify-center gap-3">
                  <IconInfo size={16} className="text-white/10" />
                  <p className="font-sans text-[11px] text-white/20">Nenhum bônus adicionado ainda.</p>
                </div>
              )}
            </div>

            {/* Rating + Category */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Avaliação" required>
                <input
                  type="text"
                  name="rating"
                  value={formData.rating}
                  inputMode="decimal"
                  onChange={(e) => {
                    const val = e.target.value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
                    if ((val.match(/\./g) || []).length <= 1) {
                      setFormData(prev => ({ ...prev, rating: val }));
                    }
                  }}
                  required
                  className="w-full bg-transparent py-4 px-4 font-sans text-[13px] text-white placeholder-white/20 outline-none"
                />
              </Field>
              <Field label="Categoria" icon={<IconBook size={12} />} required>
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Ex: Design"
                  required
                  className="w-full bg-transparent py-4 px-4 font-sans text-[13px] text-white placeholder-white/20 outline-none"
                />
              </Field>
            </div>

            {/* Badge + Pages */}
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Badge / Etiqueta"
                hint="Opcional. Ex: Best Seller"
              >
                <input
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  placeholder="Ex: Best Seller"
                  className="w-full bg-transparent py-4 px-4 font-sans text-[13px] text-white placeholder-white/20 outline-none"
                />
              </Field>

              <Field label="Páginas" required>
                <input
                  name="pages"
                  value={formData.pages}
                  onChange={handleChange}
                  placeholder="Ex: 128"
                  required
                  className="w-full bg-transparent py-4 px-4 font-sans text-[13px] text-white placeholder-white/20 outline-none"
                />
              </Field>
            </div>
          </motion.div>

          {/* ── Right: Media ──────────────────────────────────────────── */}
          <motion.div variants={stagger} className="flex flex-col gap-6">
            <motion.div variants={fadeUp}>
              <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/25 border-l-2 border-white/15 pl-3">
                Imagens do produto
              </span>
            </motion.div>

            <motion.div variants={fadeUp}>
              <ImageUpload
                onUpload={handleImageUpload}
                initialImages={formData.image_urls}
                maxImages={5}
              />
            </motion.div>

            {isEditing && (
              <motion.div
                variants={fadeUp}
                className="border border-white/[0.07] px-4 py-3"
              >
                <p className="font-sans text-[11px] text-white/30 leading-relaxed tracking-wide">
                  Novas imagens serão associadas ao produto ao salvar.
                  As imagens existentes permanecem até serem removidas.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="h-px bg-white/[0.07]" />

        {/* ── Status banners ────────────────────────────────────────────── */}
        <AnimatePresence>
          {submitStatus === "success" && (
            <Banner
              key="success"
              status="success"
              message={isEditing ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!"}
            />
          )}
          {submitStatus === "error" && errorMsg && (
            <Banner
              key="error"
              status="error"
              message={errorMsg}
              onDismiss={dismissBanner}
            />
          )}
        </AnimatePresence>

        {/* ── Submit ───────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="flex items-center gap-4 flex-wrap">
          <motion.button
            type="submit"
            disabled={loading || submitStatus === "success"}
            whileHover={loading ? {} : { scale: 1.02, y: -1 }}
            whileTap={loading ? {} : { scale: 0.97 }}
            className="bg-white text-black font-sans text-[11px] font-bold tracking-[0.18em] uppercase py-4 px-10 min-w-[200px] flex items-center justify-center gap-2 hover:bg-white/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><IconLoader size={13} /> Processando...</>
            ) : submitStatus === "success" ? (
              <><IconCheck size={13} /> Salvo!</>
            ) : (
              <>{isEditing ? "Atualizar produto" : "Criar produto"} <IconArrowRight size={13} /></>
            )}
          </motion.button>

          {/* Character count hint for description */}
          <span className="font-sans text-[10px] tracking-wide text-white/20">
            {formData.description.length} caracteres na descrição
          </span>
        </motion.div>
      </motion.div>
    </form>
  );
}