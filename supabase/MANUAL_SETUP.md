# 🔧 Guia de Configuração Manual do Supabase

Como o Prisma está com problemas de encoding no Windows, vamos configurar o banco diretamente no Supabase.

## Passo 1: Criar Tabelas

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**  
3. Clique em **New query**
4. Cole o conteúdo do arquivo [`create-tables.sql`](file:///c:/Jpl%20Online/jpl-hospitalar/supabase/create-tables.sql)
5. Clique em **Run** (ou pressione Ctrl+Enter)

✅ Isso criará as tabelas `User` e `Proposal` com o enum `Role`.

---

## Passo 2: Configurar Trigger de Sincronização

1. No **SQL Editor**, crie uma **nova query**
2. Cole o script abaixo:

```sql
-- Função para criar user automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."User" (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'role')::"Role", 'EMPLOYEE')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

3. Clique em **Run**

✅ Agora quando um usuário é criado no Supabase Auth, ele será automaticamente adicionado à tabela `User`.

---

## Passo 3: Configurar Row Level Security (RLS)

1. No **SQL Editor**, crie uma **nova query**
2. Cole o script do arquivo [`setup.sql`](file:///c:/Jpl%20Online/jpl-hospitalar/supabase/setup.sql) (a partir da linha `ALTER TABLE "User"...`)
3. Clique em **Run**

✅ As políticas RLS garantirão que:
- Funcionários vejam apenas suas propostas
- Admin veja tudo
- Ninguém possa acessar dados que não deveria

---

## Passo 4: Verificar Tabelas

1. Vá em **Table Editor** no menu lateral
2. Você deve ver:
   - ✅ `User`
   - ✅ `Proposal`
3. Clique em cada uma para ver a estrutura

---

## Passo 5: Criar Usuário Admin de Teste

1. No **SQL Editor**, execute:

```sql
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'admin@jplhospitalar.com.br',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"name": "Administrador", "role": "ADMIN"}',
  now(),
  now()
);
```

⚠️ **Nota**: Este é um SQL avançado. Se der erro, use o painel de autenticação:
- Authentication → Users → Add user
- Email: `admin@jplhospitalar.com.br`
- Password: `admin123`
- Metadata: `{"name": "Administrador", "role": "ADMIN"}`

Depois, atualize o role manualmente:

```sql
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'admin@jplhospitalar.com.br';
```

---

## Passo 6: Verificar Configuração

Execute no **SQL Editor**:

```sql
-- Ver tabelas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Ver usuários
SELECT * FROM "User";

-- Ver se RLS está ativo
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';
```

---

## ✅ Próximos Passos

Após executar todos os scripts acima, volte aqui e me avise que concluiu. Vou então:
1. Atualizar o código da aplicação para usar Supabase Auth
2. Testar o login
3. Verificar as permissões

---

## ⚠️ Problemas Comuns

### Erro: "relation does not exist"
- Certifique-se de executar `create-tables.sql` primeiro

### Erro: "function already exists"
- Normal se executar múltiplas vezes. Use `CREATE OR REPLACE FUNCTION`

### RLS bloqueando tudo
- Desative temporariamente: `ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;`
- Re-ative depois: `ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;`
