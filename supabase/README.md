# 🚀 INSTRUÇÕES DE DEPLOY - JPL HOSPITALAR

## 📋 EXECUÇÃO DO SQL NO SUPABASE

### Opção 1: SQL Consolidado (RECOMENDADO)

1. Acesse: https://supabase.com/dashboard/project/pbchcijfqlqrhsikxdzj/sql/new
2. Copie TODO o conteúdo do arquivo: `supabase/migration.sql`
3. Cole no SQL Editor
4. Clique em **RUN**
5. Aguarde a mensagem: "MIGRAÇÃO COMPLETA! ✅"

### Opção 2: SQL Separado (se Opção 1 falhar)

Execute os arquivos **nesta ordem**:

1. `supabase/01-schema.sql`
2. `supabase/02-permissions.sql`
3. `supabase/03-triggers.sql`
4. `supabase/04-rls-policies.sql`
5. `supabase/05-reload.sql`

---

## ✅ VERIFICAÇÃO

Após executar o SQL:

1. Recarregue a aplicação: http://localhost:3000/dashboard
2. O erro "Could not find table User" deve desaparecer
3. Você deve ser redirecionado para o login

---

## 🔑 CREDENCIAIS

Após o setup, o trigger criará automaticamente os usuários quando fizerem login pela primeira vez no Supabase Auth.

Para criar um admin manualmente (opcional):

```sql
-- Execute no SQL Editor do Supabase
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
    gen_random_uuid(),
    'admin@jplhospitalar.com.br',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    '{"name": "Administrador", "role": "ADMIN"}'::jsonb
);
```

Ou use a interface do Supabase:
1. Vá em: Authentication > Users > Add user
2. Email: admin@jplhospitalar.com.br
3. Password: admin123
4. User Metadata: `{"name": "Administrador", "role": "ADMIN"}`

---

## 📁 ARQUIVOS GERADOS

```
supabase/
├── migration.sql          ⭐ USE ESTE (arquivo único consolidado)
├── 01-schema.sql          (tabelas e índices)
├── 02-permissions.sql     (GRANT statements)
├── 03-triggers.sql        (sincronização auth→User)
├── 04-rls-policies.sql    (políticas de segurança)
└── 05-reload.sql          (reload cache PostgREST)
```

---

## 🔧 O QUE FOI CRIADO

✅ Tabelas: `User`, `Proposal`
✅ Trigger: `on_auth_user_created` (sincroniza auth.users → User)
✅ RLS Policies: 10 políticas de segurança
✅ Permissions: GRANT para anon, authenticated, service_role
✅ Indexes: userId, email

---

## ⚠️ TROUBLESHOOTING

**Se ainda aparecer erro "table not found":**

1. Execute novamente o arquivo `supabase/05-reload.sql`
2. Limpe o cache do navegador (Ctrl+Shift+R)
3. Reinicie o servidor: `npm run dev`

**Se aparecer "permission denied":**

1. Verifique que executou `02-permissions.sql`
2. Verifique que está usando as credenciais corretas no `.env`

---

## 🎯 PRÓXIMOS PASSOS

1. Execute `supabase/migration.sql` no Supabase SQL Editor
2. Recarregue http://localhost:3000
3. Faça login ou crie um usuário admin
4. Pronto! ✅
