'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadEditalForm } from '@/components/ia/UploadEditalForm'
import Link from 'next/link'
import { isValidUUID } from '@/lib/utils/uuid'

/**
 * Página de upload de novo edital
 * ✅ PRODUCTION-GRADE: Validates UUID before navigation
 */
export default function NovoEditalPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isNavigating, setIsNavigating] = useState(false)

    const handleSuccess = (editalId: string) => {
        // 🛡️ CRITICAL: Never navigate without UUID validation
        if (!editalId) {
            console.error('[Novo Edital] ERROR: editalId is empty')
            setError('Erro interno: ID do edital não foi retornado')
            return
        }

        if (!isValidUUID(editalId)) {
            console.error('[Novo Edital] ERROR: Invalid UUID:', editalId)
            setError(`Erro interno: ID inválido (${editalId})`)
            return
        }

        console.log('[Novo Edital] ✅ Success, navigating to:', editalId)
        setIsNavigating(true)

        // Safe to navigate - UUID is validated
        router.push(`/dashboard/ia/edital/${editalId}`)
    }

    const handleError = (errorMessage: string) => {
        console.error('[Novo Edital] Upload error:', errorMessage)
        setError(errorMessage)
        setIsNavigating(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link href="/dashboard/ia" className="text-blue-600 hover:underline">
                        ← Voltar para Dashboard IA
                    </Link>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        <div className="flex items-start">
                            <span className="font-bold mr-2">❌</span>
                            <div>
                                <p className="font-semibold">Erro no Upload</p>
                                <p className="text-sm mt-1">{error}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="mt-2 text-sm underline"
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {/* Navigating State */}
                {isNavigating && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
                        <div className="flex items-center">
                            <svg
                                className="animate-spin h-5 w-5 mr-2"
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
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            <span>Redirecionando para o edital...</span>
                        </div>
                    </div>
                )}

                {/* Form */}
                <UploadEditalForm
                    onSuccess={handleSuccess}
                    onError={handleError}
                />

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-bold text-blue-900 mb-2">ℹ️ Como funciona</h3>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Faça upload do(s) arquivo(s) do edital (PDF - até 5 arquivos)</li>
                        <li>O sistema extrairá o texto de todos os documentos automaticamente</li>
                        <li>A IA processará e identificará o melhor produto</li>
                        <li>Você será redirecionado para ver os resultados</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}
