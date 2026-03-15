// src/components/admin/ArticleForm.tsx
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useCreateArticle, useUpdateArticle } from "../../hooks/useArticleMutations";
import { ImageUpload } from "../ui/ImageUpload";
import {
  IconLoader,
  IconArrowRight,
  IconAlertCircle,
  IconCheck,
  IconTag,
} from "../Icons";
import type { Article } from "../../types";

interface ArticleFormProps {
  article?: Article;
  onSuccess: () => void;
}

interface FormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  image_url: string;
  is_published: boolean;
  tags: string[];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function ArticleForm({ article, onSuccess }: ArticleFormProps) {
  const isEditing = !!article;
  const [formData, setFormData] = useState<FormData>({
    title: article?.title ?? "",
    content: article?.content ?? "",
    excerpt: article?.excerpt ?? "",
    category: article?.category ?? "",
    image_url: article?.image_url ?? "",
    is_published: article?.is_published ?? false,
    tags: article?.tags ?? [],
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { createArticle, loading: createLoading } = useCreateArticle();
  const { updateArticle, loading: updateLoading } = useUpdateArticle();
  const loading = createLoading || updateLoading;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);

    const result = isEditing 
      ? await updateArticle(article!.id, formData)
      : await createArticle(formData);

    if (result.error) {
      setErrorMsg(typeof result.error === 'string' ? result.error : (result.error as any).message);
      setStatus("error");
    } else {
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        onSuccess();
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
        <div className="flex flex-col gap-6">
          <motion.div variants={fadeUp} className="flex flex-col gap-2">
            <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40">Título do Artigo</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: O Futuro da Tecnologia"
              required
              className="w-full bg-transparent border border-white/[0.1] py-4 px-4 font-sans text-base text-white outline-none focus:border-white/30 transition-colors"
            />
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-2">
            <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40">Resumo / Excerpt</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              placeholder="Uma breve introdução para atrair o leitor..."
              className="w-full bg-transparent border border-white/[0.1] py-4 px-4 font-sans text-[14px] text-white/70 outline-none focus:border-white/30 transition-colors resize-none"
            />
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-2">
            <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40">Conteúdo (Suporta HTML)</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={15}
              placeholder="Escreva seu artigo aqui. Você pode usar tags HTML para formatação..."
              required
              className="w-full bg-transparent border border-white/[0.1] py-4 px-4 font-sans text-base text-white/80 outline-none focus:border-white/30 transition-colors resize-y min-h-[400px]"
            />
          </motion.div>
        </div>

        <div className="flex flex-col gap-8">
          <motion.div variants={fadeUp} className="flex flex-col gap-6 p-6 border border-white/[0.05] bg-white/[0.02]">
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40">Categoria</label>
              <div className="relative">
                <IconTag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Ex: Produtividade"
                  className="w-full bg-transparent border border-white/[0.1] py-3 pl-10 pr-4 font-sans text-[13px] text-white outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40">Status de Publicação</label>
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, is_published: !p.is_published }))}
                className={`flex items-center justify-between px-4 py-3 border transition-colors ${formData.is_published ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" : "border-white/10 bg-white/5 text-white/40"}`}
              >
                <span className="font-sans text-[11px] tracking-widest uppercase">{formData.is_published ? "Publicado" : "Rascunho"}</span>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${formData.is_published ? "bg-emerald-500/40" : "bg-white/10"}`}>
                  <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${formData.is_published ? "left-5" : "left-1"}`} />
                </div>
              </button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="p-6 border border-white/[0.05] bg-white/[0.02]">
            <ImageUpload
              label="Imagem de Capa"
              bucket="article-images"
              folder="covers"
              maxImages={1}
              initialImages={formData.image_url ? [formData.image_url] : []}
              onUpload={(urls) => setFormData(p => ({ ...p, image_url: urls[0] || "" }))}
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="flex items-center gap-6 pt-8 border-t border-white/[0.05]">
        <button
          type="submit"
          disabled={loading || status === "success"}
          className="bg-white text-black font-sans text-[11px] font-bold tracking-[0.2em] uppercase py-4 px-12 flex items-center gap-3 hover:bg-white/85 disabled:opacity-50 transition-colors"
        >
          {loading ? <IconLoader size={14} /> : status === "success" ? <IconCheck size={14} /> : <>{isEditing ? "Salvar Alterações" : "Publicar Artigo"} <IconArrowRight size={14} /></>}
        </button>

        <AnimatePresence>
          {status === "error" && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-red-400 font-sans text-[12px]">
              <IconAlertCircle size={14} /> {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </form>
  );
}
