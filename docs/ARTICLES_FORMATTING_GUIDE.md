# ✍️ Guia de Formatação de Artigos - Focus Conhecimento

[← Início (README.md)](../README.md) | [← Guia do Projeto](./PROJECT_GUIDE.md)

Este guia orienta como utilizar o editor de artigos para manter a consistência visual e a elegância do portal. O sistema agora utiliza **Markdown** para renderizar o conteúdo, o que facilita a escrita e leitura.

Os artigos são criados e editados exclusivamente no painel administrativo (`/admin`) por usuários com privilégios de administrador.

---

## 1. Estrutura do Artigo

Cada artigo é composto por três partes principais no painel administrativo:

1.  **Título:** O nome principal do artigo (exibido em destaque H1).
2.  **Resumo (Excerpt):** Um parágrafo curto (2-3 linhas) que aparece nos cards da listagem. Use apenas texto puro.
3.  **Conteúdo:** O corpo do texto onde você utiliza a sintaxe Markdown abaixo.

---

## 2. Elementos de Texto

### Títulos de Seção
Não utilize `#` (H1) dentro do conteúdo (o sistema já gera o H1 automaticamente com o título). Use `##` para seções principais e `###` para subseções.

```markdown
## O Despertar da Criatividade
Texto da seção...

### Práticas Diárias
Texto da subseção...
```

### Parágrafos e Quebras
Para criar um novo parágrafo, basta deixar uma linha em branco. Para uma quebra de linha simples, use dois espaços ao final da linha.

```markdown
Este é um parágrafo longo que foca na profundidade do conhecimento.

Este parágrafo aparecerá com um espaçamento elegante abaixo do anterior.
```

### Ênfase Inline
| Objetivo | Como escrever | Resultado Visual |
| :--- | :--- | :--- |
| **Negrito** | `**texto**` | **texto** |
| *Itálico* | `*texto*` | *texto* |
| **Código** | `` `texto` `` | `texto` |
| **Link** | `[nome](url)` | Link clicável |

---

## 3. Elementos Avançados

### Citações (Blockquotes)
Para destacar frases de autores ou trechos importantes.

```markdown
> "A simplicidade é o último grau de sofisticação." 
> — Leonardo da Vinci
```

### Listas
As listas já estão formatadas com marcadores minimalistas.

**Lista Não Ordenada:**
```markdown
* Foco profundo (Deep Work)
* Meditação matinal
* Leitura ativa
```

**Lista Ordenada:**
```markdown
1. Defina sua meta
2. Elimine distrações
3. Execute com presença
```

---

## 4. Imagens e Mídia

### Imagens no Corpo do Texto
Embora o formulário tenha uma "Imagem de Capa", você pode inserir imagens no meio do texto usando o link gerado após o upload no Supabase.

```markdown
![Descrição da imagem](URL_DA_IMAGEM)
```

---

## 5. Dicas de Design (Look & Feel)

1.  **Menos é Mais:** Evite excesso de negrito. Use-o apenas para conceitos-chave.
2.  **Ritmo de Leitura:** Quebre textos longos com títulos (`##`) a cada 3 ou 4 parágrafos para facilitar a leitura no mobile.
3.  **Suporte GFM:** O sistema suporta tabelas, listas de tarefas e outras funcionalidades do GitHub Flavored Markdown.

---

## Exemplo de Artigo Markdown (Copie e Cole para Testar)

```markdown
Vivemos em uma era de ruído constante. A habilidade de silenciar as distrações não é apenas um luxo, mas uma necessidade estratégica.

## O Poder do Minimalismo Digital
Reduzir o número de entradas de informação permite que o cérebro processe o que realmente importa.

* Desative notificações não essenciais.
* Defina blocos de tempo para e-mails.

> "Sua atenção é o seu recurso mais valioso. Onde você a coloca, sua energia flui."

Ao aplicar estas técnicas, você notará um aumento imediato na clareza mental.
```
