'use client'

import type { PropostaPreviewProps } from '@/lib/ia/types'
import { EditalStatusBadge } from './EditalStatusBadge'
import { getPropostaStatusLabel } from '@/lib/ia/utils'
import { PROPOSTA_STATUS_COLORS } from '@/lib/ia/types'

export function PropostaPreview({ proposta }: PropostaPreviewProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-gray-900">Proposta Gerada</h3>
                <EditalStatusBadge status={proposta.status as any} />
            </div>

            {/* Proposta Técnica */}
            {proposta.conteudoTecnico && (
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📋 Proposta Técnica</h4>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {proposta.conteudoTecnico}
                        </p>
                    </div>
                </div>
            )}

            {/* Proposta Comercial */}
            {proposta.conteudoComercial && (
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">💰 Proposta Comercial</h4>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {proposta.conteudoComercial}
                        </p>
                    </div>
                </div>
            )}

            {!proposta.conteudoTecnico && !proposta.conteudoComercial && (
                <p className="text-gray-500 text-center py-4">
                    Proposta ainda não foi gerada
                </p>
            )}
        </div>
    )
}
