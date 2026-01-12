import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function getMyEquipment() {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Busca empresa vinculada ao user
    const { data: company } = await supabase
        .from('MaintenanceCompany')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!company) return []

    const { data: equipment } = await supabase
        .from('MedicalEquipment')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false })

    return equipment || []
}

export default async function CompanyEquipmentPage() {
    const equipment = await getMyEquipment()

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Meus Equipamentos</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {equipment.length === 0 ? (
                        <li className="px-4 py-12 text-center text-gray-500">
                            Nenhum equipamento registrado.
                        </li>
                    ) : (
                        equipment.map((item: any) => (
                            <li key={item.id}>
                                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium text-blue-600 truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500">{item.brand} - {item.model}</p>
                                        </div>
                                        <div className="ml-2 flex-shrink-0 flex items-center gap-2">
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
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <Link href={`/dashboard/company/equipment/${item.id}`} className="text-blue-500 hover:text-blue-700">
                                                Ver Detalhes &rarr;
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
