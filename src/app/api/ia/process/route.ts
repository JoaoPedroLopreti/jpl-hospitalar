import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { processWithClaude } from '@/lib/ia/claude'
import type { AIProcessInput } from '@/lib/ia/claude'

/**
 * POST /api/ia/process
 * 
 * CRITICAL PRODUCTION ENDPOINT
 * Processes edital text through Claude Sonnet AI pipeline
 * 
 * ARCHITECTURE:
 * Frontend → This endpoint → Claude module → Anthropic API → Structured response → Database
 * 
 * REQUEST BODY:
 * {
 *   "editalId": "uuid",           // Optional: if processing existing edital
 *   "editalText": "string",       // Required: raw text to analyze
 *   "editalName": "string",       // Required: name/identifier
 *   "context": "string"           // Optional: additional context
 * }
 * 
 * RESPONSE:
 * {
 *   "success": boolean,
 *   "data": {
 *     "summary": string,
 *     "compliance": boolean,
 *     "recommendations": string[]
 *   },
 *   "error": string (only if success=false)
 * }
 * 
 * CONSTRAINTS:
 * - Authenticated users only
 * - Input validation enforced
 * - Database logging for audit trail
 * - Fail-safe error handling
 */
export async function POST(request: NextRequest) {
    try {
        // ====================================================================
        // 1. AUTHENTICATION
        // ====================================================================
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Authentication required',
                },
                { status: 401 }
            )
        }

        // ====================================================================
        // 2. INPUT VALIDATION
        // ====================================================================
        const body = await request.json()

        const { editalId, editalText, editalName, context } = body

        // Validate required fields
        if (!editalText || typeof editalText !== 'string') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'editalText is required and must be a string',
                },
                { status: 400 }
            )
        }

        if (!editalName || typeof editalName !== 'string') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'editalName is required and must be a string',
                },
                { status: 400 }
            )
        }

        // Validate optional fields
        if (context !== undefined && typeof context !== 'string') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'context must be a string if provided',
                },
                { status: 400 }
            )
        }

        // Length constraints
        if (editalText.trim().length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'editalText cannot be empty',
                },
                { status: 400 }
            )
        }

        if (editalText.length > 100000) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'editalText exceeds maximum length (100,000 characters)',
                },
                { status: 400 }
            )
        }

        // ====================================================================
        // 3. LOGGING - START
        // ====================================================================
        let logId: string | null = null

        if (editalId) {
            // Log to existing edital
            const { data: log } = await supabase
                .from('LogProcessamento')
                .insert({
                    edital_id: editalId,
                    etapa: 'AI_PROCESSING',
                    mensagem: 'Iniciando processamento com Claude Sonnet',
                })
                .select('id')
                .single()

            logId = log?.id || null
        }

        // ====================================================================
        // 4. AI PROCESSING
        // ====================================================================
        const aiInput: AIProcessInput = {
            editalText: editalText.trim(),
            editalName: editalName.trim(),
            context: context?.trim(),
        }

        const result = await processWithClaude(aiInput)

        // ====================================================================
        // 5. ERROR HANDLING
        // ====================================================================
        if (!result.success || !result.data) {
            // Log failure
            if (editalId && logId) {
                await supabase
                    .from('LogProcessamento')
                    .insert({
                        edital_id: editalId,
                        etapa: 'AI_PROCESSING',
                        mensagem: `Falha: ${result.error || 'Unknown error'}`,
                    })
            }

            return NextResponse.json(
                {
                    success: false,
                    error: result.error || 'AI processing failed',
                },
                { status: 500 }
            )
        }

        // ====================================================================
        // 6. LOGGING - SUCCESS
        // ====================================================================
        if (editalId) {
            await supabase.from('LogProcessamento').insert({
                edital_id: editalId,
                etapa: 'AI_PROCESSING',
                mensagem: `Processamento concluído. Compliance: ${result.data.compliance}`,
            })

            // Update edital status
            await supabase
                .from('Edital')
                .update({
                    status: result.data.compliance
                        ? 'REQUIREMENTS_EXTRACTED'
                        : 'PROCESSING',
                })
                .eq('id', editalId)
        }

        // ====================================================================
        // 7. RESPONSE
        // ====================================================================
        return NextResponse.json({
            success: true,
            data: result.data,
        })
    } catch (error) {
        // ====================================================================
        // FAIL-SAFE: Never crash the system
        // ====================================================================
        console.error('[API /api/ia/process] Unhandled error:', error)

        const errorMessage =
            error instanceof Error ? error.message : 'Internal server error'

        return NextResponse.json(
            {
                success: false,
                error: errorMessage,
            },
            { status: 500 }
        )
    }
}

/**
 * GET /api/ia/process
 * Health check endpoint
 */
export async function GET() {
    try {
        // Verify environment is configured
        if (!process.env.ANTHROPIC_API_KEY) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'ANTHROPIC_API_KEY not configured',
                },
                { status: 500 }
            )
        }

        return NextResponse.json({
            status: 'ok',
            message: 'AI processing endpoint is ready',
            model: 'claude-sonnet-4-20250514',
        })
    } catch (error) {
        return NextResponse.json(
            {
                status: 'error',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        )
    }
}
