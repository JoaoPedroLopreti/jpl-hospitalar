import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminPropostasPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Verificar se é admin
    const { data: userData } = await supabase
        .from('User')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userData?.role !== 'ADMIN') redirect('/dashboard')

    // Buscar todas as propostas com dados do usuário
    const { data: proposals } = await supabase
        .from('Proposal')
        .select(`
      *,
      createdBy:User(name, email)
    `)
        .order('createdAt', { ascending: false })

    const propostas = proposals?.map(p => ({
        ...p,
        createdBy: Array.isArray(p.createdBy) ? p.createdBy[0] : p.createdBy
    }))

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Todas as Propostas
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Visualização completa de todas as propostas do sistema
                    </p>
                </div>

                {!propostas || propostas.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Nenhuma proposta encontrada
                        </h2>
                        <p className="text-gray-600">
                            Ainda não há propostas cadastradas no sistema
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {propostas.map((proposta) => (
                                <div
                                    key={proposta.id}
                                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-bold text-gray-900 flex-1">
                                            {proposta.title}
                                        </h3>
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                            Ativa
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm">
                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-gray-600">{proposta.createdBy?.name || 'Usuário'}</span>
                                        </div>

                                        <div className="flex items-center text-sm">
                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-gray-600 text-xs">{proposta.createdBy?.email || 'N/A'}</span>
                                        </div>

                                        <div className="flex items-center text-sm">
                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-gray-600">
                                                {new Date(proposta.createdAt).toLocaleDateString("pt-BR")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                                            Ver Detalhes →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h3 className="text-sm font-semibold text-blue-900 mb-1">
                                        Estatísticas
                                    </h3>
                                    <p className="text-sm text-blue-700">
                                        Total de {propostas.length} proposta(s) cadastrada(s) no sistema.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
