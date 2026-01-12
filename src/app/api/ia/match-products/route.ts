import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { matchProductsWithClaude } from '@/lib/ia/product-matching'
import type { ProductMatchingInput } from '@/lib/ia/matching-types'

/**
 * POST /api/ia/match-products
 * 
 * CRITICAL PRODUCTION ENDPOINT
 * Matches edital requirements against JPL Hospitalar product catalog
 * 
 * REQUEST BODY:
 * {
 *   "editalId": "uuid",              // Optional: link to edital
 *   "requirements": [                // Required: array of requirements
 *     {
 *       "id": "REQ-01",
 *       "title": "Voltagem",
 *       "description": "220V required",
 *       "mandatory": true
 *     }
 *   ],
 *   "productIds": ["uuid", ...]      // Optional: specific products to match
 * }
 * 
 * RESPONSE:
 * {
 *   "success": boolean,
 *   "data": {
 *     "best_match": {...},
 *     "requirement_analysis": [...],
 *     "all_products_evaluated": [...],
 *     "final_verdict": {...}
 *   }
 * }
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
        const { editalId, requirements, productIds } = body

        if (!requirements || !Array.isArray(requirements)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'requirements array is required',
                },
                { status: 400 }
            )
        }

        if (requirements.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'At least one requirement is needed',
                },
                { status: 400 }
            )
        }

        // Validate requirement structure
        for (const req of requirements) {
            if (!req.id || !req.title || !req.description) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Each requirement must have id, title, and description',
                    },
                    { status: 400 }
                )
            }
            if (typeof req.mandatory !== 'boolean') {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Each requirement must have mandatory boolean field',
                    },
                    { status: 400 }
                )
            }
        }

        // ====================================================================
        // 3. FETCH PRODUCTS FROM DATABASE
        // ====================================================================
        let query = supabase
            .from('ProdutoCatalogo')
            .select('*')
            .eq('ativo', true)

        // Filter by specific products if provided
        if (productIds && Array.isArray(productIds) && productIds.length > 0) {
            query = query.in('id', productIds)
        }

        const { data: products, error: productsError } = await query

        if (productsError) {
            throw new Error(`Failed to fetch products: ${productsError.message}`)
        }

        if (!products || products.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'No active products found in catalog',
                },
                { status: 404 }
            )
        }

        // Transform products for matching
        const productsForMatching = products.map((p) => ({
            id: p.id,
            nome: p.nome,
            categoria: p.categoria,
            descricao_curta: p.descricao_curta,
            aplicacao: p.aplicacao,
            observacoes: p.observacoes,
            especificacoes_tecnicas: p.especificacoes || {},
            pdf_text: p.pdf_url ? `Catálogo PDF disponível: ${p.pdf_url}` : null,
        }))

        // ====================================================================
        // 4. LOGGING - START
        // ====================================================================
        if (editalId) {
            await supabase.from('LogProcessamento').insert({
                edital_id: editalId,
                etapa: 'PRODUCT_MATCHING',
                mensagem: `Iniciando matching com ${products.length} produtos do catálogo`,
            })
        }

        // ====================================================================
        // 5. PRODUCT MATCHING
        // ====================================================================
        const matchingInput: ProductMatchingInput = {
            requirements,
            products: productsForMatching,
        }

        const result = await matchProductsWithClaude(matchingInput)

        // ====================================================================
        // 6. ERROR HANDLING
        // ====================================================================
        if (!result.success || !result.data) {
            if (editalId) {
                await supabase.from('LogProcessamento').insert({
                    edital_id: editalId,
                    etapa: 'PRODUCT_MATCHING',
                    mensagem: `Falha no matching: ${result.error || 'Unknown error'}`,
                })
            }

            return NextResponse.json(
                {
                    success: false,
                    error: result.error || 'Product matching failed',
                },
                { status: 500 }
            )
        }

        // ====================================================================
        // 7. LOGGING - SUCCESS
        // ====================================================================
        if (editalId) {
            const bestMatch = result.data.best_match
            const message = bestMatch
                ? `Matching concluído. Melhor produto: ${bestMatch.product_names.join(', ')} (score: ${bestMatch.compliance_score})`
                : 'Matching concluído. Nenhum produto atende todos os requisitos obrigatórios'

            await supabase.from('LogProcessamento').insert({
                edital_id: editalId,
                etapa: 'PRODUCT_MATCHING',
                mensagem: message,
            })

            // Update edital status if matching is successful
            if (bestMatch) {
                await supabase
                    .from('Edital')
                    .update({ status: 'PRODUCT_SELECTED' })
                    .eq('id', editalId)
            }
        }

        // ====================================================================
        // 8. RESPONSE
        // ====================================================================
        return NextResponse.json({
            success: true,
            data: result.data,
        })
    } catch (error) {
        console.error('[API /api/ia/match-products] Error:', error)

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
 * GET /api/ia/match-products
 * Health check
 */
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Product matching endpoint is ready',
        model: 'claude-sonnet-4-20250514',
    })
}
