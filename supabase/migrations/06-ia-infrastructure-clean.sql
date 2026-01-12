-- ============================================================================
-- CLEANUP - Remove tudo relacionado ao módulo de IA (se existir)
-- ============================================================================

-- Remover tabelas (CASCADE remove dependências)
DROP TABLE IF EXISTS "LogProcessamento" CASCADE;
DROP TABLE IF EXISTS "PropostaGerada" CASCADE;
DROP TABLE IF EXISTS "Precificacao" CASCADE;
DROP TABLE IF EXISTS "AnaliseProduto" CASCADE;
DROP TABLE IF EXISTS "ProdutoCatalogo" CASCADE;
DROP TABLE IF EXISTS "RequisitosExtraidos" CASCADE;
DROP TABLE IF EXISTS "Edital" CASCADE;

-- Remover ENUMs
DROP TYPE IF EXISTS "PropostaStatus" CASCADE;
DROP TYPE IF EXISTS "TipoRequisito" CASCADE;
DROP TYPE IF EXISTS "EditalStatus" CASCADE;

-- ============================================================================
-- Agora executa a migration completa do 06-ia-infrastructure.sql
-- ============================================================================

-- 1. CREATE ENUMS
CREATE TYPE "EditalStatus" AS ENUM (
  'UPLOADED',
  'PROCESSING',
  'REQUIREMENTS_EXTRACTED',
  'PRODUCT_SELECTED',
  'PRICED',
  'PROPOSAL_GENERATED',
  'READY_FOR_REVIEW',
  'APPROVED',
  'REJECTED'
);

CREATE TYPE "TipoRequisito" AS ENUM (
  'TECNICO',
  'COMERCIAL'
);

CREATE TYPE "PropostaStatus" AS ENUM (
  'DRAFT',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED'
);

-- 2. CREATE TABLES
CREATE TABLE "Edital" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  arquivo_url TEXT,
  status "EditalStatus" NOT NULL DEFAULT 'UPLOADED',
  created_by UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_edital_created_by ON "Edital"(created_by);
CREATE INDEX idx_edital_status ON "Edital"(status);
CREATE INDEX idx_edital_created_at ON "Edital"(created_at DESC);

CREATE TABLE "RequisitosExtraidos" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edital_id UUID NOT NULL REFERENCES "Edital"(id) ON DELETE CASCADE,
  tipo "TipoRequisito" NOT NULL,
  conteudo JSONB NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_requisitos_edital ON "RequisitosExtraidos"(edital_id);

CREATE TABLE "ProdutoCatalogo" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  especificacoes JSONB NOT NULL,
  custo_base DECIMAL(10,2) NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_produto_ativo ON "ProdutoCatalogo"(ativo);
CREATE INDEX idx_produto_categoria ON "ProdutoCatalogo"(categoria);

CREATE TABLE "AnaliseProduto" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edital_id UUID NOT NULL REFERENCES "Edital"(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES "ProdutoCatalogo"(id) ON DELETE CASCADE,
  atende_requisitos BOOLEAN NOT NULL,
  justificativa TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analise_edital ON "AnaliseProduto"(edital_id);
CREATE INDEX idx_analise_produto ON "AnaliseProduto"(produto_id);

CREATE TABLE "Precificacao" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edital_id UUID NOT NULL REFERENCES "Edital"(id) ON DELETE CASCADE,
  custo DECIMAL(10,2) NOT NULL,
  impostos DECIMAL(10,2) NOT NULL,
  frete DECIMAL(10,2) NOT NULL,
  margem DECIMAL(5,2) NOT NULL,
  valor_final DECIMAL(10,2) NOT NULL,
  explicacao TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_precificacao_edital ON "Precificacao"(edital_id);

CREATE TABLE "PropostaGerada" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edital_id UUID NOT NULL REFERENCES "Edital"(id) ON DELETE CASCADE,
  conteudo_tecnico TEXT,
  conteudo_comercial TEXT,
  status "PropostaStatus" NOT NULL DEFAULT 'DRAFT',
  aprovado_por UUID REFERENCES "User"(id) ON DELETE SET NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_proposta_edital ON "PropostaGerada"(edital_id);
CREATE INDEX idx_proposta_status ON "PropostaGerada"(status);

CREATE TABLE "LogProcessamento" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edital_id UUID NOT NULL REFERENCES "Edital"(id) ON DELETE CASCADE,
  etapa TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_log_edital ON "LogProcessamento"(edital_id);
CREATE INDEX idx_log_created_at ON "LogProcessamento"(created_at DESC);

-- 3. RLS
ALTER TABLE "Edital" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RequisitosExtraidos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProdutoCatalogo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AnaliseProduto" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Precificacao" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PropostaGerada" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LogProcessamento" ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Usuários autenticados podem ver editais"
  ON "Edital" FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem criar editais"
  ON "Edital" FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Dono ou Admin pode atualizar edital"
  ON "Edital" FOR UPDATE TO authenticated
  USING (
    auth.uid() = created_by OR 
    EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid() AND role = 'ADMIN')
  );

CREATE POLICY "Apenas Admin pode deletar edital"
  ON "Edital" FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid() AND role = 'ADMIN'));

CREATE POLICY "Usuários autenticados podem ver requisitos"
  ON "RequisitosExtraidos" FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem ver análises"
  ON "AnaliseProduto" FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem ver precificações"
  ON "Precificacao" FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem ver logs"
  ON "LogProcessamento" FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem ver produtos"
  ON "ProdutoCatalogo" FOR SELECT TO authenticated USING (true);

CREATE POLICY "Apenas Admin pode gerenciar produtos"
  ON "ProdutoCatalogo" FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid() AND role = 'ADMIN'));

CREATE POLICY "Usuários autenticados podem ver propostas"
  ON "PropostaGerada" FOR SELECT TO authenticated USING (true);

CREATE POLICY "Apenas Admin pode aprovar propostas"
  ON "PropostaGerada" FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid() AND role = 'ADMIN'));

-- 4. TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_edital_updated_at
  BEFORE UPDATE ON "Edital"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produto_updated_at
  BEFORE UPDATE ON "ProdutoCatalogo"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposta_updated_at
  BEFORE UPDATE ON "PropostaGerada"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. COMENTÁRIOS
COMMENT ON TABLE "Edital" IS 'Editais carregados no sistema para processamento';
COMMENT ON TABLE "RequisitosExtraidos" IS 'Requisitos técnicos/comerciais extraídos (futuramente por IA)';
COMMENT ON TABLE "ProdutoCatalogo" IS 'Catálogo de produtos disponíveis para matching';
COMMENT ON TABLE "AnaliseProduto" IS 'Análise de adequação produto x edital';
COMMENT ON TABLE "Precificacao" IS 'Cálculo de preço final da proposta';
COMMENT ON TABLE "PropostaGerada" IS 'Proposta técnica/comercial gerada';
COMMENT ON TABLE "LogProcessamento" IS 'Auditoria completa de processamento';
