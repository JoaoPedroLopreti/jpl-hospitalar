import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { isValidUUID } from '@/lib/utils/uuid'
import { RefreshButton } from '@/components/ia/RefreshButton'

/**
 * Página de Detalhes do Edital com Resultados da IA
 */
export default async function EditalDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    // ========================================================================
    // 0. AWAIT PARAMS (Next.js 15 requirement)
    // ========================================================================
    const resolvedParams = await params

    // ========================================================================
    // 1. VALIDAÇÃO DE UUID (CRÍTICO - PREVINE QUERY INVÁLIDA)
    // ========================================================================
    if (!isValidUUID(resolvedParams.id)) {
        console.error('[Edital Details] Invalid UUID provided:', resolvedParams.id)
        notFound()
    }

    // ========================================================================
    // 2. AUTENTICAÇÃO
    // ========================================================================
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    console.log('[Edital Details] User:', user.id, 'Edital:', resolvedParams.id)

    // ========================================================================
    // 3. BUSCAR EDITAL (AGORA COM UUID VALIDADO)
    // ========================================================================
    console.log('[Edital Details] Fetching edital:', resolvedParams.id)

    const { data: edital, error: editalError } = await supabase
        .from('Edital')
        .select(`
            id, 
            nome, 
            arquivo_url, 
            status, 
            created_by, 
            created_at, 
            updated_at,
            best_product_id,
            bestProduct:ProdutoCatalogo!best_product_id(*)
        `)
        .eq('id', resolvedParams.id)
        .single()

    console.log('[Edital Details] Edital query result:', {
        found: !!edital,
        status: edital?.status,
        best_product_id: edital?.best_product_id,
        has_bestProduct: !!edital?.bestProduct,
        error: editalError?.message
    })

    if (editalError) {
        console.error('[Edital Details] Database error:', {
            code: editalError.code,
            message: editalError.message,
            details: editalError.details,
            hint: editalError.hint,
        })

        // Se for erro de "not found", usar notFound() do Next.js
        if (editalError.code === 'PGRST116') {
            notFound()
        }

        // Outros erros mostram página de erro
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
                    <h2 className="font-bold mb-2">❌ Erro ao Carregar Edital</h2>
                    <p className="mb-2">Não foi possível carregar o edital.</p>
                    <div className="text-sm mb-4 bg-red-100 p-2 rounded font-mono">
                        <p><strong>Código:</strong> {editalError.code}</p>
                        <p><strong>Mensagem:</strong> {editalError.message}</p>
                    </div>
                    <Link
                        href="/dashboard/ia"
                        className="text-blue-600 hover:underline inline-block"
                    >
                        ← Voltar para Dashboard
                    </Link>
                </div>
            </div>
        )
    }

    if (!edital) {
        notFound()
    }

    // ========================================================================
    // 4. BUSCAR DADOS RELACIONADOS
    // ========================================================================
    console.log('[Edital Details] Fetching related data for edital:', resolvedParams.id)

    const { data: requisitos, error: requisitosError } = await supabase
        .from('RequisitosExtraidos')
        .select('*')
        .eq('edital_id', resolvedParams.id)

    if (requisitosError) {
        console.error('[Edital Details] Requisitos error:', requisitosError)
    } else {
        console.log('[Edital Details] Requisitos found:', requisitos?.length || 0)
    }

    const { data: analises, error: analisesError } = await supabase
        .from('AnaliseProduto')
        .select(`
            *,
            produto:ProdutoCatalogo(*)
        `)
        .eq('edital_id', resolvedParams.id)

    if (analisesError) {
        console.error('[Edital Details] Analises error:', analisesError)
    } else {
        console.log('[Edital Details] Analises found:', analises?.length || 0)
        if (analises && analises.length > 0) {
            console.log('[Edital Details] First analysis:', {
                id: analises[0].id,
                produto_id: analises[0].produto_id,
                score: analises[0].score_adequacao,
                has_produto: !!analises[0].produto
            })
        }
    }

    const { data: logs, error: logsError } = await supabase
        .from('LogProcessamento')
        .select('*')
        .eq('edital_id', resolvedParams.id)
        .order('created_at', { ascending: false })

    if (logsError) {
        console.error('[Edital Details] Logs error:', logsError)
    } else {
        console.log('[Edital Details] Logs found:', logs?.length || 0)
    }

    // ========================================================================
    // USE BEST PRODUCT FROM EDITAL (SOURCE OF TRUTH)
    // ========================================================================
    // Supabase may return as array or object depending on relation
    const bestProductData = Array.isArray(edital?.bestProduct)
        ? edital?.bestProduct[0]
        : edital?.bestProduct

    // Get the analysis for the selected product to show score and justification
    let bestProductAnalysis = null
    if (bestProductData && analises && analises.length > 0) {
        bestProductAnalysis = analises.find((a: any) => a.produto_id === edital.best_product_id)
    }

    // Combine product data with its analysis
    const bestProduct = bestProductData ? {
        produto: bestProductData,
        score_adequacao: bestProductAnalysis?.score_adequacao || 100,
        justificativa: bestProductAnalysis?.justificativa || 'Produto selecionado pela IA',
        produto_id: edital.best_product_id,
    } : null

    console.log('[Edital Details] Best product (from edital):', {
        has_product: !!bestProduct,
        product_name: bestProduct?.produto?.nome,
        score: bestProduct?.score_adequacao,
        product_id: bestProduct?.produto_id
    })

    // ========================================================================
    // 5. RENDERIZAR UI
    // ========================================================================
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/dashboard/ia"
                        className="text-blue-600 hover:underline mb-4 inline-block"
                    >
                        ← Voltar para Dashboard IA
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">{edital.nome}</h1>
                    <p className="text-gray-600 mt-1">
                        Criado em {new Date(edital.created_at).toLocaleDateString('pt-BR')} •{' '}
                        Status: <span className="font-semibold">{edital.status}</span>
                    </p>
                </div>

                {/* Resultado Principal */}
                {bestProduct ? (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-lg p-8 mb-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-green-900 mb-2">
                                    ✅ Produto Recomendado pela IA
                                </h2>
                                <p className="text-green-700 text-lg">
                                    O Claude Sonnet analisou o edital e identificou o produto ideal
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white px-8 py-4 rounded-2xl shadow-lg">
                                <div className="text-center">
                                    <div className="font-bold text-3xl">{bestProduct.score_adequacao}%</div>
                                    <div className="text-xs text-green-100 mt-1">Adequação</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md">
                            {/* Produto Info */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {bestProduct.produto?.nome || 'Nome não disponível'}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                                📦 {bestProduct.produto?.categoria || 'N/A'}
                                            </span>
                                            {bestProduct.produto?.codigo && (
                                                <span className="text-gray-500">
                                                    Código: {bestProduct.produto.codigo}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Especificações */}
                            {bestProduct.produto?.especificacoes && bestProduct.produto.especificacoes.length > 0 && (
                                <div className="mb-6 pb-6 border-b border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="text-xl">⚙️</span>
                                        Especificações Técnicas
                                    </h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {bestProduct.produto.especificacoes.map((spec: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2 text-gray-700">
                                                <span className="text-green-600 mt-1">✓</span>
                                                <span>{spec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Justificativa da IA */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2 text-lg">
                                    <span className="text-2xl">🤖</span>
                                    Por que este produto foi escolhido?
                                </h4>
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {bestProduct.justificativa || 'A IA analisou os requisitos do edital e identificou que este produto possui a melhor adequação técnica e comercial para atender às especificações solicitadas.'}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : requisitos && requisitos.length > 0 ? (
                    // Requirements extracted but no product found
                    <div className="bg-orange-50 border-2 border-orange-300 rounded-xl shadow-lg p-8 mb-8">
                        <div className="flex items-start gap-4 mb-4">
                            <span className="text-4xl">⚠️</span>
                            <div>
                                <h2 className="text-2xl font-bold text-orange-900 mb-2">
                                    Nenhum Produto Encontrado
                                </h2>
                                <p className="text-orange-700 text-lg">
                                    A IA analisou o edital e extraiu os requisitos, mas nenhum produto do catálogo atual atende integralmente às especificações exigidas.
                                </p>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6 mt-4">
                            <h3 className="font-bold text-gray-900 mb-2">📋 O que fazer?</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Revise os requisitos extraídos abaixo</li>
                                <li>Verifique se há produtos similares no catálogo</li>
                                <li>Considere contato com fornecedores alternativos</li>
                                <li>Avalie a possibilidade de adaptações técnicas</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    // Still processing
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-bold text-yellow-900 mb-2">
                            ⏳ Processamento em Andamento
                        </h2>
                        <p className="text-yellow-800 mb-4">
                            A IA ainda está processando o edital. Aguarde alguns instantes e
                            recarregue a página.
                        </p>
                        <RefreshButton />
                    </div>
                )}

                {/* Requisitos */}
                {requisitos && requisitos.length > 0 && requisitos[0].conteudo && (
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl">📋</span>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Requisitos Extraídos do Edital
                                </h2>
                                <p className="text-sm text-gray-600">
                                    A IA identificou {(requisitos[0].conteudo as any[]).length} requisitos no documento
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            {(requisitos[0].conteudo as any[]).map((req: any, i: number) => (
                                <div
                                    key={i}
                                    className={`border-l-4 ${req.mandatory ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'} rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                            {req.mandatory ? '🔴' : '🔵'}
                                            {req.name}
                                        </h3>
                                        <span className={`${req.mandatory ? 'bg-red-600' : 'bg-blue-600'} text-white text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap`}>
                                            {req.mandatory ? 'OBRIGATÓRIO' : 'RECOMENDADO'}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{req.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Produtos Analisados (quando não há best product mas há análises) */}
                {!bestProduct && analises && analises.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl">🔍</span>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Produtos Analisados
                                </h2>
                                <p className="text-sm text-gray-600">
                                    A IA avaliou {analises.length} produto(s) do catálogo
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            {analises.map((analise: any) => (
                                <div
                                    key={analise.id}
                                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">
                                                {analise.produto?.nome || 'Produto não identificado'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {analise.produto?.categoria}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <div className={`text-2xl font-bold ${analise.score_adequacao >= 70 ? 'text-green-600' : analise.score_adequacao >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {analise.score_adequacao}%
                                            </div>
                                            <div className="text-xs text-gray-500">Adequação</div>
                                        </div>
                                    </div>
                                    {analise.justificativa && (
                                        <p className="text-sm text-gray-700 mt-2">
                                            {analise.justificativa}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Logs */}
                {logs && logs.length > 0 && (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200 shadow-md">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl">🔍</span>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Histórico de Processamento
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Timeline completa do processamento pela IA
                                </p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {logs.map((log: any, idx: number) => (
                                <div
                                    key={log.id}
                                    className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-lg mt-0.5">
                                            {idx === 0 ? '✅' : idx === logs.length - 1 ? '🏁' : '⚙️'}
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold">
                                                    {log.etapa}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(log.created_at).toLocaleString('pt-BR')}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700">
                                                {log.mensagem}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
