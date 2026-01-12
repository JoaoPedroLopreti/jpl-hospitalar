'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AreasAtuacaoPage() {
    const areas = [
        {
            titulo: "Hospitais Públicos",
            descricao: "Fornecimento especializado para hospitais da rede pública, com experiência em processos licitatórios e conformidade com as exigências legais.",
            icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
            color: "blue"
        },
        {
            titulo: "Hospitais Privados",
            descricao: "Soluções personalizadas para hospitais e redes privadas, com foco em qualidade premium e entregas pontuais.",
            icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
            color: "green"
        },
        {
            titulo: "Clínicas Especializadas",
            descricao: "Atendimento dedicado a clínicas de especialidades médicas, oferecendo produtos específicos para cada área de atuação.",
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
            color: "purple"
        },
        {
            titulo: "Licitações Públicas",
            descricao: "Expertise consolidada em processos licitatórios, garantindo conformidade, agilidade e transparência em todas as etapas.",
            icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
            color: "orange"
        },
        {
            titulo: "Instituições de Saúde",
            descricao: "Parcerias com diversos tipos de instituições de saúde, incluindo laboratórios, centros de diagnóstico e unidades de pronto atendimento.",
            icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
            color: "indigo"
        }
    ]

    const colorClasses = {
        blue: {
            bg: "bg-blue-100",
            text: "text-blue-600",
            border: "border-blue-200"
        },
        green: {
            bg: "bg-green-100",
            text: "text-green-600",
            border: "border-green-200"
        },
        purple: {
            bg: "bg-purple-100",
            text: "text-purple-600",
            border: "border-purple-200"
        },
        orange: {
            bg: "bg-orange-100",
            text: "text-orange-600",
            border: "border-orange-200"
        },
        indigo: {
            bg: "bg-indigo-100",
            text: "text-indigo-600",
            border: "border-indigo-200"
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Áreas de Atuação
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        A JPL Hospitalar atende com excelência diversos segmentos do setor de saúde
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {areas.map((area, idx) => {
                        const colors = colorClasses[area.color as keyof typeof colorClasses]
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                className={`bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow border-t-4 ${colors.border}`}
                            >
                                <div className={`w-16 h-16 ${colors.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <svg className={`w-8 h-8 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={area.icon} />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">
                                    {area.titulo}
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {area.descricao}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Objetivo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-blue-600 text-white p-12 rounded-lg shadow-lg"
                >
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Foco Institucional
                        </h2>
                        <p className="text-xl leading-relaxed mb-6">
                            Nossa atuação é focada no fornecimento institucional, priorizando parcerias duradouras e o atendimento de excelência às necessidades específicas de cada segmento do setor de saúde.
                        </p>
                        <p className="text-lg text-blue-100">
                            Trabalhamos com compromisso, ética e transparência em todos os nossos relacionamentos comerciais.
                        </p>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-12 text-center"
                >
                    <p className="text-gray-600 mb-4 text-lg">
                        Sua instituição se encaixa em alguma dessas áreas?
                    </p>
                    <Link
                        href="/contato"
                        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all"
                    >
                        Entre em Contato
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}
