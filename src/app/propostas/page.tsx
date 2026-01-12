import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CreateProposalButton } from "@/components/proposals/create-proposal-button"

export default async function PropostasPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Buscar dados do usuário
    const { data: userData } = await supabase
        .from('User')
        .select('*')
        .eq('id', user.id)
        .single()

    // Buscar propostas do usuário (RLS aplica filtro automaticamente)
    const { data: propostas } = await supabase
        .from('Proposal')
        .select('*')
        .eq('userId', user.id)
        .order('createdAt', { ascending: false })

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Minhas Propostas</h1>
                        <p className="text-gray-600 mt-1">
                            Gerencie suas propostas comerciais
                        </p>
                    </div>
                    <CreateProposalButton userId={user.id} />
                </div>

                {!propostas || propostas.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Nenhuma proposta encontrada
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Comece criando sua primeira proposta comercial
                        </p>
                        <CreateProposalButton userId={user.id} />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {propostas.map((proposta) => (
                            <div
                                key={proposta.id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 flex-1">
                                        {proposta.title}
                                    </h3>
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                        Ativa
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Criada em {new Date(proposta.createdAt).toLocaleDateString("pt-BR")}
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t flex gap-2">
                                    <button className="flex-1 text-sm text-blue-600 hover:text-blue-700 font-semibold">
                                        Ver Detalhes
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
