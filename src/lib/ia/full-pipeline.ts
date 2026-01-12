// ============================================================================
// FULL AI PIPELINE WITH CLAUDE SONNET
// Master Prompt: Extraction + Matching in Single Call
// ============================================================================

import Anthropic from '@anthropic-ai/sdk'
import { parseJSONSafely } from './json-utils'
import type {
    FullPipelineInput,
    FullPipelineOutput,
    FullPipelineResult,
} from './full-pipeline-types'

const CLAUDE_MODEL = 'claude-sonnet-4-20250514' as const
const MAX_TOKENS = 8000 // Larger for full pipeline
const TEMPERATURE = 0.2 // Increased to avoid repetitive responses while staying deterministic

// ============================================================================
// MASTER PROMPT
// ============================================================================

function buildFullPipelinePrompt(input: FullPipelineInput): string {
    const productsJson = JSON.stringify(
        input.products.map((p) => ({
            product_id: p.id,
            nome: p.nome,
            categoria: p.categoria,
            descricao_curta: p.descricao_curta,
            aplicacao: p.aplicacao,
            observacoes: p.observacoes,
            especificacoes_tecnicas: p.especificacoes_tecnicas,
            pdf_text: p.pdf_text ? p.pdf_text.substring(0, 3000) : 'PDF não disponível',
        })),
        null,
        2
    )

    return `You are a senior medical procurement analyst AI working in a production system.

This is a CRITICAL instruction:
You MUST follow ALL steps below in order.
Skipping ANY step invalidates the response.

===================================
STEP 0 — EDITAL SAFETY & FOCUS
===================================
- The edital may be VERY LARGE.
- IGNORE:
  • legal clauses
  • bidding rules
  • deadlines
  • penalties
- FOCUS ONLY on:
  • requested equipment
  • technical descriptions
  • item lists
  • medical device names

===================================
STEP 1 — EXTRACT ALL REQUESTED PRODUCTS (MANDATORY)
===================================
Before looking at the catalog:

1. Extract EVERY medical product requested in the edital.
2. Even if repeated or described differently, list it ONCE.
3. Normalize names:
   Examples:
   - "Ventilador pulmonar"
   - "Ventilador mecânico"
   - "Ventilador Microtak"
   → "Ventilador Pulmonar"

🚨 RULE:
If a product is mentioned in the edital, it MUST appear in the extracted list.
Do NOT judge availability yet.

===================================
STEP 2 — SHOW ALL REQUESTED PRODUCTS (MANDATORY)
===================================
For EACH extracted product, you MUST output it even if:

- It does NOT exist in the catalog
- It has partial or unclear specs

This system MUST NEVER hide a requested product.

===================================
STEP 3 — MATCH AGAINST CATALOG (MANDATORY)
===================================
🎯 CRITICAL: You are a SENIOR ANALYST of hospital tenders and medical equipment.

Analyze the edital technically and interpretively, NOT just by literal name matching.

MATCHING PRIORITIES (in order):
1. **Functional description** - What the equipment does
2. **Clinical application** - Where/how it's used
3. **CATMAT category** - Brazilian medical classification (when present)
4. **Target population** - Neonatal, pediatric, adult compatibility
5. **Technical specifications** - Voltage, capacity, certifications
6. **Brand/Model** - ONLY as final tiebreaker

For EACH requested product:

### Technical Equivalence Criteria

A catalog product is EQUIVALENT if it meets:
✅ Same PRIMARY FUNCTION
✅ Same CLINICAL APPLICATION
✅ Same or compatible CATMAT category
✅ Compatible TARGET POPULATION (neonatal/pediatric/adult)

### DO NOT Reject Based On:
❌ Different commercial name
❌ Different brand
❌ Minor specification variations
❌ Different wording in description

### Matching Process:

1. **Identify core function** from edital description
   Example: "Ventilador artificial eletrônico de transporte neonatal/pediátrico/adulto"
   → Core function: Ventilação pulmonar de transporte
   → Target: Neonatal + Pediátrico + Adulto

2. **Search catalog by FUNCTION**, not name:
   - Look for ventilators with transport capability
   - Check if supports all required populations
   - Verify it's electronic/mechanical ventilation

3. **If functional match exists:**
   - found_in_catalog = true
   - Status = "ATENDIDO POR EQUIVALÊNCIA TÉCNICA"
   - adequacy_score based on specification completeness:
     • 90-100% → All specs match perfectly + same CATMAT
     • 75-89% → All critical functions match, minor spec differences
     • 60-74% → Same category and function, some population limitations

**CONCRETE EXAMPLE:**

Edital requests: "Ventilador artificial eletrônico de transporte neonatal/pediátrico/adulto" (CATMAT: 421237)

Catalog has: "Microtak Total – Ventilador pulmonar de transporte neonatal, pediátrico e adulto"

✅ MATCH CONFIRMED:
- Function: ✓ Both are transport ventilators
- Population: ✓ Both support neonatal/pediatric/adult
- CATMAT: ✓ 421237 = ventilação pulmonar
- Score: 95% (functional equivalence confirmed)
- Justification: "Produto atende aos requisitos técnicos do edital. Mesmo não havendo correspondência exata de nome comercial, o equipamento possui mesma função (ventilação de transporte), mesma aplicação clínica e compatibilidade com os três públicos especificados (neonatal, pediátrico, adulto). Equivalência técnica confirmada por CATMAT 421237."

🚫 ABSOLUTE RULE:
If found_in_catalog = true → adequacy_score MUST be ≥ 60%.
0% IS FORBIDDEN when product exists in catalog.

===================================
STEP 4 — PRODUCTS NOT IN CATALOG
===================================
If NO similar product exists:

- found_in_catalog = false
- adequacy_score = 0%
- Explain clearly that it is requested but unavailable

===================================
STEP 5 — LARGE EDITAL CONSERVATIVE RULE
===================================
If the edital is long or unclear:
- Prefer PARTIAL matches over rejection
- NEVER discard a product due to ambiguity
- NEVER say "not found" if category matches

===================================
STEP 6 — BEST PRODUCT SELECTION (LAST STEP)
===================================
🚨 CRITICAL WARNING: DO NOT default to "Microtak Total" or any single product!

You MUST analyze EACH edital independently and match to the ACTUAL requested product.

**Selection Process:**

1. **Review ALL extracted requirements**
   - What equipment is ACTUALLY requested in THIS specific edital?
   - What are the SPECIFIC technical requirements?
   - What population is specified (neonatal, pediatric, adult)?

2. **Compare against ALL catalog products**
   - Does the edital request a ventilator? → Look ONLY at ventilators
   - Does the edital request anesthesia equipment? → Look ONLY at anesthesia machines
   - Does the edital request monitoring? → Look ONLY at monitors
   
3. **Select based on ACTUAL match**:
   - highest adequacy score FOR THIS SPECIFIC REQUEST
   - relevance to the SPECIFIC equipment requested
   - DO NOT select "Microtak Total" unless the edital SPECIFICALLY requests a transport ventilator

4. **Confidence levels**:
   - HIGH → Direct match of function AND specifications
   - MEDIUM → Equivalent function, minor spec differences
   - LOW → Partial match but acceptable

🚫 **FORBIDDEN BEHAVIORS:**
❌ NEVER default to the same product for all editals
❌ NEVER select "Microtak Total" if the edital requests anesthesia equipment
❌ NEVER select "SAT 700" if the edital requests ventilators
❌ NEVER ignore the actual requirements in the edital

✅ **REQUIRED BEHAVIOR:**
✅ READ the edital carefully to identify WHAT is being requested
✅ MATCH to the product that ACTUALLY fulfills that request
✅ If edital requests "Aparelho de Anestesia" → return anesthesia machine (e.g., SAT 700)
✅ If edital requests "Ventilador" → return ventilator (e.g., Microtak, Inter 5 Plus)
✅ If edital requests multiple items → identify the PRIMARY/MOST CRITICAL one

**Example of CORRECT behavior:**

Edital A: "Aparelho de Anestesia inalatória 220V"
→ Best product: "SAT 700" (anesthesia machine)
→ NOT Microtak Total (that's a ventilator!)

Edital B: "Ventilador pulmonar de transporte"
→ Best product: "Microtak Total" (transport ventilator)
→ Correct match!

Edital C: "Monitor multiparamétrico"
→ Best product: Look for monitoring equipment
→ NOT anesthesia or ventilator!

===================================
STEP 7 — SELF-CHECK (MANDATORY)
===================================
Before answering, verify internally:
- Did I list ALL requested products?
- Did I avoid 0% when product exists?
- Did I avoid hallucination?
- Did I keep all requested items visible?
- 🚨 **NEW CHECK:** Did I ACTUALLY read what this specific edital requests?
- 🚨 **NEW CHECK:** Does my selected product MATCH the actual request?
  - If edital asks for "anesthesia" → did I select an anesthesia machine?
  - If edital asks for "ventilator" → did I select a ventilator?
  - If edital asks for "monitor" → did I select monitoring equipment?
- 🚨 **NEW CHECK:** Am I defaulting to "Microtak Total" without justification?

**CRITICAL VALIDATION:**
If you selected a product, ask yourself:
"Would a procurement specialist agree this product matches what the edital requested?"

If the answer is NO → GO BACK and select the correct product!
If you're unsure → Re-read the edital requirements in STEP 1!

If ANY answer is NO → FIX BEFORE OUTPUT.

===================================
EDITAL INFORMATION
===================================

**Name:** ${input.editalName}

**Full Text:**
${input.editalText}

===================================
JPL HOSPITALAR PRODUCT CATALOG
===================================

🎯 IMPORTANT: This catalog contains DIFFERENT types of medical equipment:
- Anesthesia machines (e.g., SAT 700)
- Ventilators (e.g., Microtak Total, Inter 5 Plus)
- Monitoring equipment
- Other medical devices

Each edital will request a SPECIFIC type of equipment.
Your job is to identify WHICH type is requested and match accordingly.

DO NOT always select the same product!

**Catalog Products:**

${productsJson}

===================================
OUTPUT FORMAT (STRICT JSON)
===================================

⚠️ CRITICAL: Return ONLY valid JSON. NO markdown. NO explanations. Start with { and end with }

{
  "extracted_requirements": [
    {
      "id": "REQ-01",
      "name": "Produto: [Nome Normalizado do Produto]",
      "description": "Descrição técnica resumida",
      "mandatory": true
    }
  ],
  "product_matching": [
    {
      "product_id": "catalog-uuid",
      "product_name": "Nome do Produto no Catálogo",
      "requested_product": "Nome do produto solicitado no edital",
      "category": "Categoria médica",
      "catmat": "Código CATMAT se presente no edital",
      "found_in_catalog": true,
      "equivalence_type": "EQUIVALÊNCIA TÉCNICA FUNCIONAL" ou "CORRESPONDÊNCIA DIRETA",
      "results": [
        {
          "requirement_id": "REQ-01",
          "status": "COMPLIANT",
          "evidence": "Evidência factual do catálogo - descreva FUNCTION match, CLINICAL APPLICATION match, POPULATION compatibility"
        }
      ],
      "compliance_score": 85,
      "technical_justification": "Explicação detalhada da equivalência técnica: por que o produto atende mesmo com nome diferente. Cite função, aplicação clínica, CATMAT e compatibilidade de público.",
      "blocking_issues": []
    }
  ],
  "best_product_identified": {
    "product_id": "uuid",
    "product_name": "Nome do Produto",
    "confidence": "HIGH",
    "justification": "Justificativa técnica detalhada baseada nas especificações do edital e do catálogo."
  },
  "final_verdict": {
    "can_participate": true,
    "notes": "JPL Hospitalar possui produto(s) compatível(is) no catálogo."
  }
}

Se NENHUM produto for compatível:

{
  "extracted_requirements": [...todos os produtos solicitados...],
  "product_matching": [...análise completa de cada produto...],
  "best_product_identified": null,
  "final_verdict": {
    "can_participate": false,
    "notes": "Nenhum produto do catálogo atual atende integralmente aos requisitos técnicos exigidos."
  }
}

===================================
IMPORTANT REMINDERS
===================================

✅ It is BETTER to show a partial match than to hide a requested product.
✅ ALWAYS extract ALL products before matching.
✅ NEVER score 0% if product exists in catalog (minimum 60%).
✅ Be CONSERVATIVE with scores - don't exaggerate.

RESPOND NOW WITH PURE JSON ONLY (start with { and end with }):`

}

