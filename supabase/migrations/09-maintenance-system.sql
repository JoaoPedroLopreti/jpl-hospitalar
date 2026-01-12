-- ============================================================================
-- JPL HOSPITALAR - SISTEMA DE MANUTENÇÃO TÉCNICA (SMT)
-- ============================================================================

-- 1. ENUMS
-- ============================================================================

-- Adiciona novos roles ao enum existente (se não existirem)
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'TECHNICIAN';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'COMPANY';

-- Status do Equipamento
DO $$ BEGIN
    CREATE TYPE "EquipmentStatus" AS ENUM (
      'OK',               -- Em funcionamento normal
      'MAINTENANCE_DUE',  -- Manutenção programada próxima ou vencida
      'EXPIRED',          -- Equipamento obsoleto ou fora de uso
      'UNDER_MAINTENANCE' -- Em manutenção no momento
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABLES
-- ============================================================================

-- Tabela: Empresas de Manutenção (Clientes do Técnico)
CREATE TABLE IF NOT EXISTS "MaintenanceCompany" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public."User"(id) ON DELETE CASCADE, -- Login da empresa (Role: COMPANY)
    technician_id UUID NOT NULL REFERENCES public."User"(id) ON DELETE CASCADE, -- Técnico responsável (Role: TECHNICIAN)
    legal_name TEXT NOT NULL,
    trade_name TEXT NOT NULL,
    cnpj TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_company_technician ON "MaintenanceCompany"(technician_id);
CREATE INDEX IF NOT EXISTS idx_company_user ON "MaintenanceCompany"(user_id);


-- Tabela: Equipamentos Médicos
CREATE TABLE IF NOT EXISTS "MedicalEquipment" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES "MaintenanceCompany"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    serial_number TEXT NOT NULL,
    location TEXT, -- ex: "UTI 1", "Sala de Cirurgia"
    status "EquipmentStatus" NOT NULL DEFAULT 'OK',
    install_date TIMESTAMP(3),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_equipment_company ON "MedicalEquipment"(company_id);
CREATE INDEX IF NOT EXISTS idx_equipment_serial ON "MedicalEquipment"(serial_number);


-- Tabela: Histórico de Manutenção
CREATE TABLE IF NOT EXISTS "MaintenanceRecord" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID NOT NULL REFERENCES "MedicalEquipment"(id) ON DELETE CASCADE,
    technician_id UUID NOT NULL REFERENCES public."User"(id),
    maintenance_date TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT NOT NULL,
    parts_replaced TEXT, -- Lista de peças trocadas (texto livre ou JSON futuro)
    next_maintenance_date TIMESTAMP(3),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_record_equipment ON "MaintenanceRecord"(equipment_id);
CREATE INDEX IF NOT EXISTS idx_record_date ON "MaintenanceRecord"(maintenance_date DESC);


-- 3. RLS (ROW LEVEL SECURITY)
-- ============================================================================

ALTER TABLE "MaintenanceCompany" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MedicalEquipment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MaintenanceRecord" ENABLE ROW LEVEL SECURITY;

-- POLICIES: MaintenanceCompany

-- Técnico pode ver suas próprias empresas
DROP POLICY IF EXISTS "Technician can view own companies" ON "MaintenanceCompany";
CREATE POLICY "Technician can view own companies"
    ON "MaintenanceCompany" FOR SELECT
    TO authenticated
    USING ( technician_id = auth.uid() );

-- Técnico pode criar empresas
DROP POLICY IF EXISTS "Technician can create companies" ON "MaintenanceCompany";
CREATE POLICY "Technician can create companies"
    ON "MaintenanceCompany" FOR INSERT
    TO authenticated
    WITH CHECK ( technician_id = auth.uid() ); 

-- Técnico pode atualizar suas empresas
DROP POLICY IF EXISTS "Technician can update own companies" ON "MaintenanceCompany";
CREATE POLICY "Technician can update own companies"
    ON "MaintenanceCompany" FOR UPDATE
    TO authenticated
    USING ( technician_id = auth.uid() );

-- Empresa (Usuário logado como COMPANY) pode ver seus próprios dados
DROP POLICY IF EXISTS "Company can view own profile" ON "MaintenanceCompany";
CREATE POLICY "Company can view own profile"
    ON "MaintenanceCompany" FOR SELECT
    TO authenticated
    USING ( user_id = auth.uid() );


-- POLICIES: MedicalEquipment

-- Técnico pode ver equipamentos das suas empresas
DROP POLICY IF EXISTS "Technician can view managed equip" ON "MedicalEquipment";
CREATE POLICY "Technician can view managed equip"
    ON "MedicalEquipment" FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "MaintenanceCompany" c
            WHERE c.id = "MedicalEquipment".company_id
            AND c.technician_id = auth.uid()
        )
    );

