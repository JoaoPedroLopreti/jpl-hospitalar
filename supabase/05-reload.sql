-- ============================================
-- RELOAD POSTGREST CACHE - JPL HOSPITALAR
-- Cole este SQL no Supabase SQL Editor e execute
-- ============================================

-- Recarregar o schema cache do PostgREST
NOTIFY pgrst, 'reload schema';

-- Verificar se tudo foi criado corretamente
SELECT 
    'Schema completo! Verifique as tabelas criadas:' as status,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'User') as user_table,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Proposal') as proposal_table,
    (SELECT COUNT(*) FROM pg_trigger WHERE tgname = 'on_auth_user_created') as trigger_exists;
