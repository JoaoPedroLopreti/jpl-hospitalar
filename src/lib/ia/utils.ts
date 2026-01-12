// ============================================================================
// UTILS - AI AGENT INFRASTRUCTURE
// ============================================================================
// Helper functions para o módulo de IA
// NÃO contém lógica de IA - apenas funções utilitárias
// ============================================================================

import {
    EditalStatus,
    PropostaStatus,
    type LogProcessamento
} from './types'

// ============================================================================
// STATUS HELPERS
// ============================================================================

/**
 * Retorna o próximo status no workflow
 * IMPORTANTE: Isto é apenas um helper para o fluxo mockado
 * O agente de IA futuramente controlará as transições
 */
export function getNextStatus(currentStatus: EditalStatus): EditalStatus | null {
    const workflow: Record<EditalStatus, EditalStatus | null> = {
        [EditalStatus.UPLOADED]: EditalStatus.PROCESSING,
        [EditalStatus.PROCESSING]: EditalStatus.REQUIREMENTS_EXTRACTED,
        [EditalStatus.REQUIREMENTS_EXTRACTED]: EditalStatus.PRODUCT_SELECTED,
        [EditalStatus.PRODUCT_SELECTED]: EditalStatus.PRICED,
        [EditalStatus.PRICED]: EditalStatus.PROPOSAL_GENERATED,
        [EditalStatus.PROPOSAL_GENERATED]: EditalStatus.READY_FOR_REVIEW,
        [EditalStatus.READY_FOR_REVIEW]: null, // Aguarda ação humana
        [EditalStatus.APPROVED]: null, // Final
        [EditalStatus.REJECTED]: null, // Final
    }

    return workflow[currentStatus]
}

/**
 * Verifica se um status é final (não permite mais transições)
 */
export function isFinalStatus(status: EditalStatus): boolean {
    return status === EditalStatus.APPROVED || status === EditalStatus.REJECTED
}

/**
 * Verifica se um status permite revisão humana
 */
export function requiresHumanReview(status: EditalStatus): boolean {
    return status === EditalStatus.READY_FOR_REVIEW
}

/**
 * Retorna label amigável para o status
 */
export function getStatusLabel(status: EditalStatus): string {
    const labels: Record<EditalStatus, string> = {
        [EditalStatus.UPLOADED]: 'Aguardando Processamento',
        [EditalStatus.PROCESSING]: 'Processando Edital',
        [EditalStatus.REQUIREMENTS_EXTRACTED]: 'Requisitos Extraídos',
        [EditalStatus.PRODUCT_SELECTED]: 'Produto Selecionado',
        [EditalStatus.PRICED]: 'Precificação Concluída',
        [EditalStatus.PROPOSAL_GENERATED]: 'Proposta Gerada',
        [EditalStatus.READY_FOR_REVIEW]: 'Aguardando Revisão',
        [EditalStatus.APPROVED]: 'Aprovado',
        [EditalStatus.REJECTED]: 'Rejeitado',
    }

    return labels[status]
}

/**
 * Retorna label amigável para status de proposta
 */
export function getPropostaStatusLabel(status: PropostaStatus): string {
    const labels: Record<PropostaStatus, string> = {
        [PropostaStatus.DRAFT]: 'Rascunho',
        [PropostaStatus.UNDER_REVIEW]: 'Em Revisão',
        [PropostaStatus.APPROVED]: 'Aprovada',
        [PropostaStatus.REJECTED]: 'Rejeitada',
    }

    return labels[status]
}

// ============================================================================
// LOG HELPERS
// ============================================================================

/**
 * Cria mensagens de log padronizadas
 */
export function createLogMessage(
    etapa: string,
    success: boolean,
    details?: string
): string {
    const status = success ? '✓' : '✗'
    return `${status} ${etapa}${details ? `: ${details}` : ''}`
}

/**
 * Agrupa logs por etapa
 */
