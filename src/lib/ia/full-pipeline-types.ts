// ============================================================================
// FULL AI PIPELINE - EXTRACTION + MATCHING
// ============================================================================
// Master prompt that handles complete workflow:
// 1. Extract requirements from edital
// 2. Match against product catalog
// 3. Identify best product
// ============================================================================

export interface ExtractedRequirement {
    id: string
    name: string
    description: string
    mandatory: boolean
}

export interface RequirementMatchResult {
    requirement_id: string
    status: 'COMPLIANT' | 'NOT_COMPLIANT'
    evidence: string
}

export interface ProductMatchResult {
    product_id: string
    product_name: string
    results: RequirementMatchResult[]
    compliance_score: number
    blocking_issues: string[]
}

export interface BestProductIdentified {
    product_id: string
    product_name: string
    confidence: 'HIGH' | 'MEDIUM' | 'LOW'
    justification: string
}

export interface FinalVerdict {
    can_participate: boolean
    notes: string
}

export interface FullPipelineOutput {
    extracted_requirements: ExtractedRequirement[]
    product_matching: ProductMatchResult[]
    best_product_identified: BestProductIdentified | null
    final_verdict: FinalVerdict
}

export interface FullPipelineInput {
    editalText: string
    editalName: string
    products: Array<{
        id: string
        nome: string
        categoria: string
        descricao_curta: string | null
        aplicacao: string | null
        observacoes: string | null
        especificacoes_tecnicas: Record<string, any>
        pdf_text: string | null
    }>
}

export interface FullPipelineResult {
    success: boolean
    data?: FullPipelineOutput
    error?: string
}
