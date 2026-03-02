// src/pages/AdminPage.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useAdmin } from "../hooks/useAdmin";
import { supabase } from "../lib/supabaseClient";
import { Header } from "../components/Header";
import { OfferCountdown } from "../components/OfferCountdown";
import { MobileMenu } from "../components/MobileMenu";
import { NoiseOverlay } from "../components/NoiseOverlay";
import { LoadingState, ErrorState } from "../components/ui/StatesScreens";
import { IconPlus, IconArrowLeft } from "../components/Icons";

// ─── Admin Components ──────────────────────────────────────────────────────────
import { ProductList } from "../components/admin/ProductList";
import { ProductForm } from "../components/admin/ProductForm";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminAccessDenied } from "../components/admin/AdminAccessDenied";
import { slideRight } from "../components/admin/AdminVariants";
import type { Product, AdminStats } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

type View = "list" | "create" | "edit";

interface ViewState {
  current:  View;
  product?: Product;
}

export function AdminPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading, error: adminError } = useAdmin();

  const [viewState, setViewState] = useState<ViewState>({ current: "list" });
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState(false);
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
  const handleEdit = useCallback((product: Product) => {
    setViewState({ current: "edit", product });
  }, []);

  const handleCreateNew = useCallback(() => {
    setViewState({ current: "create", product: undefined });
  }, []);

  const handleSuccess = useCallback(() => {
    setViewState({ current: "list" });
    setRefreshKey((k) => k + 1);
  }, []);

  const handleCancel = useCallback(() => {
    setViewState({ current: "list" });
  }, []);

  // ── Loading & Error States ────────────────────────────────────────────────
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
  if (!isAdmin) return <AdminAccessDenied menuOpen={menuOpen} setMenuOpen={setMenuOpen} />;

  const isFormView = viewState.current === "create" || viewState.current === "edit";

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-white/20 pt-[104px]">
      <NoiseOverlay />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <OfferCountdown />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-10 py-16">
        <AdminHeader 
          stats={stats} 
          statsLoading={statsLoading} 
          isFormView={isFormView} 
        />

        <AnimatePresence mode="wait">
          {viewState.current === "list" && (
            <motion.div
              key="list"
              variants={slideRight}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/30">
                    Produtos
                  </span>
                  <h2
                    className="[font-family:'Playfair_Display',serif] font-bold"
                    style={{ fontSize: "clamp(18px,2.5vw,26px)" }}
                  >
                    Catálogo atual
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
                  Novo produto
                </motion.button>
              </div>

              <div className="h-px bg-white/[0.07] mb-8" />

              <ProductList
                key={refreshKey}
                onEdit={handleEdit}
                onSuccess={handleSuccess}
              />
            </motion.div>
          )}

          {isFormView && (
            <motion.div
              key="form"
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
                    Voltar ao catálogo
                  </motion.button>

                  <div className="flex flex-col gap-1">
                    <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/30">
                      {viewState.current === "create" ? "Novo produto" : "Editar produto"}
                    </span>
                    <h2
                      className="[font-family:'Playfair_Display',serif] font-bold leading-[1.05]"
                      style={{ fontSize: "clamp(20px,3vw,32px)" }}
                    >
                      {viewState.current === "create" ? (
                        <>Adicionar ao<br /><em className="not-italic text-white/60">catálogo.</em></>
                      ) : (
                        <>Atualizar<br /><em className="not-italic text-white/60">publicação.</em></>
                      )}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/[0.07] mb-8" />

              <div className="border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-8 md:p-10">
                <ProductForm
                  product={viewState.product}
                  onSuccess={handleSuccess}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
