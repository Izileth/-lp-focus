# Guia de Gerenciamento de Administradores (Supabase)

[← Voltar para o Guia do Projeto](./PROJECT_GUIDE.md)

Este documento descreve como promover usuários ao cargo de administrador para acessar o painel de controle (`/admin`). Ser um administrador é essencial para gerenciar produtos, artigos e visualizar métricas de tráfego.

O sistema utiliza uma tabela dedicada chamada `admin_users` e uma função de segurança `is_admin()`.

## 1. Localizando o ID do Usuário (UUID)

Antes de promover um usuário, você precisa do seu `id` único (UUID):
1. Acesse o **Dashboard do Supabase**.
2. Vá em **Authentication** > **Users**.
3. Copie o valor da coluna **User ID** do usuário desejado.

---

## 2. Promovendo o Primeiro Administrador

Como a função `add_admin_user` exige que quem a chama já seja um admin, o primeiro administrador deve ser adicionado manualmente via SQL:

1. Vá no **SQL Editor** do Supabase.
2. Execute o seguinte comando (substituindo o UUID pelo que você copiou):

```sql
INSERT INTO admin_users (user_id)
VALUES ('COLE-AQUI-O-UUID-DO-USUARIO');
```

---

## 3. Promovendo Novos Administradores (Via Interface)

Uma vez que você já tenha um usuário admin, ele pode promover outros usuários diretamente pelo sistema (se houver interface para isso) ou via comando SQL chamando a função de segurança:

```sql
-- Este comando só funciona se executado por um admin autenticado
SELECT add_admin_user('UUID-DO-NOVO-ADMIN');
```

---

## 4. Removendo Privilégios de Administrador

Para remover o acesso de admin de um usuário, basta deletar a linha correspondente na tabela `admin_users`:

```sql
DELETE FROM admin_users 
WHERE user_id = 'UUID-DO-USUARIO';
```

---

## 5. Como funciona tecnicamente?

- **Tabela `admin_users`**: Armazena apenas os IDs dos usuários autorizados.
- **Função `is_admin()`**: Verificada em todas as Políticas de Segurança (RLS). Se o `auth.uid()` do usuário logado estiver na tabela, ele tem permissão total.
- **Segurança (RLS)**: As tabelas `products`, `product_images` e `profiles` possuem políticas que permitem `INSERT`, `UPDATE` e `DELETE` apenas se `is_admin()` retornar `true`.
