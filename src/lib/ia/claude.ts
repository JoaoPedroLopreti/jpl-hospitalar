// ============================================================================
// CLAUDE SONNET AI INTEGRATION - PRODUCTION
// ============================================================================
// This module handles all interactions with Claude Sonnet API
// Strict schema enforcement, deterministic outputs, fail-safe mechanisms
// ============================================================================

import Anthropic from '@anthropic-ai/sdk'
import { parseJSONSafely } from './json-utils'

// ============================================================================
// TYPES
// ============================================================================

export interface AIProcessInput {
    editalText: string
    editalName: string
    context?: string
}

export interface AIProcessOutput {
    summary: string
    compliance: boolean
    recommendations: string[]
}

export interface AIProcessResult {
    success: boolean
    data?: AIProcessOutput
    error?: string
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const CLAUDE_MODEL = 'claude-sonnet-4-20250514' as const
const MAX_TOKENS = 2048
const TEMPERATURE = 0.2 // Low temperature for deterministic output

// ============================================================================
// CLIENT INITIALIZATION
// ============================================================================

function getClaudeClient(): Anthropic {
    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY not configured in environment')
    }

    return new Anthropic({
        apiKey,
    })
}

// ============================================================================
// PROMPT CONSTRUCTION
// ============================================================================

function buildAnalysisPrompt(input: AIProcessInput): string {
    return `You are an expert technical analyst for medical equipment procurement.

Analyze the following tender document (edital) and provide a structured assessment.

EDITAL NAME: ${input.editalName}

EDITAL CONTENT:
${input.editalText}

${input.context ? `ADDITIONAL CONTEXT:\n${input.context}\n` : ''}

CRITICAL OUTPUT RULES:
- Return ONLY valid JSON
- NO markdown formatting (no \`\`\`json or \`\`\`)
- NO explanatory text before or after the JSON
- Start directly with {
- End directly with }

ANALYSIS TASKS:
1. Summarize technical requirements
2. Assess if requirements are clear and verifiable
3. Identify compliance issues
4. Provide actionable recommendations

JSON SCHEMA (exact format required):
{
  "summary": "string - brief technical summary",
  "compliance": boolean - true if clear and verifiable,
  "recommendations": ["string array of practical recommendations"]
}

Example valid response:
{"summary":"Edital para aquisição de equipamentos com requisitos técnicos claros","compliance":true,"recommendations":["Verificar certificações","Validar prazos"]}

RESPOND NOW WITH PURE JSON ONLY:`
}

// ============================================================================
// RESPONSE VALIDATION
// ============================================================================

function validateAIOutput(data: unknown): AIProcessOutput {
    // Runtime type checking
    if (!data || typeof data !== 'object') {
        throw new Error('AI response is not an object')
    }

    const obj = data as Record<string, unknown>

    if (typeof obj.summary !== 'string' || obj.summary.length === 0) {
        throw new Error('Invalid or missing "summary" field')
    }

    if (typeof obj.compliance !== 'boolean') {
        throw new Error('Invalid or missing "compliance" field')
    }

    if (!Array.isArray(obj.recommendations)) {
        throw new Error('Invalid or missing "recommendations" field')
    }

    // Validate all recommendations are strings
    const recommendations = obj.recommendations as unknown[]
    if (!recommendations.every((r) => typeof r === 'string')) {
        throw new Error('All recommendations must be strings')
    }

    return {
        summary: obj.summary,
        compliance: obj.compliance,
        recommendations: recommendations as string[],
    }
}

// ============================================================================
// MAIN PROCESSING FUNCTION
// ============================================================================

export async function processWithClaude(
    input: AIProcessInput
): Promise<AIProcessResult> {
    try {
        // Validate input
        if (!input.editalText || input.editalText.trim().length === 0) {
            return {
                success: false,
                error: 'Edital text is required and cannot be empty',
            }
        }

        if (!input.editalName || input.editalName.trim().length === 0) {
            return {
                success: false,
                error: 'Edital name is required',
            }
        }

        // Initialize client
        const client = getClaudeClient()

        // Build prompt
        const prompt = buildAnalysisPrompt(input)

        // Call Claude Sonnet
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

        const contentBlock = message.content[0]
        if (contentBlock.type !== 'text') {
            throw new Error('Unexpected response type from Claude')
        }

        const responseText = contentBlock.text

        // Parse JSON with auto-repair
        const parsedResponse = parseJSONSafely(responseText)

        // Validate structure
        const validatedOutput = validateAIOutput(parsedResponse)

        return {
            success: true,
            data: validatedOutput,
        }
    } catch (error) {
        // Fail-safe: never crash the system
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred'

        console.error('[AI Pipeline Error]', {
            error: errorMessage,
            input: {
                editalName: input.editalName,
                textLength: input.editalText?.length || 0,
            },
        })

        // Return safe fallback
        return {
            success: false,
            error: `AI processing failed: ${errorMessage}`,
        }
    }
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

export async function healthCheck(): Promise<boolean> {
    try {
        const client = getClaudeClient()
        // Simple ping to verify API key is valid
        await client.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 10,
            messages: [{ role: 'user', content: 'ping' }],
        })
        return true
    } catch {
        return false
    }
}
