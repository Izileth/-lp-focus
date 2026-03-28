import { useParams, Link } from "react-router-dom";
import { useState} from "react";
import { useProduct } from "../hooks/useProduct";
import { IconArrowLeft, IconShare } from "../components/Icons";
import { Header } from "../components/Header";
import { OfferCountdown } from "../components/OfferCountdown";
import { PersonalizedOfferBanner } from "../components/PersonalizedOfferBanner";
import { MobileMenu } from "../components/MobileMenu";
import { NotFound } from "../components/ui/NotFound";
import { LoadingState } from "../components/ui/StatesScreens";

// ─── Sub-components ───────────────────────────────────────────────────────────
import { BookCarousel } from "../components/book/BookCarousel";
import { BookDetails } from "../components/book/BookDetails";
import { BookFooter } from "../components/book/BookFooter";
import { BookBackground } from "../components/book/BookBackground";
import { SocialProofHeadline } from "../components/book/SocialProofHeadline";
import { SocialProofSection } from "../components/book/SocialProofSection";
export function BookPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const { product: book, loading, error } = useProduct(bookId);
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <LoadingState message="Carregando detalhes do livro..." />
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-red-500/50 font-sans text-[11px] tracking-widest uppercase">
      Erro ao carregar: {error}
    </div>
  );
  
  if (!book) return <NotFound />;

  const hasDiscount = Boolean(
    book.discount_price &&
    book.discount_price > 0 &&
    book.discount_price < book.price
  );

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(book.price);

  const formattedDiscountPrice = book.discount_price
    ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(book.discount_price)
    : null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.name,
        text: book.description,
        url: book.share_url
      });
    } else {
      navigator.clipboard.writeText(book.share_url || "");
      alert("Link de compartilhamento copiado!");
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap"
      />

      <div className="bg-black min-h-screen text-white overflow-x-hidden pt-[104px]">
        <BookBackground />
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <PersonalizedOfferBanner />
        <OfferCountdown />
        <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <main className="max-w-[1200px] mx-auto px-8 md:px-16 py-16 md:py-24">

          {/* TOPO */}
          <div className="mb-12 flex items-center justify-between">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 font-sans text-[12px] tracking-[0.12em] uppercase text-white/45 hover:text-white transition"
            >
              <span className="group-hover:-translate-x-1 transition">
                <IconArrowLeft />
              </span>
              Voltar para a loja
            </Link>

            {book.share_url && (
              <button 
                onClick={handleShare}
                className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.12em] uppercase text-white/45 hover:text-white transition"
              >
                <IconShare size={14} />
                Compartilhar
              </button>
            )}
          </div>

          {/* SOCIAL PROOF - TOPO */}
          <div className="mb-16">
            <SocialProofHeadline />
          </div>

          {/* HERO / PRODUTO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
            <BookCarousel 
              name={book.name} 
              category={book.category} 
              images={book.product_images} 
              badge={book.badge} 
            />
            
            <BookDetails 
              book={{ ...book, id: String(book.id) }}
              formattedPrice={formattedPrice}
              formattedDiscountPrice={formattedDiscountPrice}
              hasDiscount={hasDiscount}
            />
          </div>

          {/* SOCIAL PROOF - MEIO */}
          <div className="mt-24 md:mt-32">
            <SocialProofHeadline />
          </div>

          {/* VÍDEO */}
          {book.video_url && (
            <div className="mt-24 md:mt-32">
              <div className="flex flex-col items-center mb-12 text-center">
                <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-white/30 mb-4">
                  Experiência Visual
                </span>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 font-serif">
                  Conheça o Conteúdo
                </h2>
                <div className="w-12 h-px bg-white/20" />
              </div>

              <div className="aspect-video w-full max-w-[1000px] mx-auto bg-white/[0.03] border border-white/[0.08] overflow-hidden">
                {book.video_url.includes('youtube.com') || book.video_url.includes('youtu.be') ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${book.video_url.split('v=')[1] || book.video_url.split('/').pop()}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : book.video_url.includes('vimeo.com') ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${book.video_url.split('/').pop()}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <video 
                    src={book.video_url} 
                    controls 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          )}

          {/* SOCIAL PROOF - FINAL */}
          <div className="mt-24 md:mt-32">
            <SocialProofHeadline />
            <SocialProofSection />
          </div>

        </main>

        <BookFooter />
      </div>
    </>
  );
}