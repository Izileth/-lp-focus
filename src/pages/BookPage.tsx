import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { IconArrowLeft, IconShare } from "../components/Icons";
import { Header } from "../components/Header";
import { MobileMenu } from "../components/MobileMenu";
import { NotFound } from "../components/ui/NotFound";

// ─── Sub-components ───────────────────────────────────────────────────────────
import { BookCarousel } from "../components/book/BookCarousel";
import { BookDetails } from "../components/book/BookDetails";
import { BookFooter } from "../components/book/BookFooter";
import { BookBackground } from "../components/book/BookBackground";

export function BookPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const { product: book, loading, error } = useProduct(bookId);
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white/50 font-sans text-[11px] tracking-widest uppercase">
      Carregando detalhes...
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-red-500/50 font-sans text-[11px] tracking-widest uppercase">
      Erro ao carregar: {error}
    </div>
  );
  
  if (!book) return <NotFound />;

  // Format price for display
  const hasDiscount = Boolean(book.discount_price && book.discount_price > 0 && book.discount_price < book.price);
  const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(book.price);
  const formattedDiscountPrice = book.discount_price 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(book.discount_price)
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

      <div
        className="bg-black min-h-screen text-white overflow-x-hidden pt-16"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        <BookBackground />
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <main className="max-w-[1200px] mx-auto px-8 md:px-16 py-16 md:py-24">
          <div className="mb-12 flex items-center justify-between">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 font-sans text-[12px] tracking-[0.12em] uppercase text-white/45 hover:text-white transition-colors duration-200"
            >
              <span className="transition-transform duration-200 group-hover:-translate-x-1">
                <IconArrowLeft />
              </span>
              Voltar para a loja
            </Link>

            {book.share_url && (
              <button 
                onClick={handleShare}
                className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.12em] uppercase text-white/45 hover:text-white transition-colors duration-200"
              >
                <IconShare size={14} />
                Compartilhar
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
            <BookCarousel 
              name={book.name} 
              category={book.category} 
              images={book.product_images} 
              badge={book.badge} 
            />
            
            <BookDetails 
              book={book}
              formattedPrice={formattedPrice}
              formattedDiscountPrice={formattedDiscountPrice}
              hasDiscount={hasDiscount}
            />
          </div>
        </main>

        <BookFooter />
      </div>
    </>
  );
}

