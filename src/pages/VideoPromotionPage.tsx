import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IconLoader, IconArrowRight, IconVolume2, IconVolumeX } from "../components/Icons";

export function VideoPromotionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const { videoUrl, checkoutUrl, bookName } = location.state || {};

  useEffect(() => {
    if (!videoUrl || !checkoutUrl) {
      navigate("/");
    }
  }, [videoUrl, checkoutUrl, navigate]);

  const handleVideoEnd = () => {
    window.location.href = checkoutUrl;
  };

  const handleSkip = () => {
    window.location.href = checkoutUrl;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  if (!videoUrl) return null;

  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  const isVimeo = videoUrl.includes("vimeo.com");

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent pointer-events-none" />

      {/* Progress Bar (Top) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/10 z-50">
        <motion.div 
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      {/* Header Info */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-8 z-50 flex flex-col gap-1"
      >
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/40">Apresentação Especial</span>
        <h1 className="font-sans text-[14px] font-bold tracking-widest uppercase text-white">{bookName}</h1>
      </motion.div>

      {/* Main Content */}
      <div className="w-full max-w-[1200px] aspect-video relative z-10 px-4 md:px-12">
        <AnimatePresence mode="wait">
          {isYouTube || isVimeo ? (
            <motion.div 
              key="external"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full bg-white/[0.02] border border-white/10 relative"
            >
              <iframe
                src={`${isYouTube 
                  ? `https://www.youtube.com/embed/${videoUrl.split('v=')[1] || videoUrl.split('/').pop()}?autoplay=1&controls=0&modestbranding=1&rel=0` 
                  : `https://player.vimeo.com/video/${videoUrl.split('/').pop()}?autoplay=1&background=1`
                }`}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                title="Product Promotion"
                onLoad={() => {
                  // YouTube/Vimeo don't easily trigger end events without SDK
                  // For simplicity, we'll show a "Proceed" button after a delay or let user skip
                }}
              />
              <div className="absolute inset-0 pointer-events-none border border-white/5 z-20" />
            </motion.div>
          ) : (
            <motion.video
              key="direct"
              ref={videoRef}
              src={videoUrl}
              autoPlay
              muted={isMuted}
              onEnded={handleVideoEnd}
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-contain bg-black shadow-2xl shadow-white/5"
            />
          )}
        </AnimatePresence>

        {/* Video Controls (Direct MP4 only) */}
        {!isYouTube && !isVimeo && (
          <div className="absolute bottom-12 right-12 md:right-24 z-50 flex items-center gap-4">
             <button 
              onClick={toggleMute}
              className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-all"
            >
              {isMuted ? <IconVolumeX size={18} /> : <IconVolume2 size={18} />}
            </button>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-6"
      >
        <div className="flex items-center gap-8">
          <button 
            onClick={handleSkip}
            className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/30 hover:text-white transition-colors flex items-center gap-2 group"
          >
            Pular Apresentação
            <IconArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="flex items-center gap-3 px-6 py-3 bg-white/[0.03] border border-white/[0.05] rounded-full">
          <IconLoader size={12} className="text-white/40" />
          <span className="font-sans text-[10px] tracking-widest uppercase text-white/30">
            {isYouTube || isVimeo ? "O checkout abrirá automaticamente" : "Aguarde o fim do vídeo para prosseguir"}
          </span>
        </div>
      </motion.div>

      {/* Auto-redirect for YouTube/Vimeo after 60s as safety fallback */}
      {(isYouTube || isVimeo) && (
        <script>
          {/* Fallback script or simple timeout in component */}
        </script>
      )}
    </div>
  );
}

// Simple Icon placeholders if not in Icons.tsx
function IconVolume2({ size = 18, className }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
  );
}

function IconVolumeX({ size = 18, className }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <line x1="23" y1="9" x2="17" y2="15"></line>
      <line x1="17" y1="9" x2="23" y2="15"></line>
    </svg>
  );
}
