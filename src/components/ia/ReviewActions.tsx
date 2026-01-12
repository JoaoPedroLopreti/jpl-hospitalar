'use client'

import { useState } from 'react'
import type { ReviewActionsProps } from '@/lib/ia/types'

export function ReviewActions({ propostaId, onApprove, onReject, loading = false }: ReviewActionsProps) {
    const [comentarios, setComentarios] = useState('')
    const [showComments, setShowComments] = useState(false)

    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Ações de Revisão</h3>

            {showComments && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Comentários (opcional)
                    </label>
                    <textarea
                        value={comentarios}
                        onChange={(e) => setComentarios(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Adicione observações sobre sua decisão..."
                    />
                </div>
            )}

            <div className="flex gap-4">
                <button
                    onClick={onApprove}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                    ✓ Aprovar Proposta
                </button>
                <button
                    onClick={onReject}
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                >
                    ✗ Rejeitar Proposta
                </button>
            </div>

            {!showComments && (
                <button
                    onClick={() => setShowComments(true)}
                    className="w-full text-blue-600 text-sm hover:underline"
                >
                    + Adicionar comentários
                </button>
            )}
        </div>
    )
}
