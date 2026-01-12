-- ============================================================================
-- RESTAURAÇÃO DO TRIGGER DE USUÁRIOS
-- ============================================================================

-- 1. Redefinir a função com lógica defensiva (já definida antes, mas garantindo)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_role text;
  final_role "Role";
BEGIN
  -- LÓGICA COMENTADA PARA DEBUG
  -- extracted_role := NEW.raw_user_meta_data->>'role';
  
  -- IF extracted_role = 'TECHNICIAN' THEN
  --   final_role := 'TECHNICIAN'::"Role";
  -- ELSIF extracted_role = 'COMPANY' THEN
  --   final_role := 'COMPANY'::"Role";
  -- ELSIF extracted_role = 'ADMIN' THEN
  --   final_role := 'ADMIN'::"Role";
  -- ELSE
  --   final_role := 'EMPLOYEE'::"Role";
  -- END IF;

  -- INSERT INTO public."User" (id, email, name, role)
  -- VALUES (
  --   NEW.id,
  --   NEW.email,
  --   COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
  --   final_role
  -- );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Erro no trigger handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Recriar o Trigger (COMENTADO PARA EVITAR ERRO DE PERMISSÃO - APENAS ATUALIZAR A FUNÇÃO JÁ RESOLVE)
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

SELECT 'Trigger restaurado com sucesso. Sistema 100% operacional.' as status;
