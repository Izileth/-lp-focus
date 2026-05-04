# 🎯 Guia de Teste de Rotas de Anúncios (Google Ads / Facebook Ads)

[← Início (README.md)](../README.md) | [← Guia do Projeto](./PROJECT_GUIDE.md)

Este guia explica como utilizar e testar as novas rotas amigáveis criadas para rastreamento de campanhas de tráfego pago.

## 🚀 Estrutura da Rota

A nova rota segue o padrão:
`seu-site.com/lp/:section/:source/:campaign/:adgroup/:ad`

| Parâmetro | Descrição | Exemplos |
| :--- | :--- | :--- |
| `:section` | O ID da seção para onde o usuário deve ser rolado. | `livros`, `sobre`, `contato`, `newsletter`, `home` |
| `:source` | Fonte de tráfego (UTM Source). | `google`, `facebook`, `instagram`, `email` |
| `:campaign` | Nome da campanha (UTM Campaign). | `blackfriday`, `lancamento-2024`, `branding` |
| `:adgroup` | Conjunto de anúncios (Ad Group). | `público-frio`, `remarketing`, `interesses` |
| `:ad` | Identificador do anúncio (Ad ID). | `video-01`, `banner-red`, `carrossel` |

---

## 🧪 Links de Teste (Copie e Cole no Navegador)

Abaixo estão exemplos prontos para validar o funcionamento do scroll e do rastreamento:

### 1. Testar Seção de Livros (Google Ads)
```
http://localhost:5173/lp/livros/google/search/livros-financas/grupo-01/ad-texto-01
```
*   **Esperado:** O site deve carregar e rolar suavemente até a seção de Catálogo de Livros.

### 2. Testar Seção Sobre Nós (Facebook Ads)
```
http://localhost:5173/lp/sobre/facebook/feed/promocao-abril/publico-alvo/video-institucional
```
*   **Esperado:** O site deve carregar e rolar suavemente até a seção "Sobre Nós".

### 3. Testar Seção de Contato (Instagram)
```
http://localhost:5173/lp/contato/instagram/stories/suporte-rapido/engajamento/sticker-pergunta
```
*   **Esperado:** O site deve carregar e rolar suavemente até a seção de Contato.

---

## 📊 Validação de Rastreamento (Supabase)

Toda vez que uma dessas URLs é acessada, o sistema registra uma interação no banco de dados. Para verificar se está funcionando:

1. Acesse o dashboard do seu projeto no **Supabase**.
2. Vá em **Table Editor** > selecione a tabela `interactions`.
3. Procure por entradas onde `type` seja igual a `ads_click`.
4. Verifique a coluna `metadata` (JSON), que deve conter:
   - `source`
   - `campaign`
   - `adgroup`
   - `ad`
   - `url` (URL completa acessada)
   - `user_agent` (Dispositivo do usuário)

---

## 🛠️ Aliases de Seção (Mapeamento)

A rota é inteligente e entende tanto o ID técnico quanto termos comuns:

- **Livros:** `livros`, `books`, `catalog`, `catalogo`
- **Sobre:** `sobre`, `about`, `empresa`
- **Contato:** `contato`, `contact`, `suporte`
- **Newsletter:** `newsletter`, `inscrever`, `news`
- **Home:** `home`, `hero`, `topo`
---

## 🛡️ Filtro de Administradores

Para garantir que os dados de conversão sejam reais, o sistema **não registra interações de administradores**. 

Se você estiver logado com uma conta administrativa (registrada na tabela `admin_users`), os cliques **não serão salvos** na tabela `interactions`. Para testar o rastreamento, utilize uma aba anônima ou uma conta de usuário comum.
