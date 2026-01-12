import { getTechnicianStats } from '@/app/actions/maintenance/dashboard-actions'
import Link from 'next/link'

export default async function TechnicianDashboard() {
    const stats = await getTechnicianStats()
    const data = 'error' in stats ? { companies: 0, equipment: 0, maintenanceDue: 0, overdue: 0 } : stats

    return (

        <div className="space-y-10">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Visão Geral</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Bem-vindo de volta! Aqui está o resumo das suas operações hoje, {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/technician/companies/new"
                        className="inline-flex items-center px-5 py-2.5 rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all hover:shadow-md active:scale-95"
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Nova Empresa
                    </Link>
                    <Link
                        href="/dashboard/technician/equipment/new"
                        className="inline-flex items-center px-5 py-2.5 rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all hover:shadow-md active:scale-95"
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Novo Equipamento
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {/* Card Empresas */}
                <div className="relative group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <svg className="h-24 w-24 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 bg-blue-50 rounded-xl p-3 text-blue-600">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Empresas</p>
                            <h3 className="text-3xl font-bold text-gray-900">{data.companies}</h3>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link href="/dashboard/technician/companies" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            Gerenciar clientes <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </div>

                {/* Card Equipamentos */}
                <div className="relative group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <svg className="h-24 w-24 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7 2a1 1 0 00-.707.293l-1 1A1 1 0 005 4v12a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-.293-.707l-1-1A1 1 0 0013 2H7zm4 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 bg-emerald-50 rounded-xl p-3 text-emerald-600">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Equipamentos</p>
                            <h3 className="text-3xl font-bold text-gray-900">{data.equipment}</h3>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link href="/dashboard/technician/equipment" className="text-sm font-medium text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
                            Ver inventário <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </div>

                {/* Card Manutenção Pendente */}
                <div className="relative group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 bg-amber-50 rounded-xl p-3 text-amber-600">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pendentes</p>
                            <h3 className="text-3xl font-bold text-gray-900">{data.maintenanceDue}</h3>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link href="/dashboard/technician/equipment?filter=due" className="text-sm font-medium text-amber-600 hover:text-amber-800 flex items-center gap-1">
                            Ver detalhes <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </div>

                {/* Card Vencidos (Priority) */}
                <div className="relative group bg-gradient-to-br from-red-50 to-white p-6 rounded-2xl shadow-sm border border-red-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 bg-red-100 rounded-xl p-3 text-red-600 animate-pulse">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-red-600 uppercase tracking-wider">Críticos</p>
                            <h3 className="text-3xl font-bold text-red-700">{data.overdue}</h3>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link href="/dashboard/technician/equipment?filter=expired" className="text-sm font-medium text-red-700 hover:text-red-900 flex items-center gap-1">
                            Ação imediata <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Activity Placeholder (Visual only) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 opacity-80">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Atividade Recente (Exemplo)</h3>
                <div className="space-y-4">
                    <div className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mr-3">TC</div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Manutenção realizada em "Monitor Cardíaco XYZ"</p>
                            <p className="text-xs text-gray-500">Há 2 horas • Santa Casa de Misericórdia</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs mr-3">EQ</div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Novo equipamento registrado "Raio-X Portátil"</p>
                            <p className="text-xs text-gray-500">Ontem às 14:30 • Hospital São Lucas</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
