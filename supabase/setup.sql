-- Função para criar user automaticamente quando um novo usuário é criado no auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."User" (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'role')::text, 'EMPLOYEE')::"Role"
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ativar RLS na tabela User
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Políticas para User
-- Usuário pode ver seu próprio perfil
CREATE POLICY "Users can view their own profile"
ON "User"
FOR SELECT
USING (auth.uid() = id);

-- Admin pode ver todos os usuários
CREATE POLICY "Admins can view all users"
ON "User"
FOR SELECT
USING ((SELECT role FROM "User" WHERE id = auth.uid()) = 'ADMIN');

-- Usuário pode atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
ON "User"
FOR UPDATE
USING (auth.uid() = id);

-- Ativar RLS na tabela Proposal
ALTER TABLE "Proposal" ENABLE ROW LEVEL SECURITY;

-- Políticas para Proposal
-- Usuário pode ver suas próprias propostas OU admin pode ver todas
CREATE POLICY "Users can view their own proposals"
ON "Proposal"
FOR SELECT
USING (
  auth.uid() = "userId"
  OR
  (SELECT role FROM "User" WHERE id = auth.uid()) = 'ADMIN'
);

-- Usuário pode criar proposta com seu próprio userId
CREATE POLICY "Users can create their own proposals"
ON "Proposal"
FOR INSERT
WITH CHECK (auth.uid() = "userId");

-- Usuário pode atualizar suas próprias propostas
CREATE POLICY "Users can update their own proposals"
ON "Proposal"
FOR UPDATE
USING (auth.uid() = "userId");

-- Admin pode fazer tudo em Proposal
CREATE POLICY "Admins can do everything on proposals"
ON "Proposal"
FOR ALL
USING ((SELECT role FROM "User" WHERE id = auth.uid()) = 'ADMIN');
