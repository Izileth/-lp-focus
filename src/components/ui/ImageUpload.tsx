// src/components/ui/ImageUpload.tsx
import { useState, useCallback, useRef } from "react";
import type { ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import {
  IconLoader,
  IconPlus,
  IconX,
  IconAlertCircle,
  IconCheck,
  IconArrowUp,
} from "../Icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  initialImages?: string[];
  maxImages?: number;
  bucket?: string;
  folder?: string;
  label?: string;
}

interface UploadState {
  uploading: boolean;
  progress: number; // 0-100 across all files in batch
  error: string | null;
  success: boolean;
}

const INITIAL_UPLOAD_STATE: UploadState = {
  uploading: false,
  progress: 0,
  error: null,
  success: false,
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_MB = 5;

// ─── Motion Variants ──────────────────────────────────────────────────────────

const gridItem: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.88, transition: { duration: 0.2 } },
};

const bannerVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `"${file.name}" não é um formato suportado. Use JPG, PNG, WebP ou GIF.`;
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `"${file.name}" excede o limite de ${MAX_FILE_SIZE_MB}MB.`;
  }
  return null;
}

function generateFilePath(file: File, folder: string): string {
  const ext = file.name.split(".").pop() ?? "jpg";
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${folder}/${uid}.${ext}`;
}

// ─── ImageThumb ───────────────────────────────────────────────────────────────

interface ImageThumbProps {
  url: string;
  index: number;
  onRemove: (i: number) => void;
}

function ImageThumb({ url, index, onRemove }: ImageThumbProps) {
  return (
    <motion.div
      layout
      variants={gridItem}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative aspect-square border border-white/[0.08] bg-white/[0.03] overflow-hidden group"
    >
      <img
        src={url}
        alt={`Imagem ${index + 1}`}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* Remove button */}
      <motion.button
        type="button"
        onClick={() => onRemove(index)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={`Remover imagem ${index + 1}`}
        className="absolute top-2 right-2 w-6 h-6 bg-black/70 backdrop-blur-sm border border-white/[0.15] flex items-center justify-center text-white/60 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
      >
        <IconX size={11} />
      </motion.button>

      {/* Index pill */}
      <span className="absolute bottom-2 left-2 font-sans text-[9px] tracking-[0.15em] uppercase text-white/40 bg-black/50 px-1.5 py-0.5">
        {index + 1}
      </span>
    </motion.div>
  );
}

// ─── DropZone ─────────────────────────────────────────────────────────────────

interface DropZoneProps {
  uploading: boolean;
  progress: number;
  dragging: boolean;
  onFile: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

function DropZone({
  uploading, progress, dragging,
  onFile, onDragOver, onDragLeave, onDrop,
}: DropZoneProps) {
  return (
    <motion.div
      onClick={uploading ? undefined : onFile}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      animate={{
        borderColor: dragging
          ? "rgba(255,255,255,0.35)"
          : uploading
            ? "rgba(255,255,255,0.15)"
            : "rgba(255,255,255,0.08)",
        backgroundColor: dragging ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.01)",
      }}
      transition={{ duration: 0.15 }}
      className="aspect-square border border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer select-none"
      style={{ cursor: uploading ? "not-allowed" : "pointer" }}
    >
      {uploading ? (
        /* Upload progress */
        <div className="flex flex-col items-center gap-3 px-3 w-full">
          <IconLoader size={18} className="text-white/40" />
          <div className="w-full h-px bg-white/[0.08] relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-white/40"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>
          <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-white/30">
            {progress}%
          </span>
        </div>
      ) : (
        /* Idle */
        <>
          <div className="w-8 h-8 border border-white/[0.1] flex items-center justify-center text-white/30 group-hover:text-white/60 transition-colors">
            {dragging ? <IconArrowUp size={15} /> : <IconPlus size={15} />}
          </div>
          <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-white/25 text-center px-2 leading-relaxed">
            {dragging ? "Soltar aqui" : "Adicionar"}
          </span>
        </>
      )}
    </motion.div>
  );
}

// ─── ImageUpload ──────────────────────────────────────────────────────────────

export function ImageUpload({
  onUpload,
  initialImages = [],
  maxImages = 5,
  bucket = "product-images",
  folder = "products",
  label = "Imagens do produto",
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploadState, setUploadState] = useState<UploadState>(INITIAL_UPLOAD_STATE);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const canAddMore = images.length < maxImages;
  const remaining = maxImages - images.length;

  // ── Remove image ──────────────────────────────────────────────────────────
  const removeImage = useCallback(
    (index: number) => {
      setImages((prev) => {
        const next = prev.filter((_, i) => i !== index);
        onUpload(next);
        return next;
      });
    },
    [onUpload]
  );

  // ── Core upload logic ─────────────────────────────────────────────────────
  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (!fileArray.length) return;

      // Guard: slot count
      if (fileArray.length > remaining) {
        setUploadState({
          uploading: false, progress: 0, success: false,
          error: `Limite: você pode adicionar no máximo ${remaining} imagem${remaining !== 1 ? "s" : ""} agora.`,
        });
        return;
      }

      // Guard: individual file validation
      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          setUploadState({
            uploading: false, progress: 0, success: false,
            error: validationError,
          });
          return;
        }
      }

      setUploadState({ uploading: true, progress: 0, error: null, success: false });

      const newUrls: string[] = [];
      const total = fileArray.length;

      try {
        for (let i = 0; i < total; i++) {
          const file = fileArray[i];
          const filePath = generateFilePath(file, folder);

          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, { upsert: false });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

          newUrls.push(publicUrl);
          setUploadState((prev) => ({
            ...prev,
            progress: Math.round(((i + 1) / total) * 100),
          }));
        }

        setImages((prev) => {
          const next = [...prev, ...newUrls];
          onUpload(next);
          return next;
        });

        setUploadState({ uploading: false, progress: 100, error: null, success: true });
        setTimeout(
          () => setUploadState(INITIAL_UPLOAD_STATE),
          2000
        );
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Erro ao fazer upload. Tente novamente.";
        setUploadState({ uploading: false, progress: 0, error: message, success: false });
      } finally {
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [remaining, onUpload, bucket, folder]
  );

  // ── File input handler ────────────────────────────────────────────────────
  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) uploadFiles(e.target.files);
    },
    [uploadFiles]
  );

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragging(false), []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
    },
    [uploadFiles]
  );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4">

      {/* Label row */}
      <div className="flex items-center justify-between">
        <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-white/40 font-medium">
          {label}
        </span>
        <span className="font-sans text-[10px] tracking-[0.12em] text-white/20 tabular-nums">
          {images.length} / {maxImages}
        </span>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${Math.min(maxImages, 5)}, 1fr)`,
        }}
      >
        <AnimatePresence mode="popLayout">
          {images.map((url, i) => (
            <ImageThumb
              key={url}
              url={url}
              index={i}
              onRemove={removeImage}
            />
          ))}

          {canAddMore && (
            <motion.div
              key="dropzone"
              layout
              variants={gridItem}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DropZone
                uploading={uploadState.uploading}
                progress={uploadState.progress}
                dragging={dragging}
                onFile={() => inputRef.current?.click()}
                inputRef={inputRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                multiple
                onChange={handleFileChange}
                disabled={uploadState.uploading}
                className="hidden"
                aria-label="Selecionar imagens"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hint */}
      <p className="font-sans text-[10px] italic text-white/20 leading-relaxed">
        JPG, PNG, WebP ou GIF · Máx. {MAX_FILE_SIZE_MB}MB por arquivo · Arraste ou clique para adicionar
      </p>

      {/* Status banners */}
      <AnimatePresence>
        {uploadState.success && (
          <motion.div
            key="success"
            variants={bannerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 border border-white/[0.1] px-4 py-3">
              <span className="text-white/50 shrink-0"><IconCheck size={13} /></span>
              <p className="font-sans text-[12px] text-white/50">
                {uploadState.progress === 100 && "Upload concluído com sucesso!"}
              </p>
            </div>
          </motion.div>
        )}

        {uploadState.error && (
          <motion.div
            key="error"
            variants={bannerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="flex items-start gap-3 border border-white/[0.1] px-4 py-3">
              <span className="text-white/40 mt-0.5 shrink-0"><IconAlertCircle size={13} /></span>
              <p className="font-sans text-[12px] leading-[1.55] text-white/50 flex-1">
                {uploadState.error}
              </p>
              <button
                type="button"
                onClick={() => setUploadState(INITIAL_UPLOAD_STATE)}
                aria-label="Fechar"
                className="text-white/25 hover:text-white/55 transition-colors shrink-0 mt-0.5"
              >
                <IconX size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}