'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Produto } from '@/lib/types/produtos-types'

interface ProdutoDetalhesProps {
    produto: Produto
}

export function ProdutoDetalhes({ produto }: ProdutoDetalhesProps) {
    return (
        <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Left Column - Image */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="sticky top-8">
                        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl">
                            {produto.imagemUrl ? (
                                <Image
                                    src={produto.imagemUrl}
                                    alt={produto.nome}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <span className="text-9xl">📦</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Right Column - Details */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-6"
                >
                    {/* Header */}
                    <div>
                        <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
                            {produto.categoria}
                        </span>
                        <h1 className="mt-4 text-4xl font-bold text-gray-900">
                            {produto.nome}
                        </h1>
                        {produto.descricaoCurta && (
                            <p className="mt-3 text-lg text-gray-600">
                                {produto.descricaoCurta}
                            </p>
                        )}
                    </div>

                    {/* Specifications */}
                    {produto.especificacoes && produto.especificacoes.length > 0 && (
                        <div className="rounded-xl bg-white p-6 shadow-md">
                            <h2 className="mb-4 text-xl font-bold text-gray-900">
                                Especificações Técnicas
                            </h2>
                            <ul className="space-y-3">
                                {produto.especificacoes.map((spec, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg
                                            className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-green-500"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-gray-700">{spec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Application */}
                    {produto.aplicacao && (
                        <div className="rounded-xl bg-blue-50 p-6">
                            <h2 className="mb-3 text-xl font-bold text-gray-900">
                                Aplicações
                            </h2>
                            <p className="text-gray-700">{produto.aplicacao}</p>
                        </div>
                    )}

                    {/* Observations */}
                    {produto.observacoes && (
                        <div className="rounded-xl bg-purple-50 p-6">
                            <h2 className="mb-3 text-xl font-bold text-gray-900">
                                Observações
                            </h2>
                            <p className="text-gray-700">{produto.observacoes}</p>
                        </div>
                    )}

                    {/* PDF Download Button */}
                    {produto.pdfUrl && (
                        <div className="mt-8">
                            <a
                                href={produto.pdfUrl}
                                download
                                className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                            >
                                <svg
                                    className="mr-3 h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                Baixar Catálogo PDF
                            </a>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
