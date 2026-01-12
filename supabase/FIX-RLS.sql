-- ============================================
-- CORRIGIR POLÍTICAS RLS - JPL HOSPITALAR
-- Cole este SQL no Supabase SQL Editor
-- ============================================

-- Remover todas as políticas antigas
DROP POLICY IF EXISTS "Users can view their own profile" ON "User";
DROP POLICY IF EXISTS "Admins can view all users" ON "User";
DROP POLICY IF EXISTS "Users can update own profile" ON "User";
DROP POLICY IF EXISTS "System can insert users" ON "User";
DROP POLICY IF EXISTS "Users can view their own proposals" ON "Proposal";
DROP POLICY IF EXISTS "Users can create their own proposals" ON "Proposal";
DROP POLICY IF EXISTS "Users can update their own proposals" ON "Proposal";
DROP POLICY IF EXISTS "Users can delete their own proposals" ON "Proposal";
DROP POLICY IF EXISTS "Admins can do everything on proposals" ON "Proposal";

-- ============================================
-- CRIAR FUNÇÃO AUXILIAR PARA VERIFICAR ROLE
-- ============================================

CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS "Role" AS $$
BEGIN
    RETURN (SELECT role FROM "User" WHERE id = user_id LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- POLÍTICAS CORRIGIDAS PARA "User"
-- ============================================

-- Usuários podem ver todos os perfis (necessário para evitar recursão)
CREATE POLICY "Enable read access for authenticated users"
ON "User" FOR SELECT
TO authenticated
USING (true);

-- Service role pode fazer tudo
CREATE POLICY "Enable all for service role"
ON "User" FOR ALL
TO service_role
USING (true);

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile"
ON "User" FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Sistema pode inserir usuários (para o trigger)
CREATE POLICY "System can insert users"
ON "User" FOR INSERT
TO authenticated, anon, service_role
WITH CHECK (true);

-- ============================================
-- POLÍTICAS CORRIGIDAS PARA "Proposal"
-- ============================================

-- Usuários podem ver suas próprias propostas OU admins veem tudo
CREATE POLICY "Users can view proposals"
ON "Proposal" FOR SELECT
TO authenticated
USING (
    auth.uid() = "userId"
    OR
    public.get_user_role(auth.uid()) = 'ADMIN'
);

-- Usuários podem criar suas próprias propostas
CREATE POLICY "Users can create proposals"
ON "Proposal" FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

-- Usuários podem atualizar suas próprias propostas OU admins atualizam tudo
CREATE POLICY "Users can update proposals"
ON "Proposal" FOR UPDATE
TO authenticated
USING (
    auth.uid() = "userId"
    OR
    public.get_user_role(auth.uid()) = 'ADMIN'
);

-- Usuários podem deletar suas próprias propostas OU admins deletam tudo
CREATE POLICY "Users can delete proposals"
ON "Proposal" FOR DELETE
TO authenticated
USING (
    auth.uid() = "userId"
    OR
    public.get_user_role(auth.uid()) = 'ADMIN'
);

-- Service role pode fazer tudo em Proposal
CREATE POLICY "Enable all for service role on proposals"
ON "Proposal" FOR ALL
TO service_role
USING (true);

-- ============================================
-- RELOAD CACHE
-- ============================================

NOTIFY pgrst, 'reload schema';

SELECT 'Políticas RLS corrigidas! Recursão infinita resolvida. ✅' as status;
