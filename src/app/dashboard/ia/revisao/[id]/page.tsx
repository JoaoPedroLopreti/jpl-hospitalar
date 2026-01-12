'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { PropostaPreview } from '@/components/ia/PropostaPreview'
import { ReviewActions } from '@/components/ia/ReviewActions'
import Link from 'next/link'

/**
 * Página de revisão de proposta
 */
export default function RevisaoPropostaPage() {
    const router = useRouter()
    const params = useParams()
    const propostaId = params.id as string

    const [proposta, setProposta] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        // Buscar proposta (mock - na realidade seria uma API call)
        const fetchProposta = async () => {
            // Simulação
            setProposta({
                id: propostaId,
                editalId: 'mock-edital-id',
                conteudoTecnico: 'Conteúdo técnico mockado...',
                conteudoComercial: 'Conteúdo comercial mockado...',
                status: 'UNDER_REVIEW',
                aprovadoPor: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            setLoading(false)
        }

        fetchProposta()
    }, [propostaId])

    const handleApprove = async () => {
        setSubmitting(true)
        try {
            const response = await fetch('/api/ia/proposta/aprovar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    propostaId,
                    acao: 'APPROVE',
                }),
            })

            const data = await response.json()
            if (data.success) {
                alert('Proposta aprovada com sucesso!')
                router.push('/dashboard/ia')
            } else {
                alert('Erro: ' + data.error)
            }
        } catch (error) {
            alert('Erro ao aprovar proposta')
        } finally {
            setSubmitting(false)
        }
    }

    const handleReject = async () => {
        setSubmitting(true)
        try {
            const response = await fetch('/api/ia/proposta/aprovar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    propostaId,
                    acao: 'REJECT',
                }),
            })

            const data = await response.json()
            if (data.success) {
                alert('Proposta rejeitada')
                router.push('/dashboard/ia')
            } else {
                alert('Erro: ' + data.error)
            }
        } catch (error) {
            alert('Erro ao rejeitar proposta')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">Carregando...</div>
    }

    if (!proposta) {
        return <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">Proposta não encontrada</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link href="/dashboard/ia" className="text-blue-600 hover:underline">
                        ← Voltar para Dashboard IA
                    </Link>
                </div>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Revisão de Proposta
                    </h1>
                    <p className="text-gray-600">
                        Analise a proposta gerada e aprove ou rejeite
                    </p>
                </div>

                {/* Proposta */}
                <div className="mb-6">
                    <PropostaPreview proposta={proposta} />
                </div>

                {/* Actions */}
                <ReviewActions
                    propostaId={propostaId}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    loading={submitting}
                />

                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                        ⚠️ <strong>Atenção:</strong> Esta ação é irreversível. Certifique-se de revisar cuidadosamente antes de aprovar.
                    </p>
                </div>
            </div>
        </div>
    )
}
