# 📖 Guia Completo do Projeto - Focus Conhecimento

Bem-vindo ao guia central do **Focus Conhecimento**. Este documento serve como o "Mapa da Mina" para desenvolvedores e administradores, consolidando a arquitetura, funcionalidades e referências técnicas do projeto.

---

## 🚀 1. Visão Geral
O **Focus Conhecimento** é uma plataforma digital premium que combina uma Landing Page de alta conversão para ebooks com um portal de artigos de conhecimento profundo. O design é focado em minimalismo, performance e elegância visual (Black & White).

### Objetivos do Projeto:
- **Conversão:** Venda de produtos digitais (Ebooks).
- **Autoridade:** Publicação de artigos formatados via Markdown.
- **Rastreamento:** Monitoramento detalhado de tráfego vindo de anúncios (Google/Meta).
- **Experiência:** Animações fluidas e interface "Content-first".

---

## 🛠️ 2. Stack Tecnológica
O projeto utiliza as tecnologias mais modernas do ecossistema Web:

- **Frontend:** React 19 (com TypeScript)
- **Build Tool:** Vite 7
- **Estilização:** Tailwind CSS 4 (com suporte a Tipografia e PostCSS)
- **Animações:** Motion (antigo Framer Motion)
- **Roteamento:** React Router 7
- **Backend/DB:** Supabase (Auth, PostgreSQL, Storage, Functions)
- **Renderização de Conteúdo:** React Markdown + Rehype Raw + Remark GFM
- **Deploy:** Vercel

---

## 📂 3. Estrutura de Pastas
```text
src/
├── assets/          # Imagens, favicons e recursos estáticos.
├── components/      # Componentes React reutilizáveis.
│   ├── admin/       # Telas e formulários do painel administrativo.
│   ├── auth/        # Componentes de login e autenticação.
│   ├── book/        # Componentes específicos para exibição de livros.
│   ├── profile/     # Gerenciamento de perfil de usuário.
│   └── ui/          # Elementos de interface genéricos (botões, inputs).
├── context/         # Contextos globais (AuthContext).
├── hooks/           # Hooks customizados (Mutations, Data Fetching).
├── lib/             # Clientes de serviços externos (Supabase).
├── pages/           # Páginas principais da aplicação.
├── router/          # Configuração de rotas do React Router.
└── supabase/        # Migrações e funções SQL do banco de dados.
```

---

## ✨ 4. Funcionalidades Principais

### 📖 Catálogo de Ebooks
Gerenciamento completo de produtos digitais com suporte a:
- Descrições detalhadas e bônus.
- Links de checkout dinâmicos.
- Galeria de imagens via Supabase Storage.

### ✍️ Portal de Artigos
Um sistema de blog minimalista onde o conteúdo é escrito em **Markdown**.
- **Guia Relacionado:** [`docs/ARTICLES_FORMATTING_GUIDE.md`](./ARTICLES_FORMATTING_GUIDE.md)

### 📊 Rastreamento de Tráfego (Ads)
O sistema possui rotas inteligentes para capturar cliques de campanhas de tráfego pago e salvá-los na tabela `interactions`.
- **Guia Relacionado:** [`docs/ADS_TESTING_GUIDE.md`](./ADS_TESTING_GUIDE.md)

### 🛡️ Painel Administrativo
Área restrita para gerenciamento de produtos, artigos e visualização de estatísticas.
- **Guia Relacionado:** [`docs/SUPABASE_ADMIN_GUIDE.md`](./SUPABASE_ADMIN_GUIDE.md)

---

## 🗄️ 5. Banco de Dados & Segurança (Supabase)

O projeto utiliza **Row Level Security (RLS)** para garantir que apenas administradores possam modificar dados sensíveis.

### Tabelas Principais:
- `products`: Cadastro de ebooks.
- `articles`: Conteúdo do portal de conhecimento.
- `profiles`: Dados estendidos dos usuários.
- `interactions`: Log de acessos e cliques de anúncios.
- `newsletter`: Lista de e-mails inscritos.
- `admin_users`: Lista de UUIDs autorizados como administradores.

### Migrações:
Todas as alterações de banco estão documentadas na pasta `supabase/migrations/`, seguindo uma ordem cronológica de `0000` a `0024+`.

---

## 💻 6. Fluxo de Desenvolvimento

### Configuração Inicial:
1. Instale as dependências: `npm install`.
2. Configure o arquivo `.env` com as chaves do Supabase (use `.env.example` como base).
3. Execute o servidor local: `npm run dev`.

### Padrões de Código:
- **Tipagem:** TypeScript é obrigatório para novos componentes e hooks.
- **Estilo:** Use classes utilitárias do Tailwind 4. Evite CSS puro sempre que possível.
- **Animações:** Use as variantes definidas em `src/motionVariants.ts` para manter a consistência.

---

## 🚀 7. Deploy
O deploy é automatizado via **Vercel**. Toda alteração na `main` dispara um novo build.
O arquivo `vercel.json` contém as regras de redirecionamento para garantir que as rotas do React Router funcionem corretamente.

---

*Última atualização: 22 de Março de 2026*
