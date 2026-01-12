-- ============================================
-- ROW LEVEL SECURITY (RLS) - JPL HOSPITALAR
-- Cole este SQL no Supabase SQL Editor e execute
-- ============================================

-- Ativar RLS nas tabelas
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Proposal" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS PARA TABELA "User"
-- ============================================

-- Política: Usuários podem ver seu próprio perfil
DROP POLICY IF EXISTS "Users can view their own profile" ON "User";
CREATE POLICY "Users can view their own profile"
ON "User" FOR SELECT
USING (auth.uid() = id);

-- Política: Admins podem ver todos os usuários
DROP POLICY IF EXISTS "Admins can view all users" ON "User";
CREATE POLICY "Admins can view all users"
ON "User" FOR SELECT
USING ((SELECT role FROM "User" WHERE id = auth.uid()) = 'ADMIN');

-- Política: Usuários podem atualizar seu próprio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON "User";
CREATE POLICY "Users can update own profile"
ON "User" FOR UPDATE
USING (auth.uid() = id);

-- Política: Sistema pode inserir usuários (trigger)
DROP POLICY IF EXISTS "System can insert users" ON "User";
CREATE POLICY "System can insert users"
ON "User" FOR INSERT
WITH CHECK (true);

-- ============================================
-- POLÍTICAS PARA TABELA "Proposal"
-- ============================================

-- Política: Usuários podem ver suas próprias propostas
DROP POLICY IF EXISTS "Users can view their own proposals" ON "Proposal";
CREATE POLICY "Users can view their own proposals"
ON "Proposal" FOR SELECT
USING (
    auth.uid() = "userId"
    OR
    (SELECT role FROM "User" WHERE id = auth.uid()) = 'ADMIN'
);

-- Política: Usuários podem criar suas próprias propostas
DROP POLICY IF EXISTS "Users can create their own proposals" ON "Proposal";
CREATE POLICY "Users can create their own proposals"
ON "Proposal" FOR INSERT
WITH CHECK (auth.uid() = "userId");

-- Política: Usuários podem atualizar suas próprias propostas
DROP POLICY IF EXISTS "Users can update their own proposals" ON "Proposal";
CREATE POLICY "Users can update their own proposals"
ON "Proposal" FOR UPDATE
USING (auth.uid() = "userId");

-- Política: Usuários podem deletar suas próprias propostas
DROP POLICY IF EXISTS "Users can delete their own proposals" ON "Proposal";
CREATE POLICY "Users can delete their own proposals"
ON "Proposal" FOR DELETE
USING (auth.uid() = "userId");

-- Política: Admins podem fazer tudo com propostas
DROP POLICY IF EXISTS "Admins can do everything on proposals" ON "Proposal";
CREATE POLICY "Admins can do everything on proposals"
ON "Proposal" FOR ALL
USING ((SELECT role FROM "User" WHERE id = auth.uid()) = 'ADMIN');
