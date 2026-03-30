// src/pages/AdminPage.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ─── Hooks & Libs ───────────────────────────────────────────────────────────
import { useAuth } from "../hooks/useAuth";
import { useAdmin } from "../hooks/useAdmin";
import { supabase } from "../lib/supabaseClient";

// ─── Shared Components ──────────────────────────────────────────────────────
import { LoadingState, ErrorState } from "../components/ui/StatesScreens";
import { IconPlus, IconArrowLeft, IconBook, IconFileText } from "../components/Icons";

// ─── Admin Specific Components ──────────────────────────────────────────────
import { ProductList } from "../components/admin/ProductList";
import { ProductForm } from "../components/admin/ProductForm";
import { ArticleList } from "../components/admin/ArticleList";
import { ArticleForm } from "../components/admin/ArticleForm";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminAccessDenied } from "../components/admin/AdminAccessDenied";
import { slideRight } from "../components/admin/AdminVariants";

// ─── Types ────────────────────────────────────────────────────────────────────
import type { AdminStats } from "../types";

type EntityType = "products" | "articles";
type View = "list" | "create" | "edit";

interface ViewState {
  entity: EntityType;
  current: View;
  item?: any;
}

export function AdminPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading, error: adminError } = useAdmin();

  // ── State ─────────────────────────────────────────────────────────────────
  const [viewState, setViewState] = useState<ViewState>({ entity: "products", current: "list" });
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // ── Fetch Stats ───────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    if (!isAdmin) return;
    setStatsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_admin_stats');
      if (error) throw error;
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, refreshKey]);

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleEdit = useCallback((item: any) => {
    setViewState(prev => ({ ...prev, current: "edit", item }));
  }, []);

  const handleCreateNew = useCallback(() => {
    setViewState(prev => ({ ...prev, current: "create", item: undefined }));
  }, []);

  const handleSuccess = useCallback(() => {
    setViewState(prev => ({ ...prev, current: "list", item: undefined }));
    setRefreshKey((k) => k + 1);
  }, []);

  const handleCancel = useCallback(() => {
    setViewState(prev => ({ ...prev, current: "list", item: undefined }));
  }, []);

  const switchEntity = (entity: EntityType) => {
    setViewState({ entity, current: "list", item: undefined });
  };

  // ── Derived State ────────────────────────────────────────────────────────
  const isFormView = viewState.current === "create" || viewState.current === "edit";

  // ── Render States ────────────────────────────────────────────────────────
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-black">
        <LoadingState message="Verificando permissões..." />
      </div>
    );
  }

  if (adminError) {
    return (
      <div className="min-h-screen bg-black">
        <ErrorState error={adminError} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!user) return null;
  if (!isAdmin) return <AdminAccessDenied />;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 pt-[104px]">
      <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-10 py-16">
        <AdminHeader
          stats={stats}
          statsLoading={statsLoading}
          isFormView={isFormView}
        />

        {/* Tab Switcher (only in list view) */}
        {!isFormView && (
          <div className="flex gap-8 mb-12 border-b border-white/[0.05]">
            <button
              onClick={() => switchEntity("products")}
              className={`pb-4 font-sans text-[11px] tracking-[0.2em] uppercase transition-all relative ${viewState.entity === "products" ? "text-white" : "text-white/30 hover:text-white/50"}`}
            >
              <div className="flex items-center gap-2">
                <IconBook size={14} /> Produtos
              </div>
              {viewState.entity === "products" && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
            </button>
            <button
              onClick={() => switchEntity("articles")}
              className={`pb-4 font-sans text-[11px] tracking-[0.2em] uppercase transition-all relative ${viewState.entity === "articles" ? "text-white" : "text-white/30 hover:text-white/50"}`}
            >
              <div className="flex items-center gap-2">
                <IconFileText size={14} /> Artigos
              </div>
              {viewState.entity === "articles" && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {viewState.current === "list" && (
            <motion.div
              key={`${viewState.entity}-list`}
              variants={slideRight}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/30">
                    {viewState.entity === "products" ? "Catálogo" : "Journal"}
                  </span>
                  <h2
                    className="[font-family:'Playfair_Display',serif] font-bold"
                    style={{ fontSize: "clamp(18px,2.5vw,26px)" }}
                  >
                    {viewState.entity === "products" ? "Catálogo atual" : "Artigos do Blog"}
                  </h2>
                </div>

                <motion.button
                  type="button"
                  onClick={handleCreateNew}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white text-black font-sans text-[11px] font-medium tracking-[0.12em] uppercase px-5 py-3 flex items-center gap-2 hover:bg-white/85 transition-colors"
                >
                  <IconPlus size={14} />
                  {viewState.entity === "products" ? "Novo produto" : "Novo artigo"}
                </motion.button>
              </div>

              <div className="h-px bg-white/[0.07] mb-8" />

              {viewState.entity === "products" ? (
                <ProductList
                  key={`products-${refreshKey}`}
                  onEdit={handleEdit}
                  onSuccess={handleSuccess}
                />
              ) : (
                <ArticleList
                  key={`articles-${refreshKey}`}
                  onEdit={handleEdit}
                  onSuccess={handleSuccess}
                />
              )}
            </motion.div>
          )}

          {isFormView && (
            <motion.div
              key={`${viewState.entity}-form`}
              variants={slideRight}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                <div className="flex flex-col gap-3">
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    whileHover={{ x: -2 }}
                    className="group flex items-center gap-2 font-sans text-[11px] tracking-[0.12em] uppercase text-white/35 hover:text-white transition-colors w-max"
                  >
                    <span className="transition-transform duration-200 group-hover:-translate-x-1">
                      <IconArrowLeft size={14} />
                    </span>
                    Voltar para {viewState.entity === "products" ? "produtos" : "artigos"}
                  </motion.button>

                  <div className="flex flex-col gap-1">
                    <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/30">
                      {viewState.current === "create"
                        ? (viewState.entity === "products" ? "Novo produto" : "Novo artigo")
                        : (viewState.entity === "products" ? "Editar produto" : "Editar artigo")
                      }
                    </span>
                    <h2
                      className="[font-family:'Playfair_Display',serif] font-bold leading-[1.05]"
                      style={{ fontSize: "clamp(20px,3vw,32px)" }}
                    >
                      {viewState.current === "create" ? (
                        <>Adicionar ao<br /><em className="not-italic text-white/60">{viewState.entity === "products" ? "catálogo" : "journal"}.</em></>
                      ) : (
                        <>Atualizar<br /><em className="not-italic text-white/60">publicação.</em></>
                      )}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/[0.07] mb-8" />

              <div className="border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-8 md:p-10">
                {viewState.entity === "products" ? (
                  <ProductForm
                    product={viewState.item}
                    onSuccess={handleSuccess}
                  />
                ) : (
                  <ArticleForm
                    article={viewState.item}
                    onSuccess={handleSuccess}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
