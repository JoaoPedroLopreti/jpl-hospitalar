import { getEquipment } from '@/app/actions/maintenance/equipment-actions'
import { getMaintenanceHistory } from '@/app/actions/maintenance/record-actions'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CompanyEquipmentDetailsPage({ params }: { params: { id: string } }) {
    const resolvedParams = await params
    const id = resolvedParams.id

    // Buscar equipment e history
    const equipmentRes = await getEquipment(id)
    if (equipmentRes.error || !equipmentRes.data) return notFound()
    const equipment = equipmentRes.data

    const historyRes = await getMaintenanceHistory(id)
    const history = historyRes.data || []

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{equipment.name}</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Ficha Técnica</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Marca / Modelo</dt>
                            <dd className="mt-1 text-sm text-gray-900">{equipment.brand} / {equipment.model}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Número de Série</dt>
                            <dd className="mt-1 text-sm text-gray-900">{equipment.serial_number}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className={`mt-1 text-sm font-bold ${equipment.status === 'OK' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {equipment.status}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <Link href={`/equipment/${id}`} target="_blank" className="text-blue-600 hover:text-blue-800 text-sm">
                                Abrir Link Público (QR Code)
                            </Link>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Histórico de Manutenções</h3>
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
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Técnico: {record.User?.name}
                                    </div>
                                </div>
                                <p className="mt-1 text-sm text-gray-700">{record.description}</p>
                                {record.parts_replaced && <p className="mt-1 text-xs text-gray-500">Peças: {record.parts_replaced}</p>}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    )
}
