// ============================================================================
// PRODUCT MATCHING - TYPES
// ============================================================================

export interface EditalRequirement {
    id: string
    title: string
    description: string
    mandatory: boolean
}

export interface ProductForMatching {
    id: string
    nome: string
    categoria: string
    descricao_curta: string | null
    aplicacao: string | null
    observacoes: string | null
    especificacoes_tecnicas: Record<string, any>
    pdf_text: string | null
}

export interface RequirementResult {
    product_id: string
    status: 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NOT_COMPLIANT'
    evidence: string
}

export interface RequirementAnalysis {
    requirement_id: string
    title: string
    mandatory: boolean
    results: RequirementResult[]
}

export interface ProductEvaluation {
    product_id: string
    product_name: string
    compliance_score: number
    blocking_issues: string[]
}

export interface BestMatch {
    product_ids: string[]
    product_names: string[]
    compliance_score: number
    justification: string
}

export interface FinalVerdict {
    fully_compliant: boolean
    notes: string
}

export interface ProductMatchingOutput {
    best_match: BestMatch | null
    requirement_analysis: RequirementAnalysis[]
    all_products_evaluated: ProductEvaluation[]
    final_verdict: FinalVerdict
}

export interface ProductMatchingInput {
    requirements: EditalRequirement[]
    products: ProductForMatching[]
}

export interface ProductMatchingResult {
    success: boolean
    data?: ProductMatchingOutput
    error?: string
}
