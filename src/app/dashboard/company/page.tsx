import { getCompanyStats } from '@/app/actions/maintenance/dashboard-actions'
import Link from 'next/link'

export default async function CompanyDashboard() {
    const stats = await getCompanyStats()
    const data = 'error' in stats ? { totalEquipment: 0, maintenanceDue: 0, operational: 0, overdue: 0 } : stats

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Meu Painel de Controle</h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total */}
                <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Equipamentos</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{data.totalEquipment}</dd>
                </div>

                {/* Ok */}
                <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                    <dt className="text-sm font-medium text-gray-500 truncate">Operacionais</dt>
                    <dd className="mt-1 text-3xl font-semibold text-green-600">{data.operational}</dd>
                </div>

                {/* Pendente */}
                <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                    <dt className="text-sm font-medium text-gray-500 truncate">Manutenção Pendente</dt>
                    <dd className="mt-1 text-3xl font-semibold text-red-600">{data.maintenanceDue}</dd>
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Meus Equipamentos
                    </h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>Visualize a lista completa dos seus equipamentos e histórico de manutenções.</p>
                    </div>
                    <div className="mt-5">
                        <Link href="/dashboard/company/equipment" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Ver Equipamentos
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
