'use client'

import { getCategorias } from '@/app/actions/produtos-actions'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AnimatedLine } from '@/components/produtos/animated-line'
import { useEffect, useState } from 'react'

interface CategoriaInfo {
    nome: string
    slug: string
    count: number
}

export default function ProdutosPage() {
    const [categorias, setCategorias] = useState<CategoriaInfo[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadCategorias() {
            const data = await getCategorias()
            setCategorias(data)
            setLoading(false)
        }
        loadCategorias()
    }, [])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg text-gray-600">Carregando...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="mb-2 text-4xl font-bold text-gray-900">
                        Catálogo de Produtos
                    </h1>
                    <AnimatedLine width="w-20" height="h-1" />
                    <p className="mt-4 text-lg text-gray-600">
                        Linha completa de produtos médicos hospitalares JPL / KTK
                    </p>
                </motion.div>

                {/* Categories List */}
                {categorias.length > 0 ? (
                    <div className="space-y-4">
                        {categorias.map((categoria, index) => (
                            <motion.div
                                key={categoria.slug}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <Link
                                    href={`/produtos/${categoria.slug}`}
                                    className="block border-b border-gray-200 pb-4 transition-all hover:border-blue-600 hover:translate-x-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {categoria.nome}
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {categoria.count}{' '}
                                                {categoria.count === 1 ? 'produto' : 'produtos'}
                                            </p>
                                        </div>
                                        <svg
                                            className="h-6 w-6 text-blue-600 transition-transform group-hover:translate-x-1"
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
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
                        <p className="text-gray-600">
                            Nosso catálogo de produtos está sendo atualizado.
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            Se você já inseriu os produtos no banco, tente recarregar a página (Ctrl+Shift+R)
                        </p>
                    </div>
                )}

                {/* CTA Section */}
                <div className="mt-16 border-t border-gray-200 pt-8">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900">
                        Não encontrou o que procura?
                    </h2>
                    <p className="mb-6 text-gray-600">
                        Entre em contato conosco para soluções personalizadas e orçamentos
                    </p>
                    <Link
                        href="/contato"
                        className="inline-block rounded bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Fale Conosco
                    </Link>
                </div>
            </div>
        </div>
    )
}
