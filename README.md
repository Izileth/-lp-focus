# 🌑 Focus Conhecimento — Digital Content Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Motion](https://img.shields.io/badge/Motion-Animações-black?logo=framer&logoColor=white)](https://motion.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

O **Focus Conhecimento** é uma plataforma digital premium que une uma Landing Page de alta conversão para produtos digitais (Ebooks) com um portal de artigos de conhecimento profundo. Desenvolvido com uma stack moderna focada em performance, tipografia refinada e uma experiência de usuário minimalista.

---

## 🗺️ Mapa de Documentação

Para facilitar a navegação técnica e operacional, o projeto está dividido nos seguintes guias especializados:

| Documento | Objetivo | Público |
| :--- | :--- | :--- |
| 📖 [**Guia do Projeto**](./docs/PROJECT_GUIDE.md) | Arquitetura, stack e estrutura de pastas. | Desenvolvedores |
| 🛡️ [**Gestão de Admins**](./docs/SUPABASE_ADMIN_GUIDE.md) | Como promover usuários e gerenciar permissões. | Administradores |
| ✍️ [**Guia de Artigos**](./docs/ARTICLES_FORMATTING_GUIDE.md) | Padrões de escrita e formatação Markdown/GFM. | Editores/Copywriters |
| 🎯 [**Tracking de Ads**](./docs/ADS_TESTING_GUIDE.md) | Teste e validação de rotas de tráfego pago. | Gestores de Tráfego |
| 💳 [**Integração de Pagamentos**](./docs/PAYMENTS_STRIPE_API_GUIDE.md) | Endpoints e fluxos da API de checkout (Stripe/Go). | Desenvolvedores Backend |

---

## ✨ Funcionalidades Principais

- **Funil de Conversão:** Quiz interativo com diagnóstico personalizado e recomendação de produtos.
- **Portal de Conhecimento:** Sistema de artigos com renderização Markdown e SEO otimizado.
- **Painel Administrativo:** Gerenciamento de catálogo, blog e análise de métricas em tempo real.
- **Tracking Inteligente:** Captura de UTMs e métricas de anúncios sem comprometer a performance.
- **UX Premium:** Splash screen dinâmica, transições fluidas e design "Content-first".

## 🚀 Guia Rápido

### Configuração Inicial
```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Rodar em desenvolvimento
npm run dev
```

### Comandos Úteis
- `npm run build`: Gera o pacote de produção otimizado.
- `npm run lint`: Executa a verificação estática de código.
- `npm run preview`: Visualiza o build localmente.

---

## 🎨 Design & Estética

A identidade visual segue o conceito **"Elegância no Contraste"**:
- **Paleta:** Focada em tons de preto, branco e esmeralda para destaques de conversão.
- **Tipografia:** Mix entre *Playfair Display* (autoridade) e *DM Sans* (clareza).
- **Interação:** Feedback tátil e visual em todos os pontos de contato através do Motion.

---

## 🛠️ Stack Tecnológica

- **Frontend:** React 19, TypeScript, React Router 7.
- **Estilização:** Tailwind CSS 4 (PostCSS), Lucide Icons.
- **Backend:** Supabase (PostgreSQL, Auth, RLS, Edge Functions).
- **Conteúdo:** React Markdown + Remark GFM + Rehype Raw.
- **Infra:** Vercel (Edge Runtime).

---
Developed by **Modus Focus** | 2026

