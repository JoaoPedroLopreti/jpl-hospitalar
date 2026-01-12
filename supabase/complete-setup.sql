-- ============================================
-- SCRIPT COMPLETO DE SETUP - JPL HOSPITALAR
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- 1. Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Criar tipo ENUM para Role
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('EMPLOYEE', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Criar tabela User
CREATE TABLE IF NOT EXISTS "User" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Criar tabela Proposal
CREATE TABLE IF NOT EXISTS "Proposal" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE
);

-- 5. Criar índices
CREATE INDEX IF NOT EXISTS "Proposal_userId_idx" ON "Proposal"("userId");

-- 6. CONCEDER PERMISSÕES (CRÍTICO para PostgREST)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 7. Configurar permissões padrão para tabelas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 8. Criar função de sincronização de usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public."User" (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'role')::"Role", 'EMPLOYEE'::"Role")
    );
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Criar trigger para sincronização automática
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Sincronizar usuários existentes do auth.users
INSERT INTO public."User" (id, email, name, role)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', au.email) as name,
    COALESCE((au.raw_user_meta_data->>'role')::"Role", 'EMPLOYEE'::"Role") as role
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public."User" u WHERE u.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- 11. Ativar Row Level Security
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Proposal" ENABLE ROW LEVEL SECURITY;

-- 12. Criar políticas RLS para User
DROP POLICY IF EXISTS "Users can view their own profile" ON "User";
CREATE POLICY "Users can view their own profile"
ON "User" FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON "User";
CREATE POLICY "Admins can view all users"
ON "User" FOR SELECT
USING ((SELECT role FROM "User" WHERE id = auth.uid()) = 'ADMIN');

DROP POLICY IF EXISTS "Users can update own profile" ON "User";
CREATE POLICY "Users can update own profile"
ON "User" FOR UPDATE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "System can insert users" ON "User";
CREATE POLICY "System can insert users"
ON "User" FOR INSERT
WITH CHECK (true);

-- 13. Criar políticas RLS para Proposal
DROP POLICY IF EXISTS "Users can view their own proposals" ON "Proposal";
CREATE POLICY "Users can view their own proposals"
ON "Proposal" FOR SELECT
USING (
    auth.uid() = "userId"
    OR
    (SELECT role FROM "User" WHERE id = auth.uid()) = 'ADMIN'
);

DROP POLICY IF EXISTS "Users can create their own proposals" ON "Proposal";
CREATE POLICY "Users can create their own proposals"
ON "Proposal" FOR INSERT
WITH CHECK (auth.uid() = "userId");

DROP POLICY IF EXISTS "Users can update their own proposals" ON "Proposal";
CREATE POLICY "Users can update their own proposals"
ON "Proposal" FOR UPDATE
USING (auth.uid() = "userId");

DROP POLICY IF EXISTS "Admins can do everything on proposals" ON "Proposal";
CREATE POLICY "Admins can do everything on proposals"
ON "Proposal" FOR ALL
USING ((SELECT role FROM "User" WHERE id = auth.uid()) = 'ADMIN');

-- 14. Recarregar schema cache do PostgREST (IMPORTANTE!)
NOTIFY pgrst, 'reload schema';

-- ============================================
-- FIM DO SCRIPT
-- ============================================

SELECT 'Setup completo! Todas as tabelas, triggers e permissões foram configuradas.' as status;
