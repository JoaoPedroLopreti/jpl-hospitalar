-- ============================================================================
-- FIX: CORREÇÃO DA CRIAÇÃO DE USUÁRIOS
-- ============================================================================

-- 1. Garantir que os Roles existem
-- Nota: O Postgres não permite ALTER TYPE dentro de transação em algumas versões/contextos.
-- Se der erro, tente rodar apenas estas linhas separadamente.
COMMIT; -- Tenta fechar transação anterior se houver
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'TECHNICIAN';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'COMPANY';

-- 2. Tornar a função de trigger mais robusta
-- Isso evita que o erro no banco de dados bloqueie a criação do usuário no Auth.
-- Se falhar a inserção na tabela public.User, o usuário será criado no Auth de qualquer forma.
-- Depois, o script de sync pode corrigir.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  desired_role "Role";
BEGIN
  -- Tenta converter o role do metadata, ou usa EMPLOYEE se falhar/nulo
  BEGIN
    desired_role := COALESCE((NEW.raw_user_meta_data->>'role')::"Role", 'EMPLOYEE'::"Role");
  EXCEPTION WHEN OTHERS THEN
    desired_role := 'EMPLOYEE'::"Role";
  END;

  INSERT INTO public."User" (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    desired_role
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Em caso de erro fatal (ex: violação de constraint que escapou), loga e prossegue
    RAISE WARNING 'Erro ao criar usuário na tabela public.User: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
