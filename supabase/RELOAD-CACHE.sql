-- ============================================
-- RELOAD POSTGREST CACHE
-- Cole APENAS este comando no Supabase SQL Editor
-- ============================================

NOTIFY pgrst, 'reload schema';

SELECT 'Cache do PostgREST recarregado com sucesso! ✅' as status;
