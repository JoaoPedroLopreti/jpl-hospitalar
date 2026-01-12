
import { getCompanies } from '@/app/actions/maintenance/company-actions'
import NewEquipmentForm from './new-equipment-form'

export default async function NewEquipmentPage() {
    const response = await getCompanies()
    const companies = 'data' in response ? response.data || [] : []

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Registrar Equipamento</h1>
            <NewEquipmentForm companies={companies} />
        </div>
    )
}
