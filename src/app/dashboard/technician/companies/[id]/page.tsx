import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getCompanyDetails(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('MaintenanceCompany')
        .select('*')
        .eq('id', id)
        .single()
    return { data, error }
}

async function getCompanyEquipment(companyId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('MedicalEquipment')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
    return data || []
}

export default async function CompanyDetailsPage({ params }: { params: { id: string } }) {
    const resolvedParams = await params
    const id = resolvedParams.id

    const { data: company, error } = await getCompanyDetails(id)
    if (error || !company) return notFound()

    const equipment = await getCompanyEquipment(id)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">{company.trade_name}</h1>
                <Link
                    href={`/dashboard/technician/equipment/new?companyId=${id}`} // Passar companyId na URL para pré-selecionar?
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                    Adicionar Equipamento
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Dados da Empresa</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{company.legal_name}</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">CNPJ</dt>
                            <dd className="mt-1 text-sm text-gray-900">{company.cnpj}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                            <dd className="mt-1 text-sm text-gray-900">{company.phone}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Email de Contato / Login</dt>
                            <dd className="mt-1 text-sm text-gray-900">{company.email}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <h2 className="text-lg font-bold text-gray-900 pt-4">Equipamentos Vinculados</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {equipment.length === 0 ? (
                        <li className="px-4 py-8 text-center text-gray-500">Nenhum equipamento cadastrado.</li>
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
                                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {item.status}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-right">
                                        <Link href={`/dashboard/technician/equipment/${item.id}`} className="text-sm text-blue-500 hover:text-blue-700">
                                            Detalhes e Manutenção &rarr;
                                        </Link>
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
