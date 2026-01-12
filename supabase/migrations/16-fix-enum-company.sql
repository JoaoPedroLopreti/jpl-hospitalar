-- Adicionar valores ao Enum Role de forma segura (idempotente)
DO $$
BEGIN
    ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'TECHNICIAN';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$
BEGIN
    ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'COMPANY';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
