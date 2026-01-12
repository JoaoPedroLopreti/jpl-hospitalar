-- Criar extensão UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar enum Role
CREATE TYPE "Role" AS ENUM ('EMPLOYEE', 'ADMIN');

-- Criar tabela User
CREATE TABLE IF NOT EXISTS "User" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role "Role" NOT NULL DEFAULT 'EMPLOYEE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela Proposal
CREATE TABLE IF NOT EXISTS "Proposal" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS "Proposal_userId_idx" ON "Proposal"("userId");
