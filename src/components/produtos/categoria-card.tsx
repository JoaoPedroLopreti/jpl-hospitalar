'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { CategoriaInfo } from '@/lib/types/produtos-types'

interface CategoriaCardProps {
    categoria: CategoriaInfo
    index: number
}

const categoryIcons: Record<string, string> = {
    'Aparelhos de Anestesia': '💉',
    'Ventilador Pulmonar': '🫁',
    'Aspiradores Cirúrgicos': '🔬',
    'Linha Veterinária': '🐾',
}

const categoryGradients: Record<string, string> = {
    'Aparelhos de Anestesia': 'from-blue-500 to-blue-700',
    'Ventilador Pulmonar': 'from-cyan-500 to-cyan-700',
    'Aspiradores Cirúrgicos': 'from-purple-500 to-purple-700',
    'Linha Veterinária': 'from-green-500 to-green-700',
}

export function CategoriaCard({ categoria, index }: CategoriaCardProps) {
    const gradient = categoryGradients[categoria.nome] || 'from-blue-500 to-blue-700'
    const icon = categoryIcons[categoria.nome] || '📦'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
        >
            <Link href={`/produtos/${categoria.slug}`}>
                <div
                    className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradient} p-8 text-white shadow-lg transition-shadow hover:shadow-2xl`}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-grid-white/10" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="mb-4 text-6xl">{icon}</div>
                        <h3 className="mb-2 text-2xl font-bold">{categoria.nome}</h3>
                        <p className="text-white/90">
                            {categoria.count} {categoria.count === 1 ? 'produto' : 'produtos'}
                        </p>

                        <div className="mt-6 flex items-center text-sm font-semibold">
                            <span>Ver produtos</span>
                            <svg
                                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
