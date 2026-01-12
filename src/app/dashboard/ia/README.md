# 🤖 Módulo de IA - Assistente de Propostas

## ⚠️ STATUS ATUAL

**INFRAESTRUTURA COMPLETA** ✅  
**INTEGRAÇÃO DE IA** ⏳ Pendente

Este módulo contém **APENAS A ESTRUTURA BASE** para o futuro agente de IA.  
Nenhuma lógica de IA está implementada nesta versão.

---

## 📋 O Que Foi Implementado

### ✅ Database Schema
- 7 tabelas criadas (Edital, RequisitosExtraidos, ProdutoCatalogo, AnaliseProduto, Precificacao, PropostaGerada, LogProcessamento)
- 3 ENUMs (EditalStatus, TipoRequisito, PropostaStatus)
- RLS policies completas
- Triggers e índices otimizados

### ✅ TypeScript Types
- Interfaces para todos os models
- Types para API requests/responses
- Props types para componentes
- Helpers e constantes

### ✅ Utility Functions
- Status helpers (getNextStatus, isFinalStatus)
- Formatting (formatCurrency, formatRelativeTime)
- Validation (isValidFileType, isValidFileSize)
- Mock data generators

### ✅ UI Components
1. `UploadEditalForm` - Upload de edital
2. `EditalStatusBadge` - Badge de status
3. `TimelineProcessamento` - Timeline de logs
4. `PropostaPreview` - Preview da proposta
5. `ReviewActions` - Ações de aprovação
6. `EmptyStateIA` - Estado vazio
7. `LoadingProcessamento` - Loading state

### ✅ API Routes
1. `POST /api/ia/edital/upload` - Upload de edital
2. `POST /api/ia/edital/process` - Processar edital (placeholder)
3. `GET /api/ia/edital/[id]` - Buscar edital
4. `POST /api/ia/proposta/gerar` - Gerar proposta (placeholder)
5. `POST /api/ia/proposta/aprovar` - Aprovar/rejeitar proposta

### ✅ Pages
1. `/dashboard/ia` - Dashboard principal
2. `/dashboard/ia/novo-edital` - Upload de edital
3. `/dashboard/ia/edital/[id]` - Detalhes do edital
4. `/dashboard/ia/revisao/[id]` - Revisão de proposta

---

## 🔌 Pontos de Integração Futura

### 1. Processamento de PDF
**Arquivo:** `src/app/api/ia/edital/process/route.ts`  
**Linha:** ~50  
**O que adicionar:**
```typescript
// Extrair texto do PDF usando biblioteca como pdf-parse
const pdfText = await extractPDFText(edital.arquivoUrl)

// Chamar LLM para análise
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{
    role: "system",
    content: "Você é um assistente especializado em análise de editais..."
  }, {
    role: "user",
    content: pdfText
  }]
})
```

### 2. Extração de Requisitos
**O que fazer:**
- Parsear resposta da IA
- Salvar em `RequisitosExtraidos`
- Atualizar status para `REQUIREMENTS_EXTRACTED`

### 3. Matching de Produtos
**O que fazer:**
- Comparar requisitos com `ProdutoCatalogo`
- Usar embedding similarity ou regras de negócio
- Salvar matches em `AnaliseProduto`

### 4. Cálculo de Preço
**O que fazer:**
- Aplicar custos, impostos, frete
- Calcular margem
- Salvar em `Precificacao`

### 5. Geração de Proposta
**Arquivo:** `src/app/api/ia/proposta/gerar/route.ts`  
**Linha:** ~50  
**O que adicionar:**
```typescript
const propostaTecnica = await gerarPropostaTecnica(requisitos, produto)
const propostaComercial = await gerarPropostaComercial(precificacao)
```

---

## 📂 Estrutura de Arquivos

```
src/
├── app/
│   ├── api/ia/                    # APIs
│   │   ├── edital/
│   │   │   ├── upload/route.ts
│   │   │   ├── process/route.ts
│   │   │   └── [id]/route.ts
│   │   └── proposta/
│   │       ├── gerar/route.ts
│   │       └── aprovar/route.ts
│   └── dashboard/ia/              # Páginas
│       ├── page.tsx
│       ├── novo-edital/page.tsx
│       ├── edital/[id]/page.tsx
│       └── revisao/[id]/page.tsx
├── components/ia/                 # Componentes
│   ├── UploadEditalForm.tsx
│   ├── EditalStatusBadge.tsx
│   ├── TimelineProcessamento.tsx
│   ├── PropostaPreview.tsx
│   ├── ReviewActions.tsx
│   ├── EmptyStateIA.tsx
│   └── LoadingProcessamento.tsx
├── lib/ia/                        # Lógica
│   ├── types.ts
│   └── utils.ts
└── prisma/schema.prisma           # Schema

supabase/
└── migrations/
    └── 06-ia-infrastructure.sql   # Migration
```

