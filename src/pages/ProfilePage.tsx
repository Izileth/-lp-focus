// src/pages/ProfilePage.tsx
import { useEffect, useState, useCallback } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUserProfile";
import { Header } from "../components/Header";
import { OfferCountdown } from "../components/OfferCountdown";
import { MobileMenu } from "../components/MobileMenu";
import { IconAlertCircle } from "../components/Icons";
import { LoadingState } from "../components/ui/StatesScreens";

// ─── Sub-components ───────────────────────────────────────────────────────────
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileForm } from "../components/profile/ProfileForm";
import { ProfileBackground } from "../components/profile/ProfileBackground";
import { slideDown } from "../components/profile/variants";
import type { SaveStatus } from "../components/profile/ProfileStatusBanner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileFormValues {
  name: string;
  email: string;
  slug: string;
  bio: string;
}

// ─── ProfilePage ──────────────────────────────────────────────────────────────

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, error: profileError, updateProfile } = useUserProfile();
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState<ProfileFormValues>({
    name: "",
    email: "",
    slug: "",
    bio: "",
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Redirect unauthenticated users ────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  // ── Populate form once profile loads ──────────────────────────────────────
  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name ?? "",
      email: profile.email ?? "",
      slug: profile.slug ?? "",
      bio: profile.bio ?? "",
    });
  }, [profile]);

  // ── Auto-dismiss success banner ────────────────────────────────────────────
  useEffect(() => {
    if (saveStatus !== "success") return;
    const id = setTimeout(() => setSaveStatus("idle"), 3500);
    return () => clearTimeout(id);
  }, [saveStatus]);

  // ── Field setter ──────────────────────────────────────────────────────────
  const setField = useCallback((key: keyof ProfileFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleUpdate = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setSaveStatus("saving");
      setSaveError(null);

      const { error } = await updateProfile(form);

      if (error) {
        setSaveError(error.message);
        setSaveStatus("error");
      } else {
        setSaveStatus("success");
      }
    },
    [form, updateProfile]
  );

  // ── Sign out ──────────────────────────────────────────────────────────────
  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate("/login");
  }, [signOut, navigate]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-black">
        <LoadingState message="Carregando perfil..." />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden pt-[104px]">
      <ProfileBackground />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <OfferCountdown />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="relative z-10 max-w-[680px] mx-auto px-6 md:px-8 py-20">
        <ProfileHeader name={form.name} />

        {/* ── Profile error notice ──────────────────────────────────────── */}
        <AnimatePresence>
          {profileError && (
            <motion.div
              variants={slideDown}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mb-6 flex items-start gap-3 border border-white/[0.1] px-4 py-3"
            >
              <span className="text-white/40 mt-0.5 shrink-0">
                <IconAlertCircle size={14} />
              </span>
              <p className="font-sans text-[12px] text-white/45 leading-[1.55]">
                Não foi possível carregar os dados do perfil: {profileError}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <ProfileForm
          form={form}
          setField={setField}
          onSubmit={handleUpdate}
          onSignOut={handleSignOut}
          saveStatus={saveStatus}
          saveError={saveError}
          onDismissStatus={() => setSaveStatus("idle")}
        />

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8 text-center font-sans text-[10px] tracking-[0.15em] uppercase text-white/15"
        >
          © 2025 Focus Conhecimento
        </motion.p>
      </div>
    </div>
  );
}
