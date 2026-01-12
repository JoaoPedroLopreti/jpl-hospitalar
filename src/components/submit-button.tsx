'use client'

import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
    children: React.ReactNode
    className?: string
}

export default function SubmitButton({ children, className }: SubmitButtonProps) {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className={className || "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"}
        >
            {pending ? 'Processando...' : children}
        </button>
    )
}
