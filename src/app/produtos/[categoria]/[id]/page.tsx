'use client'

import { getProdutoById } from '@/app/actions/produtos-actions'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AnimatedLine } from '@/components/produtos/animated-line'
import { useEffect, useState } from 'react'
import type { Produto } from '@/lib/types/produtos-types'

export default function ProdutoDetalhePage() {
    const params = useParams<{ categoria: string; id: string }>()
    const [produto, setProduto] = useState<Produto | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadProduto() {
            const data = await getProdutoById(params.id)
            setProduto(data)
            setLoading(false)
        }
        loadProduto()
    }, [params.id])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg text-gray-600">Carregando...</div>
            </div>
        )
    }

    if (!produto) {
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
                    <Link
                        href={`/produtos/${params.categoria}`}
                        className="hover:text-blue-600"
                    >
                        {produto.categoria}
                    </Link>
                </nav>

                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="mb-2 text-4xl font-bold text-gray-900">
                        {produto.nome}
                    </h1>
                    <AnimatedLine width="w-20" height="h-1" />
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
                    {/* Left Column - Image & Thumbnails */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-start justify-center"
                    >
                        <div className="relative h-[400px] w-full max-w-md overflow-hidden rounded-lg bg-gray-50 shadow-md">
                            {produto.imagemUrl ? (
                                <img
                                    src={produto.imagemUrl}
                                    alt={produto.nome}
                                    className="h-full w-full object-contain p-4"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-8xl text-gray-300">
                                    📦
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Column - Information */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Informações Section */}
                        <div className="mb-8">
                            <h2 className="mb-4 text-2xl font-bold text-gray-900">
                                Informações
                            </h2>
                            <AnimatedLine width="w-16" height="h-0.5" delay={0.3} />

                            {/* Specifications List */}
                            {produto.especificacoes && produto.especificacoes.length > 0 && (
                                <ul className="mb-6 mt-6 space-y-2">
                                    {produto.especificacoes.map((spec, index) => (
                                        <motion.li
                                            key={index}
                                            className="text-gray-700"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + index * 0.05 }}
                                        >
                                            - {spec}
                                        </motion.li>
                                    ))}
                                </ul>
                            )}

                            {/* Application */}
                            {produto.aplicacao && (
                                <div className="mb-6">
                                    <p className="text-gray-700">{produto.aplicacao}</p>
                                </div>
                            )}

                            {/* Observations */}
                            {produto.observacoes && (
                                <div className="mb-6">
                                    <p className="text-sm italic text-gray-600">
                                        {produto.observacoes}
                                    </p>
                                </div>
                            )}

                            <p className="mb-6 text-sm text-gray-600">
                                Consulte-nos para mais informações !!!
                            </p>

                            {/* PDF Download */}
                            {produto.pdfUrl && (
                                <motion.div
                                    className="mb-8"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <a
                                        href={produto.pdfUrl}
                                        download
                                        className="inline-flex items-center rounded bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition-all hover:scale-105 hover:bg-gray-300 hover:shadow-md"
                                    >
                                        <svg
                                            className="mr-2 h-5 w-5 text-blue-600"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Catálogo {produto.nome}.pdf
                                    </a>
                                </motion.div>
                            )}
                        </div>

                        {/* Contact Form Section */}
                        <motion.div
                            className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h3 className="mb-4 text-xl font-bold text-gray-900">
                                Solicitar Produto
                            </h3>
                            <AnimatedLine width="w-16" height="h-0.5" delay={0.7} />

                            <form className="mt-4 space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Nome"
                                        className="w-full rounded border border-gray-300 px-4 py-2 focus:border-blue-600 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="E-mail"
                                        className="w-full rounded border border-gray-300 px-4 py-2 focus:border-blue-600 focus:outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="tel"
                                        placeholder="Telefone"
                                        className="rounded border border-gray-300 px-4 py-2 focus:border-blue-600 focus:outline-none"
                                    />
                                    <select className="rounded border border-gray-300 px-4 py-2 focus:border-blue-600 focus:outline-none">
                                        <option>Como nos Conheceu?</option>
                                        <option>Indicação</option>
                                        <option>Internet</option>
                                        <option>Outros</option>
                                    </select>
                                </div>
                                <div>
                                    <textarea
                                        placeholder="Informações Extras"
                                        rows={4}
                                        className="w-full rounded border border-gray-300 px-4 py-2 focus:border-blue-600 focus:outline-none"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full rounded bg-gray-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
                                >
                                    ENVIAR
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Back Link */}
                <div className="mt-12">
                    <Link
                        href={`/produtos/${params.categoria}`}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        ← Voltar para {produto.categoria}
                    </Link>
                </div>
            </div>
        </div>
    )
}
