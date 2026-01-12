'use client'

import { getProdutosPorCategoria, getCategoriaBySlug } from '@/app/actions/produtos-actions'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AnimatedLine } from '@/components/produtos/animated-line'
import { useEffect, useState } from 'react'
import type { Produto } from '@/lib/types/produtos-types'

export default function CategoriaPage() {
    const params = useParams<{ categoria: string }>()
    const [categoriaNome, setCategoriaNome] = useState<string | null>(null)
    const [produtos, setProdutos] = useState<Produto[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            const nome = await getCategoriaBySlug(params.categoria)
            if (nome) {
                const prods = await getProdutosPorCategoria(nome)
                setProdutos(prods)
                setCategoriaNome(nome)
            }
            setLoading(false)
        }
        loadData()
    }, [params.categoria])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg text-gray-600">Carregando...</div>
            </div>
        )
    }

    if (!categoriaNome) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-gray-600">
                    <Link href="/" className="hover:text-blue-600">
                        Home
                    </Link>
                    {' > '}
                    <Link href="/produtos" className="hover:text-blue-600">
                        Produtos
                    </Link>
                    {' > '}
                    <span className="font-semibold text-gray-900">{categoriaNome}</span>
                </nav>

                {/* Header */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="mb-2 text-4xl font-bold text-gray-900">
                        {categoriaNome}
                    </h1>
                    <AnimatedLine width="w-20" height="h-1" />
                </motion.div>

                {/* Products List */}
                {produtos.length > 0 ? (
                    <div className="space-y-12">
                        {produtos.map((produto, index) => (
                            <motion.div
                                key={produto.id}
                                className="border-b border-gray-200 pb-12 last:border-b-0"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    {/* Image */}
                                    <div className="flex items-start justify-center">
                                        <div className="relative h-[280px] w-full max-w-sm overflow-hidden rounded-lg bg-gray-50 shadow-md">
                                            {produto.imagemUrl ? (
                                                <img
                                                    src={produto.imagemUrl}
                                                    alt={produto.nome}
                                                    className="h-full w-full object-contain p-4"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-6xl text-gray-300">
                                                    📦
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <h2 className="mb-2 text-3xl font-bold text-gray-900">
                                            {produto.nome}
                                        </h2>
                                        <AnimatedLine width="w-16" height="h-0.5" delay={index * 0.1 + 0.2} />

                                        {/* Specifications */}
                                        {produto.especificacoes && produto.especificacoes.length > 0 && (
                                            <ul className="mb-6 mt-6 space-y-2">
                                                {produto.especificacoes.map((spec, index) => (
                                                    <li key={index} className="text-gray-700">
                                                        - {spec}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        <p className="mb-6 text-sm text-gray-600">
                                            Consulte-nos para mais informações !!!
                                        </p>

                                        {/* Button */}
                                        <Link
                                            href={`/produtos/${params.categoria}/${produto.id}`}
                                            className="inline-block rounded bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-blue-700 hover:shadow-md"
                                        >
                                            Mais Detalhes
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
                        <p className="text-gray-600">
                            Nenhum produto encontrado nesta categoria.
                        </p>
                        <Link
                            href="/produtos"
                            className="mt-4 inline-block text-blue-600 hover:text-blue-700"
                        >
                            ← Voltar ao catálogo
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