-- Técnico pode Gerenciar equipamentos
DROP POLICY IF EXISTS "Technician can manage equip" ON "MedicalEquipment";
CREATE POLICY "Technician can manage equip"
    ON "MedicalEquipment" FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "MaintenanceCompany" c
            WHERE c.id = "MedicalEquipment".company_id
            AND c.technician_id = auth.uid()
        )
    );

-- Empresa pode ver seus próprios equipamentos
DROP POLICY IF EXISTS "Company can view own equip" ON "MedicalEquipment";
CREATE POLICY "Company can view own equip"
    ON "MedicalEquipment" FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "MaintenanceCompany" c
            WHERE c.id = "MedicalEquipment".company_id
            AND c.user_id = auth.uid()
        )
    );

-- PUBLIC ACCESS (Para QR Code)
DROP POLICY IF EXISTS "Public can view equipment details" ON "MedicalEquipment";
CREATE POLICY "Public can view equipment details"
    ON "MedicalEquipment" FOR SELECT
    TO anon, authenticated
    USING (true);


-- POLICIES: MaintenanceRecord

-- Técnico pode ver e criar records
DROP POLICY IF EXISTS "Technician can view records" ON "MaintenanceRecord";
CREATE POLICY "Technician can view records"
    ON "MaintenanceRecord" FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "MedicalEquipment" e
            JOIN "MaintenanceCompany" c ON c.id = e.company_id
            WHERE e.id = "MaintenanceRecord".equipment_id
            AND c.technician_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Technician can insert records" ON "MaintenanceRecord";
CREATE POLICY "Technician can insert records"
    ON "MaintenanceRecord" FOR INSERT
    TO authenticated
    WITH CHECK (
        technician_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM "MedicalEquipment" e
            JOIN "MaintenanceCompany" c ON c.id = e.company_id
            WHERE e.id = "MaintenanceRecord".equipment_id
            AND c.technician_id = auth.uid()
        )
    );

-- Empresa pode ver records dos seus equipamentos
DROP POLICY IF EXISTS "Company can view own records" ON "MaintenanceRecord";
CREATE POLICY "Company can view own records"
    ON "MaintenanceRecord" FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "MedicalEquipment" e
            JOIN "MaintenanceCompany" c ON c.id = e.company_id
            WHERE e.id = "MaintenanceRecord".equipment_id
            AND c.user_id = auth.uid()
        )
    );

-- PUBLIC ACCESS (Para QR Code - Histórico)
DROP POLICY IF EXISTS "Public can view records" ON "MaintenanceRecord";
CREATE POLICY "Public can view records"
    ON "MaintenanceRecord" FOR SELECT
    TO anon, authenticated
    USING (true);


-- 4. TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_company_modtime ON "MaintenanceCompany";
CREATE TRIGGER update_company_modtime
    BEFORE UPDATE ON "MaintenanceCompany"
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_equipment_modtime ON "MedicalEquipment";
CREATE TRIGGER update_equipment_modtime
    BEFORE UPDATE ON "MedicalEquipment"
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
