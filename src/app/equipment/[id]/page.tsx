import { getEquipment } from '@/app/actions/maintenance/equipment-actions'
import { getMaintenanceHistory } from '@/app/actions/maintenance/record-actions'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function PublicEquipmentPage({ params }: { params: { id: string } }) {
    // Em Next.js 15+ params pode ser promise? O package.json diz next 16.1.1.
    // Sim, precisa await params.
    const resolvedParams = await params
    const id = resolvedParams.id

    const { data: equipment, error } = await getEquipment(id)
    if (error || !equipment) return notFound()

    const { data: history } = await getMaintenanceHistory(id)

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://jpl-hospitalar.vercel.app/equipment/${id}`)}`

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header Card */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Ficha Técnica do Equipamento
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                {equipment.name}
                            </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${equipment.status === 'OK' ? 'bg-green-100 text-green-800' :
                                equipment.status === 'MAINTENANCE_DUE' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {equipment.status === 'OK' ? 'OPERATIONAL' : equipment.status}
                        </div>
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
                                <dt className="text-sm font-medium text-gray-500">Localização</dt>
                                <dd className="mt-1 text-sm text-gray-900">{equipment.location || 'N/A'}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                                <dd className="mt-1 text-sm text-gray-900">{equipment.MaintenanceCompany?.trade_name}</dd>
                            </div>

                            <div className="sm:col-span-2 flex justify-center py-4">
                                <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 border p-2 rounded" />
                            </div>
                        </dl>
                    </div>
                </div>

                {/* History Section */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Histórico de Manutenções
                        </h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <ul className="divide-y divide-gray-200">
                            {!history || history.length === 0 ? (
                                <li className="px-4 py-4 text-center text-gray-500 text-sm">Nenhum registro encontrado.</li>
                            ) : (
                                history.map((record: any) => (
                                    <li key={record.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-blue-600 truncate">
                                                {new Date(record.maintenance_date).toLocaleDateString('pt-BR')}
                                            </p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className="text-xs text-gray-500">
                                                    Técnico: {record.User?.name || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-700">
                                            <p>{record.description}</p>
                                            {record.parts_replaced && (
                                                <p className="mt-1 text-xs text-gray-500">Peças: {record.parts_replaced}</p>
                                            )}
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

                <div className="text-center">
                    <Link href="/login" className="text-blue-600 hover:text-blue-800 text-sm">
                        Acesso Restrito ao Sistema
                    </Link>
                </div>
            </div>
        </div>
    )
}
