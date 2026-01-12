/**
 * PRODUCT MATCHING TEST COMPONENT
 * Tests the product matching system with sample requirements
 */

'use client'

import { useState } from 'react'

interface BestMatch {
    product_ids: string[]
    product_names: string[]
    compliance_score: number
    justification: string
}

interface MatchingResult {
    best_match: BestMatch | null
    requirement_analysis: any[]
    all_products_evaluated: any[]
    final_verdict: {
        fully_compliant: boolean
        notes: string
    }
}

export function ProductMatchingTest() {
    const [processing, setProcessing] = useState(false)
    const [result, setResult] = useState<MatchingResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const runMatching = async () => {
        setProcessing(true)
        setError(null)
        setResult(null)

        // Sample requirements for testing
        const testRequirements = [
            {
                id: 'REQ-01',
                title: 'Voltagem',
                description: 'Equipamento deve operar em 220V bivolt automático',
                mandatory: true,
            },
            {
                id: 'REQ-02',
                title: 'Certificação ANVISA',
                description: 'Registro ANVISA vigente obrigatório',
                mandatory: true,
            },
            {
                id: 'REQ-03',
                title: 'Garantia',
                description: 'Garantia mínima de 24 meses',
                mandatory: true,
            },
            {
                id: 'REQ-04',
                title: 'Monitor Digital',
                description: 'Sistema de monitoramento digital de pressão e fluxo',
                mandatory: false,
            },
        ]

        try {
            const response = await fetch('/api/ia/match-products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requirements: testRequirements,
                    // productIds: [] // Optional: leave empty to match against all products
                }),
            })

            const data = await response.json()

            if (data.success) {
                setResult(data.data)
            } else {
                setError(data.error)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred')
        } finally {
            setProcessing(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-2">🎯 Teste de Matching de Produtos</h2>
                <p className="text-gray-600 text-sm mb-4">
                    Este teste compara requisitos de edital contra o catálogo completo da JPL
                    Hospitalar
                </p>

                <button
                    onClick={runMatching}
                    disabled={processing}
                    className="w-full bg-purple-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {processing ? (
                        <span className="flex items-center justify-center">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Processando matching...
                        </span>
                    ) : (
                        '🎯 Executar Matching de Produtos'
                    )}
                </button>
            </div>

            {/* Sample Requirements Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">Requisitos de Teste:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Voltagem 220V (obrigatório)</li>
                    <li>✓ Certificação ANVISA (obrigatório)</li>
                    <li>✓ Garantia 24 meses (obrigatório)</li>
                    <li>○ Monitor Digital (opcional)</li>
                </ul>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    <p className="font-semibold">Erro:</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Results Display */}
            {result && (
                <div className="space-y-4">
                    {/* Best Match */}
                    {result.best_match ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <h3 className="font-bold text-green-900 text-lg mb-3">
                                ✓ Melhor Produto Encontrado
                            </h3>

                            <div className="bg-white p-4 rounded-md mb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-bold text-xl">
                                        {result.best_match.product_names.join(', ')}
                                    </p>
                                    <span className="bg-green-600 text-white px-4 py-2 rounded-full font-bold">
                                        {result.best_match.compliance_score}%
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700">
                                    {result.best_match.justification}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <h3 className="font-bold text-yellow-900 text-lg mb-2">
                                ⚠️ Nenhum Produto Atende Totalmente
                            </h3>
                            <p className="text-sm text-yellow-800">
                                {result.final_verdict.notes}
                            </p>
                        </div>
                    )}

                    {/* All Products Evaluated */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-bold text-gray-900 mb-4">
                            📊 Todos os Produtos Avaliados ({result.all_products_evaluated.length})
                        </h3>

                        <div className="space-y-3">
                            {result.all_products_evaluated.map((product, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-md p-4"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-semibold">{product.product_name}</p>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${product.compliance_score >= 80
                                                ? 'bg-green-100 text-green-800'
                                                : product.compliance_score >= 60
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {product.compliance_score}%
                                        </span>
                                    </div>
                                    {product.blocking_issues.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-xs font-semibold text-red-600 mb-1">
                                                Problemas:
                                            </p>
                                            <ul className="list-disc list-inside text-xs text-gray-600">
                                                {product.blocking_issues.map((issue: string, i: number) => (
                                                    <li key={i}>{issue}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Requirement Analysis */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <h3 className="font-bold text-gray-900 mb-4">
                            📋 Análise por Requisito
                        </h3>
                        <div className="space-y-3">
                            {result.requirement_analysis.map((req, index) => (
                                <div key={index} className="bg-white p-3 rounded-md">
                                    <p className="font-semibold text-sm">
                                        {req.title}
                                        {req.mandatory && (
                                            <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                                OBRIGATÓRIO
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {req.results.length} produtos analisados
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
