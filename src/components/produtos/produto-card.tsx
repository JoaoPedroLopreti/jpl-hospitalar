'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Produto } from '@/lib/types/produtos-types'

interface ProdutoCardProps {
    produto: Produto
    categoriaSlug: string
    index: number
}

export function ProdutoCard({ produto, categoriaSlug, index }: ProdutoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="group"
        >
            <div className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-xl">
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {produto.imagemUrl ? (
                        <Image
                            src={produto.imagemUrl}
                            alt={produto.nome}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-6xl">
                            📦
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                        {produto.nome}
                    </h3>

                    {produto.descricaoCurta && (
                        <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                            {produto.descricaoCurta}
                        </p>
                    )}

                    {/* Specs Preview */}
                    {produto.especificacoes && produto.especificacoes.length > 0 && (
                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                                {produto.especificacoes.slice(0, 2).map((spec, idx) => (
                                    <span
                                        key={idx}
                                        className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
                                    >
                                        ✓ {spec.substring(0, 30)}
                                        {spec.length > 30 ? '...' : ''}
                                    </span>
                                ))}
                                {produto.especificacoes.length > 2 && (
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                                        +{produto.especificacoes.length - 2} mais
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    <Link
                        href={`/produtos/${categoriaSlug}/${produto.id}`}
                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Ver Detalhes
                        <svg
                            className="ml-2 h-4 w-4"
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
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
