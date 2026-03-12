// src/constants.ts
import type { Book } from "./types";
import Image from "./assets/images/image.jpg";
import Image2 from "./assets/images/image2.jpg";
import Image3 from "./assets/images/image3.jpg";
import Image4 from "./assets/images/image4.jpg";

export const BOOKS: Book[] = [
  {
    id: 1,
    title: "O Código Alfa",
    category: "Liderança",
    price: "R$ 29,90",
    pages: "10 páginas",
    badge: "Mais Vendido",
    imageUrl: Image,
    checkoutUrl: "https://pay.kiwify.com.br/FRT40YQ",
    description:
      "Descubra os princípios mentais e comportamentais que diferenciam líderes comuns dos líderes de alta performance. Um guia prático para desenvolver autoconfiança, disciplina e visão estratégica no dia a dia.",
  },
  {
    id: 2,
    title: "Finanças Pessoais na Prática",
    category: "Finanças",
    price: "R$ 24,90",
    pages: "12 páginas",
    badge: "Novo",
    imageUrl: Image2,
    checkoutUrl: "https://pay.kiwify.com.br/FRT40YQ",
    description:
      "Aprenda a gerenciar suas finanças pessoais de forma eficiente e estratégica. Um guia completo para construir uma base sólida de economia pessoal e alcançar estabilidade financeira.",
  },
  {
    id: 3,
    title: "Liderança Sem Título",
    category: "Liderança",
    price: "R$ 34,90",
    pages: "10 páginas",
    badge: null,
    imageUrl: Image3,
    checkoutUrl: "https://pay.kiwify.com.br/FRT40YQ",
    description:
      "Você não precisa de cargo para ser líder. Este livro mostra como assumir protagonismo, influenciar positivamente pessoas e construir autoridade através de atitudes, responsabilidade e consistência.",
  },
  {
    id: 4,
    title: "Foco: A Arte de Não se Distrair",
    category: "Produtividade",
    price: "R$ 27,90",
    pages: "12 páginas",
    badge: "Destaque",
    imageUrl: Image4,
    checkoutUrl: "https://pay.kiwify.com.br/FRT40YQ",
    description:
      "Em um mundo cheio de distrações, manter o foco virou um superpoder. Aprenda técnicas práticas para eliminar ruídos, aumentar sua produtividade e concluir o que realmente importa.",
  },
];

export const NAV_LINKS = ["Ebooks", "Sobre", "Contato"] as const;
export const FOOT_LINKS = [
  { label: "Termos", path: "/termos" },
  { label: "Privacidade", path: "/privacidade" },
  { label: "Contato", path: "/contato" },
] as const;
  

export const videoPlaylist = [
    "https://ik.imagekit.io/558cckkpv/Modus_focus_featured_5.mp4?updatedAt=1773333682481",
    "https://ik.imagekit.io/558cckkpv/Modus_focus_featured_7.mp4?updatedAt=1773333689810",
    "https://ik.imagekit.io/558cckkpv/Modus_focus_featured_2.mp4?tr=orig&updatedAt=1773333673948",
    "https://ik.imagekit.io/558cckkpv/modus_focus_featured_video.mp4?updatedAt=1773333671949",
    "https://ik.imagekit.io/558cckkpv/Modus_focus_featured_6.mp4?updatedAt=1773333661549"
  ];