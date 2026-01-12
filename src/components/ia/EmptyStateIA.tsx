'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function EmptyStateIA() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-4"
        >
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
                Nenhum edital processado ainda
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Faça upload do primeiro edital para começar a usar o assistente de propostas
            </p>
            <Link
                href="/dashboard/ia/novo-edital"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
                + Fazer Upload de Edital
            </Link>
        </motion.div>
    )
}
