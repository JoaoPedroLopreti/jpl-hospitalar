"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function CreateProposalButton({ userId }: { userId: string }) {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [title, setTitle] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleCreate = async () => {
        if (!title.trim()) {
            setError("Digite um título para a proposta")
            return
        }

        setLoading(true)
        setError("")

        const supabase = createClient()

        const { error: insertError } = await supabase
            .from('Proposal')
            .insert({
                title: title.trim(),
                userId,
            })

        if (insertError) {
            setError("Erro ao criar proposta: " + insertError.message)
            setLoading(false)
        } else {
            setShowModal(false)
            setTitle("")
            router.refresh()
        }

        setLoading(false)
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
                + Nova Proposta
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Nova Proposta
                        </h2>

                        <div className="mb-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Título da Proposta
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ex: Proposta Hospital Santa Maria"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowModal(false)
                                    setTitle("")
                                    setError("")
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                            >
                                {loading ? "Criando..." : "Criar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
