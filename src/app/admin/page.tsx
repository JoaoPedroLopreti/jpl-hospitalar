import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminPage() {
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

    // Estatísticas gerais
    const { count: totalUsers } = await supabase
        .from('User')
        .select('*', { count: 'exact', head: true })

    const { count: totalProposals } = await supabase
        .from('Proposal')
        .select('*', { count: 'exact', head: true })

    // Propostas desta semana
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const { count: proposalsThisWeek } = await supabase
        .from('Proposal')
        .select('*', { count: 'exact', head: true })
        .gte('createdAt', oneWeekAgo.toISOString())

    // Top 5 usuários por propostas
    const { data: allUsers } = await supabase
        .from('User')
        .select('id, name, email')

    const usersWithCounts = await Promise.all(
        (allUsers || []).map(async (u) => {
            const { count } = await supabase
                .from('Proposal')
                .select('*', { count: 'exact', head: true })
                .eq('userId', u.id)

            return { ...u, proposalCount: count || 0 }
        })
    )

    const topUsers = usersWithCounts
        .sort((a, b) => b.proposalCount - a.proposalCount)
        .slice(0, 5)

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Painel Administrativo
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Visão geral do sistema JPL Hospitalar
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total de Usuários</p>
                                <p className="text-3xl font-bold text-gray-900">{totalUsers || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        </div>
                        <Link
                            href="/admin/usuarios"
                            className="text-blue-600 hover:text-blue-700 text-sm font-semibold mt-3 inline-block"
                        >
                            Ver todos →
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total de Propostas</p>
                                <p className="text-3xl font-bold text-gray-900">{totalProposals || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <Link
                            href="/admin/propostas"
                            className="text-green-600 hover:text-green-700 text-sm font-semibold mt-3 inline-block"
                        >
                            Ver todas →
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Propostas (7 dias)</p>
                                <p className="text-3xl font-bold text-gray-900">{proposalsThisWeek || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Users */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Top 5 - Propostas por Funcionário
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Funcionário
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        E-mail
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                                        Total de Propostas
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {topUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-900">{user.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                                        <td className="py-3 px-4 text-sm text-center">
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                                                {user.proposalCount}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <Link
                        href="/admin/usuarios"
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Gerenciar Usuários</h3>
                                <p className="text-sm text-gray-600">Ver todos os funcionários do sistema</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/admin/propostas"
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Todas as Propostas</h3>
                                <p className="text-sm text-gray-600">Visualizar propostas de todos os funcionários</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/teste-ia"
                        className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div className="text-white">
                                <h3 className="font-bold">Testar Sistema de IA</h3>
                                <p className="text-sm text-purple-100">Claude Sonnet - Processamento automático</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
