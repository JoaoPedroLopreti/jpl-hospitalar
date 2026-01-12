-- ============================================================================
-- FIX: Add missing fields to AnaliseProduto table
-- ============================================================================

-- Add score_adequacao and detalhes_analise columns
ALTER TABLE "AnaliseProduto" 
  ADD COLUMN IF NOT EXISTS score_adequacao INTEGER DEFAULT 0;

ALTER TABLE "AnaliseProduto" 
  ADD COLUMN IF NOT EXISTS detalhes_analise JSONB;

-- Update NULL values to 0
UPDATE "AnaliseProduto" 
SET score_adequacao = 0 
WHERE score_adequacao IS NULL;

-- Make score_adequacao NOT NULL after updating existing rows
ALTER TABLE "AnaliseProduto" 
  ALTER COLUMN score_adequacao SET NOT NULL;

SELECT 'Campos score_adequacao e detalhes_analise adicionados à tabela AnaliseProduto! ✅' as status;
