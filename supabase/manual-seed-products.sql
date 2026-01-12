-- Quick script to insert products manually if seed doesn't work
-- Run this in Supabase SQL Editor

-- First, ensure the columns exist
ALTER TABLE "ProdutoCatalogo" 
ADD COLUMN IF NOT EXISTS "descricao_curta" TEXT,
ADD COLUMN IF NOT EXISTS "aplicacao" TEXT,
ADD COLUMN IF NOT EXISTS "observacoes" TEXT,
ADD COLUMN IF NOT EXISTS "imagem_url" TEXT,
ADD COLUMN IF NOT EXISTS "pdf_url" TEXT;

-- Insert SAT 700
INSERT INTO "ProdutoCatalogo" (
  id, nome, categoria, "descricao_curta", especificacoes, aplicacao, observacoes,
  "custo_base", "imagem_url", "pdf_url", ativo
) VALUES (
  gen_random_uuid(),
  'SAT 700',
  'Aparelhos de Anestesia',
  'Aparelho de anestesia de última geração com tela touchscreen de 15" e rotâmetro digital',
  '["Tela de 15\" Touchscreen (3 gráficos e 2 Loops simultâneos)","Leitura digital do Rotâmetro monitorizada na Tela do Ventilador","Rotâmetro Digital (3 gases)","Filtro Aquecido com By Pass","Suporte para monitores opcionais","Suporte para bomba de infusão (opcional)"]'::jsonb,
  'Utilizado em centros cirúrgicos de alta complexidade, hospitais de grande porte e instituições que demandam tecnologia de ponta para procedimentos anestésicos variados.',
  'Modelo top de linha com máxima tecnologia e recursos avançados de monitoramento.',
  0,
  '/produtos/sat-700.jpg',
  '/produtos/pdfs/sat-700.pdf',
  true
) ON CONFLICT DO NOTHING;

-- Add more products as needed...
-- This is just a manual backup option
