import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminUsuariosPage() {
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

    // Buscar todos os usuários
    const { data: usuarios } = await supabase
        .from('User')
        .select('*')
        .order('createdAt', { ascending: false })

    // Buscar contagem de propostas para cada usuário
    const usuariosComPropostas = await Promise.all(
        (usuarios || []).map(async (u) => {
            const { count } = await supabase
                .from('Proposal')
                .select('*', { count: 'exact', head: true })
                .eq('userId', u.id)

            return { ...u, proposalCount: count || 0 }
        })
    )

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Gerenciar Usuários
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Lista completa de todos os funcionários do sistema
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                                        Nome
                                    </th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                                        E-mail
                                    </th>
                                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">
                                        Cargo
                                    </th>
                                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">
                                        Propostas
                                    </th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                                        Data de Criação
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosComPropostas.map((usuario) => (
                                    <tr key={usuario.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                                            {usuario.name}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {usuario.email}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${usuario.role === "ADMIN"
                                                        ? "bg-purple-100 text-purple-800"
                                                        : "bg-blue-100 text-blue-800"
                                                    }`}
                                            >
                                                {usuario.role === "ADMIN" ? "Administrador" : "Funcionário"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                                                {usuario.proposalCount}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {new Date(usuario.createdAt).toLocaleDateString("pt-BR")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {(!usuarios || usuarios.length === 0) && (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Nenhum usuário encontrado</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-semibold text-blue-900 mb-1">
                                Informação
                            </h3>
                            <p className="text-sm text-blue-700">
                                Total de {usuariosComPropostas.length} usuário(s) cadastrado(s) no sistema.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
