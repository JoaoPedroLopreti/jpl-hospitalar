import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function getAllManagedEquipment(filter?: string) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    let query = supabase
        .from('MedicalEquipment')
        .select(`
            id, name, brand, model, serial_number, status, 
            MaintenanceCompany!inner(id, trade_name)
        `)
        .eq('MaintenanceCompany.technician_id', user.id)
        .order('created_at', { ascending: false })

    if (filter === 'due') {
        query = query.eq('status', 'MAINTENANCE_DUE')
    } else if (filter === 'expired') {
        // Query OR logic is tricky with chained builders usually requires .or()
        // status.eq.EXPIRED,status.eq.MAINTENANCE_DUE
        query = query.or('status.eq.EXPIRED,status.eq.MAINTENANCE_DUE')
    } else if (filter === 'ok') {
        query = query.eq('status', 'OK')
    }

    const { data, error } = await query

    if (error) {
        console.error(error)
        return []
    }
    return data
}

export default async function EquipmentPage({ searchParams }: { searchParams: { filter?: string } }) {
    const resolvedParams = await searchParams
    const filter = resolvedParams?.filter

    const equipmentList = await getAllManagedEquipment(filter)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    {filter === 'due' ? 'Manutenção Pendente' :
                        filter === 'expired' ? 'Equipamentos Críticos' :
                            'Todos os Equipamentos'}
                </h1>
                <div className="flex gap-2">
                    {filter && (
                        <Link
                            href="/dashboard/technician/equipment"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Limpar Filtro
                        </Link>
                    )}
                    <Link
                        href="/dashboard/technician/equipment/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Registrar Equipamento
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {equipmentList.length === 0 ? (
                        <li className="px-4 py-12 text-center text-gray-500">
                            Nenhum equipamento encontrado com este filtro.
                        </li>
                    ) : (
                        equipmentList.map((item: any) => (
                            <li key={item.id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium text-blue-600 truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500">{item.brand} - {item.model}</p>
                                        </div>
                                        <div className="ml-2 flex-shrink-0 flex text-right gap-2">
                                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'OK' ? 'bg-green-100 text-green-800' :
                                                    item.status === 'MAINTENANCE_DUE' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {item.status}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                S/N: {item.serial_number}
                                            </p>
                                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                Empresa: {item.MaintenanceCompany?.trade_name}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 gap-3">
                                            <Link href={`/equipment/${item.id}`} className="text-blue-500 hover:text-blue-700 font-medium">
                                                QR Code
                                            </Link>
                                            <Link href={`/dashboard/technician/equipment/${item.id}`} className="text-gray-600 hover:text-gray-900">
                                                Detalhes
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    )
}