export function groupLogsByEtapa(logs: LogProcessamento[]): Record<string, LogProcessamento[]> {
    return logs.reduce((acc, log) => {
        if (!acc[log.etapa]) {
            acc[log.etapa] = []
        }
        acc[log.etapa].push(log)
        return acc
    }, {} as Record<string, LogProcessamento[]>)
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Valida se um arquivo é do tipo permitido
 */
export function isValidFileType(filename: string): boolean {
    const validExtensions = ['.pdf', '.docx', '.doc']
    const extension = filename.toLowerCase().slice(filename.lastIndexOf('.'))
    return validExtensions.includes(extension)
}

/**
 * Valida se um arquivo tem tamanho permitido (em bytes)
 */
export function isValidFileSize(sizeInBytes: number, maxSizeMB: number = 10): boolean {
    const maxBytes = maxSizeMB * 1024 * 1024
    return sizeInBytes <= maxBytes
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

/**
 * Formata valor monetário para BRL
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value)
}

/**
 * Formata percentual
 */
export function formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`
}

/**
 * Formata data relativa (ex: "há 2 horas")
 */
export function formatRelativeTime(date: Date): string {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
        return 'agora mesmo'
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`
    } else {
        const days = Math.floor(diffInSeconds / 86400)
        return `há ${days} ${days === 1 ? 'dia' : 'dias'}`
    }
}

// ============================================================================
// MOCK DATA GENERATORS (para desenvolvimento)
// ============================================================================

/**
 * Gera log mockado para testes
 */
export function createMockLog(
    editalId: string,
    etapa: string,
    mensagem: string
): Omit<LogProcessamento, 'id' | 'createdAt'> {
    return {
        editalId,
        etapa,
        mensagem,
    }
}

/**
 * Simula delay assíncrono (usado em placeholders de API)
 */
export function simulateDelay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Formata erro para resposta de API
 */
export function formatApiError(error: unknown): string {
    if (error instanceof Error) {
        return error.message
    }
    return 'Erro desconhecido ao processar requisição'
}

/**
 * Verifica se erro é de autenticação
 */
export function isAuthError(error: unknown): boolean {
    if (error instanceof Error) {
        return error.message.includes('auth') || error.message.includes('unauthorized')
    }
    return false
}

// ============================================================================
// WORKFLOW PROGRESS CALCULATION
// ============================================================================

/**
 * Calcula progresso do workflow (0-100)
 */
export function calculateWorkflowProgress(status: EditalStatus): number {
    const progressMap: Record<EditalStatus, number> = {
        [EditalStatus.UPLOADED]: 10,
        [EditalStatus.PROCESSING]: 20,
        [EditalStatus.REQUIREMENTS_EXTRACTED]: 40,
        [EditalStatus.PRODUCT_SELECTED]: 60,
        [EditalStatus.PRICED]: 75,
        [EditalStatus.PROPOSAL_GENERATED]: 85,
        [EditalStatus.READY_FOR_REVIEW]: 90,
        [EditalStatus.APPROVED]: 100,
        [EditalStatus.REJECTED]: 100,
    }

    return progressMap[status] || 0
}

/**
 * Retorna etapas concluídas baseado no status atual
 */
export function getCompletedSteps(status: EditalStatus): EditalStatus[] {
    const allSteps: EditalStatus[] = [
        EditalStatus.UPLOADED,
        EditalStatus.PROCESSING,
        EditalStatus.REQUIREMENTS_EXTRACTED,
        EditalStatus.PRODUCT_SELECTED,
        EditalStatus.PRICED,
        EditalStatus.PROPOSAL_GENERATED,
        EditalStatus.READY_FOR_REVIEW,
    ]

    const currentIndex = allSteps.indexOf(status)
    return currentIndex >= 0 ? allSteps.slice(0, currentIndex + 1) : []
}

// ============================================================================
// PLACEHOLDER COMMENTS
// ============================================================================

/**
 * 🔌 FUTURE AI INTEGRATION POINT
 * 
 * Futuramente, esta função será substituída por:
 * - Chamada ao agente de IA
 * - Processamento real de PDF
 * - Extração de requisitos via LLM
 * 
 * Por enquanto, retorna apenas dados mockados.
 */
export function futureAIProcessing(): void {
    // Placeholder - sem implementação
    console.warn('⚠️ AI processing not implemented - using mock data')
}
