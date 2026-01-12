-- ============================================
-- TRIGGER DE SINCRONIZAÇÃO - JPL HOSPITALAR
-- Cole este SQL no Supabase SQL Editor e execute
-- ============================================

-- Função para sincronizar auth.users com User
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

-- Trigger que executa quando usuário é criado no auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sincronizar usuários existentes do auth.users
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
