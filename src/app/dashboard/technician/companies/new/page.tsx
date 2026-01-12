'use client'

import { createCompany } from '@/app/actions/maintenance/company-actions'
import { useActionState } from 'react' // React 19 hook
import SubmitButton from '@/components/submit-button' // Need to create or use existing? 
// I'll assume i need to create a simple button or inline it.

const initialState = {
    error: '',
    success: false
}

export default function NewCompanyPage() {
    const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
        const legalName = formData.get('legalName') as string
        const tradeName = formData.get('tradeName') as string
        const cnpj = formData.get('cnpj') as string
        const email = formData.get('email') as string
        const phone = formData.get('phone') as string

        const result = await createCompany({
            legalName,
            tradeName,
            cnpj,
            email,
            phone
        })

        if (result.error) {
            return { error: result.error, success: false }
        }

        return { error: '', success: true }
    }, initialState)

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Nova Empresa</h1>

            <form action={formAction} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                {state.error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Erro ao criar empresa</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{state.error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {state.success && (
                    <div className="rounded-md bg-green-50 p-4 mb-4">
                        <p className="text-green-800">Empresa criada com sucesso!</p>
                    </div>
                )}

                <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-6">
                        <label htmlFor="legalName" className="block text-sm font-medium text-gray-700">Razão Social</label>
                        <input type="text" name="legalName" id="legalName" required className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                    </div>

                    <div className="col-span-6 sm:col-span-6">
                        <label htmlFor="tradeName" className="block text-sm font-medium text-gray-700">Nome Fantasia</label>
                        <input type="text" name="tradeName" id="tradeName" required className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ</label>
                        <input type="text" name="cnpj" id="cnpj" required className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
                        <input type="text" name="phone" id="phone" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                    </div>

                    <div className="col-span-6 sm:col-span-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Login)</label>
                        <input type="email" name="email" id="email" required className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                        <p className="mt-1 text-xs text-gray-500">Uma senha provisória será gerada automaticamente.</p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Criar Empresa
                    </button>
                </div>
            </form>
        </div>
    )
}
