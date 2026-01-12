-- ============================================
-- SCHEMA COMPLETO - JPL HOSPITALAR
-- Cole este SQL no Supabase SQL Editor e execute
-- ============================================

-- Criar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criar tipo ENUM
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('EMPLOYEE', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tabela User
CREATE TABLE IF NOT EXISTS "User" (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Proposal
CREATE TABLE IF NOT EXISTS "Proposal" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS "Proposal_userId_idx" ON "Proposal"("userId");
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email);
