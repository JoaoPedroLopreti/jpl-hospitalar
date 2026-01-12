'use client'

import { registerEquipment } from '@/app/actions/maintenance/equipment-actions'
import { useActionState } from 'react'

export default function NewEquipmentForm({ companies }: { companies: any[] }) {
    const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
        const companyId = formData.get('companyId') as string
        const name = formData.get('name') as string
        const brand = formData.get('brand') as string
        const model = formData.get('model') as string
        const serialNumber = formData.get('serialNumber') as string
        const location = formData.get('location') as string

        const result = await registerEquipment({
            companyId,
            name,
            brand,
            model,
            serialNumber,
            location
        })

        if (result.error) {
            return { error: result.error, success: false }
        }

        return { error: '', success: true }
    }, { error: '', success: false })

    return (
        <form action={formAction} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            {state.error && (
                <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-800">{state.error}</p>
                </div>
            )}

            {state.success && (
                <div className="rounded-md bg-green-50 p-4 mb-4">
                    <p className="text-green-800">Equipamento registrado com sucesso!</p>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">Empresa Cliente</label>
                <select name="companyId" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                    <option value="">Selecione uma empresa...</option>
                    {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.trade_name} ({c.cnpj})</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Nome do Equipamento</label>
                    <input type="text" name="name" required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" placeholder="Ex: Monitor Multiparamétrico" />
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Marca</label>
                    <input type="text" name="brand" required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Modelo</label>
                    <input type="text" name="model" required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Número de Série</label>
                    <input type="text" name="serialNumber" required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Localização (Setor/Sala)</label>
                    <input type="text" name="location" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                </div>
            </div>

            <div className="flex justify-end">
                <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Registrar
                </button>
            </div>
        </form>
    )
}
