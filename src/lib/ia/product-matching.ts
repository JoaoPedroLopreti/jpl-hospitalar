// ============================================================================
// PRODUCT MATCHING WITH CLAUDE SONNET
// ============================================================================

import Anthropic from '@anthropic-ai/sdk'
import { parseJSONSafely } from './json-utils'
import type {
    ProductMatchingInput,
    ProductMatchingOutput,
    ProductMatchingResult,
} from './matching-types'

const CLAUDE_MODEL = 'claude-sonnet-4-20250514' as const
const MAX_TOKENS = 4096
const TEMPERATURE = 0.1 // Very deterministic for matching

// ============================================================================
// PROMPT CONSTRUCTION
// ============================================================================

function buildMatchingPrompt(input: ProductMatchingInput): string {
    const requirementsJson = JSON.stringify(input.requirements, null, 2)
    const productsJson = JSON.stringify(
        input.products.map((p) => ({
            id: p.id,
            nome: p.nome,
            categoria: p.categoria,
            descricao_curta: p.descricao_curta,
            aplicacao: p.aplicacao,
            observacoes: p.observacoes,
            especificacoes_tecnicas: p.especificacoes_tecnicas,
            pdf_text: p.pdf_text ? p.pdf_text.substring(0, 2000) : null, // Limit PDF text
        })),
        null,
        2
    )

    return `You are a senior biomedical engineering analyst specializing in public procurement and hospital equipment bidding.

Your task is to perform STRICT PRODUCT MATCHING between:
1) Structured requirements extracted from a public procurement edital
2) The official product catalog of JPL Hospitalar

⚠️ CRITICAL RULES (DO NOT VIOLATE):
- You may ONLY use products explicitly provided in the catalog input
- You may ONLY use specifications explicitly stated in product descriptions or PDFs
- If a requirement is NOT clearly met, you MUST mark it as NOT COMPLIANT
- Do NOT assume, infer, or hallucinate specifications
- Prefer the MINIMUM number of products that fully satisfy ALL mandatory requirements
- If NO product fully complies, state that clearly

---

## EDITAL REQUIREMENTS

${requirementsJson}

---

## PRODUCT CATALOG

${productsJson}

---

## YOUR TASK (EXECUTE STEP BY STEP)

### STEP 1 — REQUIREMENT ANALYSIS
For each edital requirement:
- Identify what technical or commercial condition must be satisfied
- Determine whether it is MANDATORY or OPTIONAL

### STEP 2 — PRODUCT EVALUATION
For EACH product:
- Compare every requirement against the product specifications
- Classify each requirement as: "COMPLIANT", "PARTIALLY_COMPLIANT", or "NOT_COMPLIANT"
- If information is missing → NOT_COMPLIANT

### STEP 3 — SCORING
For each product, calculate:
- compliance_score (0–100)
- Mandatory requirements have higher weight
- Any missing mandatory requirement caps score at 70 or less

### STEP 4 — FINAL SELECTION
- Select the SINGLE BEST product OR
- Select the MINIMAL SET of products that together satisfy all mandatory requirements
- If no valid solution exists, explain clearly why

---

## OUTPUT FORMAT (CRITICAL - READ CAREFULLY)

⚠️ ABSOLUTE REQUIREMENTS:
1. Return ONLY valid JSON
2. NO markdown code blocks (no \`\`\`json or \`\`\`)
3. NO explanatory text before the JSON
4. NO explanatory text after the JSON
5. First character must be {
6. Last character must be }
7. All strings must use double quotes "
8. No trailing commas

CORRECT OUTPUT EXAMPLE:
{"best_match":{"product_ids":["abc"],"product_names":["SAT 700"],"compliance_score":95,"justification":"Atende requisitos"},"requirement_analysis":[],"all_products_evaluated":[],"final_verdict":{"fully_compliant":true,"notes":"OK"}}

WRONG OUTPUT EXAMPLES (DO NOT DO THIS):
❌ \`\`\`json\n{...}\n\`\`\`
❌ Here is the analysis: {...}
❌ The product matching result is: {...}

Return the exact JSON structure:

{
  "best_match": {
    "product_ids": ["uuid"],
    "product_names": ["Product Name"],
    "compliance_score": 95,
    "justification": "Justificativa técnica detalhada"
  },
  "requirement_analysis": [
    {
      "requirement_id": "REQ-01",
      "title": "Requirement Title",
      "mandatory": true,
      "results": [
        {
          "product_id": "uuid",
          "status": "COMPLIANT",
          "evidence": "Evidence from specs or PDF"
        }
      ]
    }
  ],
  "all_products_evaluated": [
    {
      "product_id": "uuid",
      "product_name": "Product Name",
      "compliance_score": 85,
      "blocking_issues": ["List of issues"]
    }
  ],
  "final_verdict": {
    "fully_compliant": true,
    "notes": "Final notes"
  }
}

If NO product meets all mandatory requirements, set best_match to null and fully_compliant to false.

RESPOND IMMEDIATELY WITH PURE JSON (start with { and end with }):`
}

// ============================================================================
// VALIDATION
// ============================================================================

function validateMatchingOutput(data: unknown): ProductMatchingOutput {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid matching output: not an object')
    }

    const obj = data as Record<string, unknown>

    // Validate final_verdict
    if (!obj.final_verdict || typeof obj.final_verdict !== 'object') {
        throw new Error('Missing or invalid final_verdict')
    }

    const verdict = obj.final_verdict as Record<string, unknown>
    if (typeof verdict.fully_compliant !== 'boolean') {
        throw new Error('Invalid fully_compliant field')
    }

    // Validate arrays
    if (!Array.isArray(obj.requirement_analysis)) {
        throw new Error('Invalid requirement_analysis')
    }
    if (!Array.isArray(obj.all_products_evaluated)) {
        throw new Error('Invalid all_products_evaluated')
    }

    return data as ProductMatchingOutput
}

// ============================================================================
// MAIN MATCHING FUNCTION
// ============================================================================

export async function matchProductsWithClaude(
    input: ProductMatchingInput
): Promise<ProductMatchingResult> {
    try {
        // Validate input
        if (!input.requirements || input.requirements.length === 0) {
            return {
                success: false,
                error: 'No requirements provided',
            }
        }

        if (!input.products || input.products.length === 0) {
            return {
                success: false,
                error: 'No products provided for matching',
            }
        }

        // Initialize Claude client
        const apiKey = process.env.ANTHROPIC_API_KEY
        if (!apiKey) {
            throw new Error('ANTHROPIC_API_KEY not configured')
        }

        const client = new Anthropic({ apiKey })

        // Build prompt
        const prompt = buildMatchingPrompt(input)

        // Call Claude
        const message = await client.messages.create({
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

        // Extract response text
        const contentBlock = message.content[0]
        if (contentBlock.type !== 'text') {
            throw new Error('Unexpected response type from Claude')
        }

        const responseText = contentBlock.text

        // Parse JSON with auto-repair
        let parsedResponse: unknown
        try {
            parsedResponse = parseJSONSafely(responseText)
        } catch (parseError) {
            console.error('[Product Matching] JSON Parse Error:', parseError)
            throw parseError
        }

        // Validate structure
        const validatedOutput = validateMatchingOutput(parsedResponse)

        return {
            success: true,
            data: validatedOutput,
        }
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred'

        console.error('[Product Matching Error]', {
            error: errorMessage,
            input: {
                requirementCount: input.requirements?.length || 0,
                productCount: input.products?.length || 0,
            },
        })

        return {
            success: false,
            error: `Product matching failed: ${errorMessage}`,
        }
    }
}
