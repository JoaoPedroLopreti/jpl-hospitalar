-- ============================================================================
-- FIX: Store selected product directly on Edital table
-- ============================================================================

-- Add best_product_id to track AI's selected product
ALTER TABLE "Edital" 
  ADD COLUMN IF NOT EXISTS best_product_id UUID REFERENCES "ProdutoCatalogo"(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_edital_best_product ON "Edital"(best_product_id);

SELECT 'Campo best_product_id adicionado à tabela Edital! ✅' as status;
