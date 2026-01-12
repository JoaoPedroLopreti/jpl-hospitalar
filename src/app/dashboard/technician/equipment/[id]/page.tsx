import { getEquipment } from '@/app/actions/maintenance/equipment-actions'
import { getMaintenanceHistory } from '@/app/actions/maintenance/record-actions'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AddMaintenanceForm from './add-record-form'

export default async function EquipmentDetailsPage({ params }: { params: { id: string } }) {
    const resolvedParams = await params
    const id = resolvedParams.id

    // Buscar equipment e history
    const equipmentRes = await getEquipment(id)
    if (equipmentRes.error || !equipmentRes.data) return notFound()
    const equipment = equipmentRes.data

    const historyRes = await getMaintenanceHistory(id)
    const history = historyRes.data || []

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Detalhes do Equipamento</h1>

            {/* Info Card */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{equipment.name}</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">S/N: {equipment.serial_number}</p>
                    </div>
                    <div>
                        <Link href={`/equipment/${id}`} target="_blank" className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200">
                            Ver Página Pública (QR)
                        </Link>
                    </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Marca / Modelo</dt>
                            <dd className="mt-1 text-sm text-gray-900">{equipment.brand} / {equipment.model}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className={`mt-1 text-sm font-bold ${equipment.status === 'OK' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {equipment.status}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Empresa</dt>
                            <dd className="mt-1 text-sm text-gray-900">{equipment.MaintenanceCompany?.trade_name}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Localização</dt>
                            <dd className="mt-1 text-sm text-gray-900">{equipment.location || '-'}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Add Record Form */}
            <div className="bg-white shadow sm:rounded-lg p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Registrar Nova Manutenção</h3>
                <AddMaintenanceForm equipmentId={id} />
            </div>

            {/* History List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Histórico</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                    {history.length === 0 ? (
                        <li className="px-4 py-4 text-center text-gray-500">Nenhum registro.</li>
                    ) : (
                        history.map((record: any) => (
                            <li key={record.id} className="px-4 py-4 sm:px-6">
                                <div className="flex justify-between">
                                    <div className="text-sm font-medium text-gray-900">
                                        {new Date(record.maintenance_date).toLocaleDateString('pt-BR')}
                                        <span className="text-gray-500 font-normal"> - Técnico: {record.User?.name}</span>
                                    </div>
                                </div>
                                <p className="mt-1 text-sm text-gray-700">{record.description}</p>
                                {record.parts_replaced && <p className="mt-1 text-xs text-gray-500">Peças: {record.parts_replaced}</p>}
                                {record.next_maintenance_date && (
                                    <p className="mt-1 text-xs text-blue-600">
                                        Próxima manu: {new Date(record.next_maintenance_date).toLocaleDateString('pt-BR')}
                                    </p>
                                )}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    )
}
