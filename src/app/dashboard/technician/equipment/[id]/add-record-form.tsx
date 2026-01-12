'use client'

import { addMaintenanceRecord } from '@/app/actions/maintenance/record-actions'
import { useActionState } from 'react'

export default function AddMaintenanceForm({ equipmentId }: { equipmentId: string }) {
    const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
        const description = formData.get('description') as string
        const partsReplaced = formData.get('partsReplaced') as string
        const nextDateStr = formData.get('nextDate') as string

        const nextMaintenanceDate = nextDateStr ? new Date(nextDateStr) : undefined

        const result = await addMaintenanceRecord({
            equipmentId,
            description,
            partsReplaced,
            nextMaintenanceDate
        })

        if (result.error) return { error: result.error, success: false }
        return { error: '', success: true }
    }, { error: '', success: false })

    return (
        <form action={formAction} className="space-y-4">
            {state.success && <p className="text-green-600 text-sm">Registro adicionado com sucesso!</p>}
            {state.error && <p className="text-red-600 text-sm">{state.error}</p>}

            <div>
                <label className="block text-sm font-medium text-gray-700">Descrição do Serviço</label>
                <textarea name="description" required rows={3} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Peças Substituídas</label>
                    <input type="text" name="partsReplaced" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Próxima Manutenção</label>
                    <input type="date" name="nextDate" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                </div>
            </div>

            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Salvar Registro
            </button>
        </form>
    )
}