---

## 🚀 Como Usar (Estado Atual)

### 1. Executar Migration
```bash
# Conectar ao Supabase e executar migration
psql $DATABASE_URL -f supabase/migrations/06-ia-infrastructure.sql
```

### 2. Gerar Prisma Client
```bash
npx prisma generate
```

### 3. Acessar Dashboard
```
http://localhost:3000/dashboard/ia
```

### 4. Testar Fluxo
1. Fazer upload de edital (mockado)
2. Ver logs de processamento (mockados)
3. Ver proposta gerada (mockada)
4. Aprovar/rejeitar proposta

---

## ⚡ Roadmap para Integração de IA

### Fase 1: Setup Básico (1-2 dias)
- [ ] Instalar bibliotecas (OpenAI SDK, pdf-parse)
- [ ] Configurar variáveis de ambiente
- [ ] Testar conexão com API da OpenAI

### Fase 2: Extração de PDF (2-3 dias)
- [ ] Implementar upload real para Supabase Storage
- [ ] Extrair texto de PDF
- [ ] Limpar e estruturar texto

### Fase 3: Análise de Requisitos (3-5 dias)
- [ ] Criar prompts para extração de requisitos
- [ ] Parsear resposta da IA
- [ ] Validar estrutura dos requisitos

### Fase 4: Matching de Produtos (3-5 dias)
- [ ] Popular catálogo de produtos
- [ ] Implementar lógica de matching
- [ ] Testar accuracy

### Fase 5: Precificação (2-3 dias)
- [ ] Definir regras de cálculo
- [ ] Implementar fórmulas
- [ ] Validar valores

### Fase 6: Geração de Proposta (3-5 dias)
- [ ] Criar templates de proposta
- [ ] Gerar conteúdo técnico
- [ ] Gerar conteúdo comercial

### Fase 7: Testes e Ajustes (3-5 dias)
- [ ] Testes end-to-end
- [ ] Ajuste de prompts
- [ ] Otimizações de performance

**Total Estimado:** 17-30 dias

---

## 🛡️ Segurança e Permissões

### RLS Configurado
- ✅ Usuários autenticados podem ver editais
- ✅ Apenas donos ou ADMIN podem editar
- ✅ Apenas ADMIN pode aprovar propostas
- ✅ Logs são read-only para usuários

### Validações Implementadas
- ✅ Tipo de arquivo (PDF/DOCX)
- ✅ Tamanho máximo (10MB)
- ✅ Autenticação obrigatória
- ✅ Verificação de permissões

---

## 📝 Notas Importantes

### ⚠️ O QUE NÃO FAZER
- ❌ NÃO alterar estrutura do banco (schema fixo)
- ❌ NÃO mudar contrato das APIs (clientes dependem)
- ❌ NÃO remover logs (auditoria obrigatória)
- ❌ NÃO bypassar RLS (segurança crítica)

### ✅ O QUE PODE FAZER
- ✅ Adicionar lógica de IA nos placeholders
- ✅ Adicionar novos campos JSON em `conteudo`
- ✅ Criar funções auxiliares em `/lib/ia/`
- ✅ Melhorar UI dos componentes

---

## 🤝 Contribuindo

Ao adicionar a integração de IA:

1. **Mantenha logs detalhados** - Use `LogProcessamento`
2. **Atualize status corretamente** - Siga o workflow definido
3. **Valide entradas** - Sanitize dados antes de enviar para IA
4. **Trate erros** - IA pode falhar, tenha fallbacks
5. **Documente prompts** - Salve prompts em arquivos separados

---

## 📞 Suporte

Para dúvidas sobre a estrutura:
- Ver código com comentários `// 🔌 FUTURE AI INTEGRATION POINT`
- Consultar `src/lib/ia/types.ts` para contratos
- Consultar `implementation_plan.md` para design completo

---

**Versão:** 1.0.0 (Infraestrutura)  
**Data:** 2025-12-31  
**Status:** ✅ Pronto para integração de IA
