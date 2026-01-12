-- ============================================================================
-- CRIAÇÃO MANUAL DO USUÁRIO TÉCNICO (BYPASS TOTAL)
-- ============================================================================

BEGIN;

-- 1. Garantir extensão de criptografia
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Remover temporariamente o Trigger para evitar conflitos/erros
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Remover usuário antigo se existir (limpeza)
DELETE FROM public."User" WHERE email = 'tecnico@jplhospitalar.com.br';
DELETE FROM auth.users WHERE email = 'tecnico@jplhospitalar.com.br';

-- 4. Inserir na tabela de Autenticação (auth.users)
-- Gera um novo ID
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'tecnico@jplhospitalar.com.br',
    crypt('tecnico123', gen_salt('bf')), -- Senha criptografada
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Técnico Teste", "role": "TECHNICIAN"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- 5. Inserir na tabela Pública (public.User)
-- Precisamos pegar o ID que acabamos de gerar. Como é insert único, podemos usar subselect ou variavel.
-- Vamos fazer insert via select para garantir o ID correto.
INSERT INTO public."User" (id, email, name, role)
SELECT 
    id, 
    email, 
    raw_user_meta_data->>'name', 
    'TECHNICIAN'
FROM auth.users 
WHERE email = 'tecnico@jplhospitalar.com.br';

-- 6. Restaurar o Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

COMMIT;

SELECT 'Usuário Técnico criado com sucesso!' as resultado;
