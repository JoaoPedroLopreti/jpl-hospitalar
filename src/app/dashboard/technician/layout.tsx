import Link from 'next/link'
import { ReactNode } from 'react'

export default function TechnicianLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Sidebar Premium */}
            <aside className="w-72 bg-slate-900 text-white hidden md:flex flex-col shadow-xl z-10">
                <div className="p-8 border-b border-slate-800">
                    <h2 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                        JPL Técnico
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Painel de Controle</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Gerenciamento</p>

                    <Link
                        href="/dashboard/technician"
                        className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-200 border-l-4 border-transparent hover:border-blue-500"
                    >
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Visão Geral
                    </Link>

                    <Link
                        href="/dashboard/technician/companies"
                        className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-200 border-l-4 border-transparent hover:border-blue-500"
                    >
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Minhas Empresas
                    </Link>

                    <Link
                        href="/dashboard/technician/equipment"
                        className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-200 border-l-4 border-transparent hover:border-blue-500"
                    >
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                        Equipamentos
                    </Link>

                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-2">Configurações</p>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-200 border-l-4 border-transparent hover:border-red-500">
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sair (Demo)
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="bg-slate-800 rounded-lg p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            TC
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Técnico Teste</p>
                            <p className="text-xs text-slate-400">Online</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-auto bg-gray-50/50">
                <div className="max-w-7xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
