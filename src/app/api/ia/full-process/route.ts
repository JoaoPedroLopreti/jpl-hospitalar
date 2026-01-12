import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runFullPipeline } from '@/lib/ia/full-pipeline'

/**
 * POST /api/ia/full-process
 * 
 * MASTER ENDPOINT - Complete AI Pipeline
 * Extracts requirements from edital AND matches products in ONE call
 * 
 * REQUEST BODY:
 * {
 *   "editalId": "uuid",         // Optional: link to edital record
 *   "editalText": "string",     // Required: full text from PDF
 *   "editalName": "string",     // Required: edital identifier
 *   "productIds": ["uuid"]      // Optional: specific products to match
 * }
 * 
 * RESPONSE:
 * {
 *   "success": boolean,
 *   "data": {
 *     "extracted_requirements": [...],
 *     "product_matching": [...],
 *     "best_product_identified": {...},
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
                { success: false, error: 'Authentication required' },
                { status: 401 }
            )
        }

        // ====================================================================
        // 2. INPUT VALIDATION
        // ====================================================================
        const body = await request.json()
        const { editalId, editalText, editalName, productIds } = body

        if (!editalText || typeof editalText !== 'string') {
            return NextResponse.json(
                { success: false, error: 'editalText is required and must be a string' },
                { status: 400 }
            )
        }

        if (!editalName || typeof editalName !== 'string') {
            return NextResponse.json(
                { success: false, error: 'editalName is required and must be a string' },
                { status: 400 }
            )
        }

        if (editalText.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'editalText cannot be empty' },
                { status: 400 }
            )
        }

        // ====================================================================
        // 3. FETCH PRODUCTS FROM CATALOG
        // ====================================================================
        let query = supabase.from('ProdutoCatalogo').select('*').eq('ativo', true)

        if (productIds && Array.isArray(productIds) && productIds.length > 0) {
            query = query.in('id', productIds)
        }

        const { data: products, error: productsError } = await query

        if (productsError) {
            throw new Error(`Failed to fetch products: ${productsError.message}`)
        }

        if (!products || products.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No active products found in catalog' },
                { status: 404 }
            )
        }

        // Transform for pipeline
        const productsForPipeline = products.map((p) => ({
            id: p.id,
            nome: p.nome,
            categoria: p.categoria,
            descricao_curta: p.descricao_curta,
            aplicacao: p.aplicacao,
            observacoes: p.observacoes,
            especificacoes_tecnicas: p.especificacoes || {},
            pdf_text: p.pdf_url
                ? `Produto com catálogo PDF disponível em: ${p.pdf_url}`
                : null,
        }))

        // ====================================================================
        // 4. LOG START
        // ====================================================================
        if (editalId) {
            await supabase.from('LogProcessamento').insert({
                edital_id: editalId,
                etapa: 'FULL_PIPELINE',
                mensagem: `Iniciando pipeline completo (extração + matching) com ${products.length} produtos`,
            })
        }

        // ====================================================================
        // 5. RUN FULL PIPELINE
        // ====================================================================
        const result = await runFullPipeline({
            editalText,
            editalName,
            products: productsForPipeline,
        })

        // ====================================================================
        // 6. ERROR HANDLING
        // ====================================================================
        if (!result.success || !result.data) {
            if (editalId) {
                await supabase.from('LogProcessamento').insert({
                    edital_id: editalId,
                    etapa: 'FULL_PIPELINE',
                    mensagem: `Falha: ${result.error || 'Unknown error'}`,
                })
            }

            return NextResponse.json(
                { success: false, error: result.error || 'Pipeline failed' },
                { status: 500 }
            )
        }

        // ====================================================================
        // 7. SAVE TO DATABASE
        // ====================================================================
        if (editalId) {
            const data = result.data

            // Save extracted requirements
            if (data.extracted_requirements.length > 0) {
                const { error: reqError } = await supabase.from('RequisitosExtraidos').insert({
                    edital_id: editalId,
                    tipo: 'TECNICO',
                    conteudo: data.extracted_requirements,
                })

                if (reqError) {
                    console.error('[API] ❌ Failed to save requirements:', reqError)
                } else {
                    console.log('[API] ✅ Saved', data.extracted_requirements.length, 'requirements')
                }
            } else {
                console.log('[API] ⚠️ No requirements extracted by AI')
            }

            // Save product analyses
            if (data.product_matching.length > 0) {
                const bestProduct = data.best_product_identified

                const analyses = data.product_matching.map((pm) => {
                    // Mark if this is the AI's selected product
                    const isSelected = bestProduct && pm.product_id === bestProduct.product_id

                    return {
                        edital_id: editalId,
                        produto_id: pm.product_id,
                        score_adequacao: pm.compliance_score,
                        atende_requisitos: pm.blocking_issues.length === 0 && pm.compliance_score >= 80,
                        // Use AI's justification if this is the selected product
                        justificativa: isSelected && bestProduct.justification
                            ? bestProduct.justification
                            : `Score: ${pm.compliance_score}%, Problemas: ${pm.blocking_issues.length}`,
                        detalhes_analise: pm.results,
                    }
                })

                const { error: analysisError } = await supabase.from('AnaliseProduto').insert(analyses)

                if (analysisError) {
                    console.error('[API /api/ia/full-process] Failed to save analyses:', analysisError)
                } else {
                    console.log('[API /api/ia/full-process] ✅ Saved', analyses.length, 'product analyses')
                }
            }

            // Get best product for logging and database update
            const bestProduct = data.best_product_identified
            const message = bestProduct
                ? `Pipeline concluído. Produto identificado: ${bestProduct.product_name} (confiança: ${bestProduct.confidence})`
                : 'Pipeline concluído. Nenhum produto atende integralmente aos requisitos.'

            await supabase.from('LogProcessamento').insert({
                edital_id: editalId,
                etapa: 'FULL_PIPELINE',
                mensagem: message,
            }).then(({ error: logError }) => {
                if (logError) {
                    console.error('[API] ❌ Failed to save log:', logError)
                } else {
                    console.log('[API] ✅ Saved completion log')
                }
            })

            // ========================================================================
            // CRITICAL: Save best product to Edital table
            // ========================================================================
            const newStatus = bestProduct ? 'PRODUCT_SELECTED' : 'REQUIREMENTS_EXTRACTED'
            const updateData: any = { status: newStatus }

            if (bestProduct && bestProduct.product_id) {
                updateData.best_product_id = bestProduct.product_id
                console.log('[API /api/ia/full-process] ✅ Setting best_product_id:', bestProduct.product_id)
            }

            const { error: updateError } = await supabase
                .from('Edital')
                .update(updateData)
                .eq('id', editalId)

            if (updateError) {
                console.error('[API /api/ia/full-process] Failed to update edital:', updateError)
            } else {
                console.log('[API /api/ia/full-process] ✅ Edital updated - Status:', newStatus, 'Best Product ID:', bestProduct?.product_id || 'None')
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
        console.error('[API /api/ia/full-process] Error:', error)

        const errorMessage =
            error instanceof Error ? error.message : 'Internal server error'

        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        )
    }
}

/**
 * GET /api/ia/full-process
 * Health check
 */
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Full AI pipeline endpoint is ready',
        model: 'claude-sonnet-4-20250514',
        capabilities: [
            'Requirement extraction from edital',
            'Product matching against catalog',
            'Best product identification',
            'Compliance verification',
        ],
    })
}