// ============================================================================
// VALIDATION
// ============================================================================

function validateFullPipelineOutput(data: unknown): FullPipelineOutput {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid pipeline output: not an object')
    }

    const obj = data as Record<string, unknown>

    // Validate extracted_requirements
    if (!Array.isArray(obj.extracted_requirements)) {
        throw new Error('Missing or invalid extracted_requirements')
    }

    // Validate product_matching
    if (!Array.isArray(obj.product_matching)) {
        throw new Error('Missing or invalid product_matching')
    }

    // Validate final_verdict
    if (!obj.final_verdict || typeof obj.final_verdict !== 'object') {
        throw new Error('Missing or invalid final_verdict')
    }

    const verdict = obj.final_verdict as Record<string, unknown>
    if (typeof verdict.can_participate !== 'boolean') {
        throw new Error('Invalid can_participate field')
    }

    return data as FullPipelineOutput
}

// ============================================================================
// MAIN PIPELINE FUNCTION
// ============================================================================

export async function runFullPipeline(
    input: FullPipelineInput
): Promise<FullPipelineResult> {
    try {
        // Validate input
        if (!input.editalText || input.editalText.trim().length === 0) {
            return {
                success: false,
                error: 'Edital text is required',
            }
        }

        if (!input.products || input.products.length === 0) {
            return {
                success: false,
                error: 'No products provided',
            }
        }

        // Limit text size to prevent token overflow and rate limits
        // Claude rate limit: 30,000 tokens/minute
        // To be safe, limit to ~20k tokens = ~80k chars
        const MAX_EDITAL_CHARS = 80000
        let editalText = input.editalText

        if (editalText.length > MAX_EDITAL_CHARS) {
            console.log(
                `[Full Pipeline] Edital text too long (${editalText.length} chars), truncating to ${MAX_EDITAL_CHARS}`
            )
            // Keep only the beginning (where technical requirements usually are)
            editalText = editalText.substring(0, MAX_EDITAL_CHARS)
            editalText += '\n\n[...RESTANTE DO DOCUMENTO OMITIDO PARA RESPEITAR LIMITES DA API...]'
        }

        // Initialize Claude
        const apiKey = process.env.ANTHROPIC_API_KEY
        if (!apiKey) {
            throw new Error('ANTHROPIC_API_KEY not configured')
        }

        const client = new Anthropic({ apiKey })

        // Build master prompt with truncated text
        const prompt = buildFullPipelinePrompt({
            ...input,
            editalText, // Use truncated version
        })

        console.log('[Full Pipeline] Processing edital:', input.editalName)
        console.log('[Full Pipeline] Edital text length:', editalText.length, 'chars')
        console.log('[Full Pipeline] Products in catalog:', input.products.length)

        // Call Claude with master prompt (with retry for rate limits)
        let message
        let retries = 0
        const maxRetries = 3

        while (retries <= maxRetries) {
            try {
                message = await client.messages.create({
                    model: CLAUDE_MODEL,
                    max_tokens: MAX_TOKENS,
                    temperature: TEMPERATURE,
                    messages: [
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                })
                break // Success, exit retry loop
            } catch (error: any) {
                // Check if it's a rate limit error
                if (error?.status === 429 && retries < maxRetries) {
                    const waitTime = Math.pow(2, retries) * 2000 // Exponential backoff: 2s, 4s, 8s
                    console.log(
                        `[Full Pipeline] Rate limit hit, retrying in ${waitTime}ms (attempt ${retries + 1}/${maxRetries})`
                    )
                    await new Promise((resolve) => setTimeout(resolve, waitTime))
                    retries++
                } else {
                    throw error // Not a rate limit or out of retries
                }
            }
        }

        if (!message) {
            throw new Error('Failed to get response from Claude after retries')
        }

        // Extract response
        const contentBlock = message.content[0]
        if (contentBlock.type !== 'text') {
            throw new Error('Unexpected response type from Claude')
        }

        const responseText = contentBlock.text

        // Parse with auto-repair
        let parsedResponse: unknown
        try {
            parsedResponse = parseJSONSafely(responseText)
        } catch (parseError) {
            console.error('[Full Pipeline] JSON Parse Error:', parseError)
            throw parseError
        }

        // Validate structure
        const validatedOutput = validateFullPipelineOutput(parsedResponse)

        console.log('[Full Pipeline] Success!')
        console.log(
            '[Full Pipeline] Requirements extracted:',
            validatedOutput.extracted_requirements.length
        )
        console.log(
            '[Full Pipeline] Best product:',
            validatedOutput.best_product_identified?.product_name || 'None'
        )

        return {
            success: true,
            data: validatedOutput,
        }
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred'

        console.error('[Full Pipeline Error]', {
            error: errorMessage,
            input: {
                editalName: input.editalName,
                textLength: input.editalText?.length || 0,
                productsCount: input.products?.length || 0,
            },
        })

        return {
            success: false,
            error: `Full pipeline failed: ${errorMessage}`,
        }
    }
}
