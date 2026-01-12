import { getCompanies } from '@/app/actions/maintenance/company-actions'
import Link from 'next/link'

export default async function CompaniesPage() {
    const response = await getCompanies()
    const companies = 'data' in response ? response.data || [] : []

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Empresas Gerenciadas</h1>
                <Link
                    href="/dashboard/technician/companies/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Nova Empresa
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {companies.length === 0 ? (
                        <li className="px-4 py-12 text-center text-gray-500">
                            Nenhuma empresa cadastrada.
                        </li>
                    ) : (
                        companies.map((company) => (
                            <li key={company.id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-blue-600 truncate">{company.trade_name}</p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Ativo
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {company.legal_name}
                                            </p>
                                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                CNPJ: {company.cnpj}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <Link href={`/dashboard/technician/companies/${company.id}`} className="text-blue-500 hover:text-blue-700">
                                                Gerenciar
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
