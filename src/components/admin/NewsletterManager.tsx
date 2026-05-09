// src/components/admin/NewsletterManager.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getNewsletterTemplates, updateNewsletterTemplate } from "../../api/newsletter";
import {
  IconLoader,
  IconCheck,
  IconAlertCircle,
  IconMail,
} from "../Icons";
import type { NewsletterTemplate } from "../../types";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function NewsletterManager() {
  const [templates, setTemplates] = useState<NewsletterTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<NewsletterTemplate>>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      setLoading(true);
      const data = await getNewsletterTemplates();
      setTemplates(data);
      if (data.length > 0) {
        const first = data[0];
        setSelectedId(first.id);
        setEditData({
          subject: first.subject,
          content_html: first.content_html,
        });
      }
    } catch (err) {
      console.error("Error fetching templates:", err);
    } finally {
      setLoading(false);
    }
  }

  const selectTemplate = (template: NewsletterTemplate) => {
    setSelectedId(template.id);
    setEditData({
      subject: template.subject,
      content_html: template.content_html,
    });
    setStatus("idle");
  };

  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true);
    setStatus("idle");
    try {
      const updated = await updateNewsletterTemplate(selectedId, editData);
      setTemplates(prev => prev.map(t => t.id === selectedId ? updated : t));
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err: any) {
      console.error("Error saving template:", err);
      setErrorMsg(err.message || "Erro ao salvar template");
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-30">
        <IconLoader size={24} className="animate-spin" />
        <span className="font-sans text-[11px] uppercase tracking-widest">Carregando templates...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
      {/* Sidebar: List of templates */}
      <div className="flex flex-col gap-3">
        <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2">Templates Disponíveis</span>
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => selectTemplate(template)}
            className={`flex flex-col gap-1 p-5 text-left border transition-all ${selectedId === template.id
                ? "bg-white/[0.05] border-white/20"
                : "bg-transparent border-white/[0.05] hover:border-white/10"
              }`}
          >
            <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase">
              {template.id === 'welcome' ? 'Boas-vindas' : 'Informativo Semanal'}
            </span>
            <span className="font-sans text-[10px] text-white/30 truncate w-full mt-1">
              {template.subject}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content: Edit Form */}
      <AnimatePresence mode="wait">
        {selectedId ? (
          <motion.div
            key={selectedId}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-8 p-8 border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
              <div className="flex flex-col gap-3">
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40">Assunto do E-mail</label>
                <input
                  value={editData.subject || ""}
                  onChange={(e) => setEditData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Digite o assunto que o usuário verá..."
                  className="w-full bg-transparent border border-white/[0.1] py-4 px-5 font-sans text-base text-white outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40">Corpo do E-mail (HTML)</label>
                  <div className="flex gap-4">
                    <span className="font-sans text-[9px] text-white/20 uppercase tracking-[0.1em]">Placeholders: <code className="text-white/40 bg-white/5 px-1">{"{{email}}"}</code>, <code className="text-white/40 bg-white/5 px-1">{"{{base_url}}"}</code></span>
                  </div>
                </div>
                <textarea
                  value={editData.content_html || ""}
                  onChange={(e) => setEditData(prev => ({ ...prev, content_html: e.target.value }))}
                  rows={15}
                  placeholder="Insira o código HTML do seu e-mail..."
                  className="w-full bg-transparent border border-white/[0.1] py-5 px-5 font-mono text-[13px] leading-relaxed text-white/60 outline-none focus:border-white/30 transition-colors resize-y min-h-[450px]"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={handleSave}
                disabled={saving || status === "success"}
                className="bg-white text-black font-sans text-[11px] font-bold tracking-[0.2em] uppercase py-4 px-12 flex items-center gap-3 hover:bg-white/85 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <IconLoader size={14} />
                ) : status === "success" ? (
                  <IconCheck size={14} />
                ) : (
                  <>Salvar Alterações <IconMail size={14} /></>
                )}
              </button>

              <AnimatePresence>
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-red-400 font-sans text-[12px]"
                  >
                    <IconAlertCircle size={14} /> {errorMsg}
                  </motion.div>
                )}
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-emerald-400 font-sans text-[12px]"
                  >
                    <IconCheck size={14} /> Template atualizado com sucesso!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-white/[0.05] border-dashed">
            <span className="font-sans text-[11px] uppercase tracking-widest text-white/20">Selecione um template para editar</span>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
