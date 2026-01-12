import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: userData } = await supabase
        .from('User')
        .select('role, name')
        .eq('id', user.id)
        .single()

    if (userData?.role === 'TECHNICIAN') {
        redirect('/dashboard/technician')
    }

    if (userData?.role === 'COMPANY') {
        redirect('/dashboard/company')
    }

    if (userData?.role === 'ADMIN') {
        // Admin pode ver tudo, mas dashboard principal dele?
        // Manter dashboard padrão ou redirecionar para admin?
        // Manter padrão.
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <div className="py-6">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                    <p>Bem-vindo, {userData?.name}!</p>
                    <p className="mt-2 text-gray-600">
                        Nível de Acesso: <span className="font-mono font-bold">{userData?.role || 'N/A'}</span>
                    </p>

                    {userData?.role === 'TECHNICIAN' && (
                        <div className="mt-4">
                            <p className="text-red-600 text-sm mb-2">Se você está vendo esta tela, o redirecionamento automático falhou.</p>
                            <a href="/dashboard/technician" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                Acessar Painel do Técnico
                            </a>
                        </div>
                    )}

                    {userData?.role === 'COMPANY' && (
                        <div className="mt-4">
                            <a href="/dashboard/company" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                Acessar Painel da Empresa
                            </a>
                        </div>
                    )}

                    {!['TECHNICIAN', 'COMPANY'].includes(userData?.role) && (
                        <p className="mt-2 text-gray-600">Selecione uma opção no menu ou aguarde novas funcionalidades.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
