// ============================================================================
// TYPES - AI AGENT INFRASTRUCTURE
// ============================================================================
// TypeScript types e interfaces para o módulo de IA
// NÃO contém lógica de IA - apenas definições de tipos
// ============================================================================

// ============================================================================
// ENUMs (Local TypeScript Definitions)
// ============================================================================

export enum EditalStatus {
    UPLOADED = 'UPLOADED',
    PROCESSING = 'PROCESSING',
    REQUIREMENTS_EXTRACTED = 'REQUIREMENTS_EXTRACTED',
    PRODUCT_SELECTED = 'PRODUCT_SELECTED',
    PRICED = 'PRICED',
    PROPOSAL_GENERATED = 'PROPOSAL_GENERATED',
    READY_FOR_REVIEW = 'READY_FOR_REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export enum TipoRequisito {
    TECNICO = 'TECNICO',
    COMERCIAL = 'COMERCIAL'
}

export enum PropostaStatus {
    DRAFT = 'DRAFT',
    UNDER_REVIEW = 'UNDER_REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

// ============================================================================
// DATABASE MODELS
// ============================================================================

export interface Edital {
    id: string
    nome: string
    arquivoUrl: string | null
    status: EditalStatus
    createdBy: string
    createdAt: Date
    updatedAt: Date
}

export interface RequisitosExtraidos {
    id: string
    editalId: string
    tipo: TipoRequisito
    conteudo: RequisitoConteudo
    createdAt: Date
}

export interface ProdutoCatalogo {
    id: string
    nome: string
    categoria: string
    especificacoes: ProdutoEspecificacoes
    custoBase: number
    ativo: boolean
    createdAt: Date
    updatedAt: Date
}

export interface AnaliseProduto {
    id: string
    editalId: string
    produtoId: string
    atendeRequisitos: boolean
    justificativa: string | null
    createdAt: Date
}

export interface Precificacao {
    id: string
    editalId: string
    custo: number
    impostos: number
    frete: number
    margem: number
    valorFinal: number
    explicacao: string | null
    createdAt: Date
}

export interface PropostaGerada {
    id: string
    editalId: string
    conteudoTecnico: string | null
    conteudoComercial: string | null
    status: PropostaStatus
    aprovadoPor: string | null
    createdAt: Date
    updatedAt: Date
}

export interface LogProcessamento {
    id: string
    editalId: string
    etapa: string
    mensagem: string
    createdAt: Date
}

// ============================================================================
// JSON STRUCTURES (JSONB fields)
// ============================================================================

// Estrutura do conteúdo de requisitos extraídos
export interface RequisitoConteudo {
    titulo?: string
    descricao?: string
    items?: string[]
    obrigatorio?: boolean
    criterio?: string
    // Extensível para adicionar campos conforme necessário
    [key: string]: any
}

// Estrutura de especificações de produto
export interface ProdutoEspecificacoes {
    fabricante?: string
    modelo?: string
    dimensoes?: {
        largura?: number
        altura?: number
        profundidade?: number
        unidade?: string
    }
    peso?: number
    voltagem?: string
    potencia?: string
    certificacoes?: string[]
    // Extensível
    [key: string]: any
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

// POST /api/ia/edital/upload
export interface UploadEditalRequest {
    nome: string
    arquivoUrl: string
}

export interface UploadEditalResponse {
    success: boolean
    editalId?: string
    status?: EditalStatus
    error?: string
}

// POST /api/ia/edital/process
export interface ProcessEditalRequest {
    editalId: string
}

export interface ProcessEditalResponse {
    success: boolean
    message: string
    error?: string
}

// GET /api/ia/edital/[id]
export interface EditalDetailsResponse {
    success: boolean
    data?: {
        edital: Edital
        requisitos: RequisitosExtraidos[]
        analises: AnaliseProduto[]
        precificacao: Precificacao | null
        proposta: PropostaGerada | null
        logs: LogProcessamento[]
    }
    error?: string
}

// POST /api/ia/proposta/gerar
export interface GerarPropostaRequest {
    editalId: string
}

export interface GerarPropostaResponse {
    success: boolean
    propostaId?: string
    error?: string
}

// POST /api/ia/proposta/aprovar
export type AcaoAprovacao = 'APPROVE' | 'REJECT'

export interface AprovarPropostaRequest {
    propostaId: string
    acao: AcaoAprovacao
    comentarios?: string
}

export interface AprovarPropostaResponse {
    success: boolean
    novoStatus?: PropostaStatus
    error?: string
}

// ============================================================================
// UI COMPONENT PROPS
// ============================================================================

export interface EditalStatusBadgeProps {
    status: EditalStatus
}

export interface TimelineProcessamentoProps {
    logs: LogProcessamento[]
}

export interface PropostaPreviewProps {
    proposta: PropostaGerada
}

export interface ReviewActionsProps {
    propostaId: string
    onApprove: () => void
    onReject: () => void
    loading?: boolean
}

export interface UploadEditalFormProps {
    onSuccess: (editalId: string) => void
    onError: (error: string) => void
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

// Mapa de etapas do workflow
export const WORKFLOW_STEPS = {
    UPLOADED: 'Upload Concluído',
    PROCESSING: 'Processando',
    REQUIREMENTS_EXTRACTED: 'Requisitos Extraídos',
    PRODUCT_SELECTED: 'Produto Selecionado',
    PRICED: 'Precificado',
    PROPOSAL_GENERATED: 'Proposta Gerada',
    READY_FOR_REVIEW: 'Pronta para Revisão',
    APPROVED: 'Aprovada',
    REJECTED: 'Rejeitada',
} as const

// Helper para mapear status para cores
export const STATUS_COLORS: Record<EditalStatus, string> = {
    UPLOADED: 'blue',
    PROCESSING: 'yellow',
    REQUIREMENTS_EXTRACTED: 'indigo',
    PRODUCT_SELECTED: 'purple',
    PRICED: 'pink',
    PROPOSAL_GENERATED: 'cyan',
    READY_FOR_REVIEW: 'orange',
    APPROVED: 'green',
    REJECTED: 'red',
}

// Helper para mapear status de proposta para cores
export const PROPOSTA_STATUS_COLORS: Record<PropostaStatus, string> = {
    DRAFT: 'gray',
    UNDER_REVIEW: 'yellow',
    APPROVED: 'green',
    REJECTED: 'red',
}

// ============================================================================
// MOCK DATA (para desenvolvimento/testes sem IA)
// ============================================================================

export const MOCK_REQUISITO: RequisitoConteudo = {
    titulo: 'Requisito Técnico Exemplo',
    descricao: 'Este é um requisito mockado para desenvolvimento',
    items: ['Item 1', 'Item 2', 'Item 3'],
    obrigatorio: true,
}

export const MOCK_PRODUTO_ESPECIFICACOES: ProdutoEspecificacoes = {
    fabricante: 'KTK Medical',
    modelo: 'XYZ-2000',
    dimensoes: {
        largura: 50,
        altura: 100,
        profundidade: 30,
        unidade: 'cm',
    },
    certificacoes: ['ANVISA', 'ISO 13485'],
}
