// src/components/admin/ArticleList.tsx
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useArticles } from "../../hooks/useArticles";
import { useDeleteArticle } from "../../hooks/useArticleMutations";
import { LoadingState, ErrorState } from "../ui/StatesScreens";
import {
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconX,
  IconCheck,
  IconFileText,
  IconTag,
  IconLoader,
  IconEye,
} from "../Icons";
import type { Article } from "../../types";

interface ArticleListProps {
  onEdit: (article: Article) => void;
  onSuccess: () => void;
}

interface DeleteConfirmState {
  open: boolean;
  articleId: string | null;
  title: string;
}

const INITIAL_CONFIRM: DeleteConfirmState = {
  open: false, articleId: null, title: "",
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, x: -16, transition: { duration: 0.25 } },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.22 } },
};

export function ArticleList({ onEdit, onSuccess }: ArticleListProps) {
  const { articles, loading, error } = useArticles();
  const { deleteArticle, loading: deleteLoading } = useDeleteArticle();

  const [confirm, setConfirm] = useState<DeleteConfirmState>(INITIAL_CONFIRM);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteClick = useCallback((article: Article) => {
    setConfirm({ open: true, articleId: article.id, title: article.title });
  }, []);

  const handleCancel = useCallback(() => {
    setConfirm(INITIAL_CONFIRM);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (confirm.articleId === null) return;

    const id = confirm.articleId;
    setDeletingId(id);
    setConfirm(INITIAL_CONFIRM);

    const result = await deleteArticle(id);
    setDeletingId(null);

    if (!result.error) onSuccess();
  }, [confirm.articleId, deleteArticle, onSuccess]);

  if (loading) return <LoadingState message="Carregando artigos..." />;
  if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;

  return (
    <>
      <AnimatePresence>
        {confirm.open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center px-6"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
            onClick={handleCancel}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[380px] border border-white/[0.1] bg-black p-8 flex flex-col gap-6"
            >
              <button
                type="button"
                onClick={handleCancel}
                className="absolute top-5 right-5 text-white/25 hover:text-white/60 transition-colors"
              >
                <IconX size={15} />
              </button>
              <div className="w-11 h-11 border border-white/[0.12] flex items-center justify-center text-white/40">
                <IconAlertCircle size={18} />
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/30 border-l-2 border-white/20 pl-3">
                  Confirmar exclusão
                </span>
                <h3 className="[font-family:'Playfair_Display',serif] font-bold text-xl text-white">
                  Remover artigo?
                </h3>
                <p className="font-sans text-[13px] text-white/45 leading-relaxed">
                  Você está prestes a excluir <span className="text-white/70">"{confirm.title}"</span>. Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="flex-1 bg-white text-black font-sans text-[11px] font-bold tracking-[0.15em] uppercase py-3.5 flex items-center justify-center gap-2 hover:bg-white/85 disabled:opacity-50"
                >
                  {deleteLoading ? <IconLoader size={13} /> : <><IconCheck size={13} /> Confirmar</>}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 border border-white/[0.1] font-sans text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {articles.length > 0 && (
        <div className="grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[3fr_1fr_auto_auto] gap-4 px-6 py-3 border-b border-white/[0.08]">
          {["Título", "Categoria", "Status", ""].map((label, i) => (
            <span key={i} className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/25">
              {label}
            </span>
          ))}
        </div>
      )}

      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 border border-white/[0.06] text-center">
          <IconFileText size={18} className="text-white/20" />
          <p className="[font-family:'Playfair_Display',serif] font-bold text-white/50 text-xl">Nenhum artigo publicado.</p>
        </div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col">
          <AnimatePresence mode="popLayout">
            {articles.map((article) => (
              <motion.div
                key={article.id}
                layout
                variants={rowVariants}
                exit="exit"
                className={[
                  "grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[3fr_1fr_auto_auto] items-center gap-4 px-6 py-5",
                  "border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors duration-200 group",
                  deletingId === article.id ? "opacity-40 pointer-events-none" : "",
                ].join(" ")}
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="[font-family:'Playfair_Display',serif] font-bold text-white truncate text-base">
                    {article.title}
                  </span>
                  <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-white/30">
                    {article.slug}
                  </span>
                </div>
                <div className="hidden md:flex items-center gap-1.5 text-white/35">
                  <IconTag size={12} />
                  <span className="font-sans text-[11px] tracking-[0.1em] uppercase">{article.category || "Geral"}</span>
                </div>
                <div>
                  <span className={`font-sans text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border ${article.is_published ? "border-emerald-500/30 text-emerald-400/80 bg-emerald-500/5" : "border-white/10 text-white/30"}`}>
                    {article.is_published ? "Publicado" : "Rascunho"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={`/artigo/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 border border-transparent hover:border-white/[0.14] flex items-center justify-center text-white/25 hover:text-white/70 transition-colors"
                  >
                    <IconEye size={14} />
                  </a>
                  <button
                    onClick={() => onEdit(article)}
                    className="w-8 h-8 border border-transparent hover:border-white/[0.14] flex items-center justify-center text-white/25 hover:text-white/70 transition-colors"
                  >
                    <IconEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(article)}
                    className="w-8 h-8 border border-transparent hover:border-white/[0.14] flex items-center justify-center text-white/25 hover:text-red-400 transition-colors"
                  >
                    <IconTrash size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}
