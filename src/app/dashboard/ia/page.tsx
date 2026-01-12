import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { EditalStatusBadge } from '@/components/ia/EditalStatusBadge'
import { EmptyStateIA } from '@/components/ia/EmptyStateIA'

/**
 * Dashboard IA - Lista de editais processados
 */
export default async function IADashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Buscar editais do usuário usando Supabase Client
    const { data: editaisData } = await supabase
        .from('Edital')
        .select('*, proposta:PropostaGerada(*), logs:LogProcessamento(*)')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

    const editais = editaisData || []

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Assistente de Propostas IA</h1>
                        <p className="text-gray-600 mt-1">
                            Análise automatizada de editais e geração de propostas
                        </p>
                    </div>
                    <Link
                        href="/dashboard/ia/novo-edital"
                        className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                    >
                        + Novo Edital
                    </Link>
                </div>

                {/* Lista de Editais */}
                {editais.length === 0 ? (
                    <EmptyStateIA />
                ) : (
                    <div className="grid gap-6">
                        {editais.map((edital: any) => (
                            <Link
                                key={edital.id}
                                href={`/dashboard/ia/edital/${edital.id}`}
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {edital.nome}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span>📅 {new Date(edital.created_at).toLocaleDateString('pt-BR')}</span>
                                            {edital.logs?.[0] && (
                                                <span>💬 {edital.logs[0].mensagem}</span>
                                            )}
                                        </div>
                                    </div>
                                    <EditalStatusBadge status={edital.status} />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
