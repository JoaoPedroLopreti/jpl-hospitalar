-- Migration: Add catalog fields to ProdutoCatalogo table
-- Date: 2025-12-31

-- Add new columns to ProdutoCatalogo for complete catalog functionality
ALTER TABLE "ProdutoCatalogo" 
ADD COLUMN IF NOT EXISTS "descricao_curta" TEXT,
ADD COLUMN IF NOT EXISTS "aplicacao" TEXT,
ADD COLUMN IF NOT EXISTS "observacoes" TEXT,
ADD COLUMN IF NOT EXISTS "imagem_url" TEXT,
ADD COLUMN IF NOT EXISTS "pdf_url" TEXT;

-- Verify the changes
COMMENT ON COLUMN "ProdutoCatalogo"."descricao_curta" IS 'Descrição resumida do produto para listagens';
COMMENT ON COLUMN "ProdutoCatalogo"."aplicacao" IS 'Descrição das aplicações do produto';
COMMENT ON COLUMN "ProdutoCatalogo"."observacoes" IS 'Observações adicionais sobre o produto';
COMMENT ON COLUMN "ProdutoCatalogo"."imagem_url" IS 'URL da imagem do produto';
COMMENT ON COLUMN "ProdutoCatalogo"."pdf_url" IS 'URL do catálogo PDF do produto';
