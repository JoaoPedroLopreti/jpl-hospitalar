# 🔧 CORREÇÃO URGENTE - Conexão do Banco

## PROBLEMA IDENTIFICADO
O erro mostra que o Prisma está tentando conectar na porta **6543** (pooling), mas precisa usar a porta **5432** (direct connection).

## SOLUÇÃO: Verifique seu arquivo .env

Abra o arquivo `.env` na raiz do projeto e **VERIFIQUE** se tem isto:

```env
# ❌ SE TIVER ISTO (ERRADO):
DATABASE_URL="postgresql://postgres:sua-senha@db.pbchcijfqlqrhsikxdzj.supabase.co:6543/postgres"

# ✅ MUDE PARA ISTO (CORRETO):
DATABASE_URL="postgresql://postgres:sua-senha@db.pbchcijfqlqrhsikxdzj.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:sua-senha@db.pbchcijfqlqrhsikxdzj.supabase.co:5432/postgres"
```

## PASSOS PARA CORRIGIR:

### 1. Abra o arquivo .env
Ele está na raiz do projeto: `c:\Jpl Online\jpl-hospitalar\.env`

### 2. Encontre a linha DATABASE_URL

### 3. Substitua **6543** por **5432** em TODAS as URLs

### 4. Se não tiver DIRECT_URL, adicione:
```env
DIRECT_URL="postgresql://postgres:sua-senha@db.pbchcijfqlqrhsikxdzj.supabase.co:5432/postgres"
```

### 5. EXEMPLO COMPLETO do seu .env deve ter:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://pbchcijfqlqrhsikxdzj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# Database - PORTA 5432 (não 6543!)
DATABASE_URL="postgresql://postgres:SUA-SENHA@db.pbchcijfqlqrhsikxdzj.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:SUA-SENHA@db.pbchcijfqlqrhsikxdzj.supabase.co:5432/postgres"
```

### 6. Salve o arquivo .env

### 7. LIMPE TUDO e reinicie:
```bash
# 1. Pare o servidor (Ctrl+C)

# 2. Limpe cache
Remove-Item -Recurse -Force .next

# 3. Regenere Prisma
npx prisma generate

# 4. Inicie novamente
npm run dev
```

## COMO PEGAR A SENHA CORRETA?

No Supabase Dashboard:
1. Settings → Database
2. Copie a senha do projeto (ou resete se esqueceu)
3. Use na URL acima

## VERIFICAÇÃO FINAL

Após corrigir, acesse:
```
http://localhost:3000/dashboard/ia
```

Deve carregar sem erros! ✅

---

**POR QUE ISSO ACONTECE?**

- Porta **6543** = Connection pooling (para apps serverless)
- Porta **5432** = Direct connection (para Prisma/migrations)

O Prisma precisa da conexão direta!
