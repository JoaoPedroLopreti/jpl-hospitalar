'use client'

import { motion } from 'framer-motion'

export default function AJplPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold text-gray-900 mb-8"
                >
                    A JPL Hospitalar
                </motion.h1>

                {/* Quem Somos */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white p-8 rounded-lg shadow-md mb-8 hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Quem Somos
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        A JPL Hospitalar é uma empresa especializada no fornecimento de produtos hospitalares de alta qualidade para instituições de saúde em todo o Brasil.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        Com anos de experiência no mercado, nos consolidamos como parceira confiável de hospitais públicos e privados, clínicas e instituições de saúde, oferecendo soluções completas e personalizadas.
                    </p>
                </motion.section>

                {/* Missão, Visão e Valores */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-8 rounded-lg shadow-md mb-8 hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Missão, Visão e Valores
                    </h2>

                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                        >
                            <h3 className="text-xl font-semibold text-blue-600 mb-2">Missão</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Fornecer produtos hospitalares de excelência, contribuindo para a melhoria da qualidade do atendimento em saúde e o bem-estar dos pacientes.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <h3 className="text-xl font-semibold text-blue-600 mb-2">Visão</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Ser reconhecida como referência nacional no fornecimento de produtos hospitalares, pela qualidade, confiabilidade e excelência no atendimento.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <h3 className="text-xl font-semibold text-blue-600 mb-2">Valores</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>Ética em todas as relações comerciais</li>
                                <li>Qualidade superior em nossos produtos e serviços</li>
                                <li>Conformidade com normas e regulamentações</li>
                                <li>Compromisso com a saúde e segurança</li>
                                <li>Responsabilidade social e ambiental</li>
                            </ul>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Compromissos */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-8 rounded-lg shadow-md mb-8 hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Nossos Compromissos
                    </h2>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-6"
                    >
                        <motion.div variants={itemVariants} className="text-center group">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Ética</h3>
                            <p className="text-gray-600 text-sm">
                                Transparência e integridade em todas as nossas ações
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="text-center group">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Qualidade</h3>
                            <p className="text-gray-600 text-sm">
                                Produtos certificados e de excelência
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="text-center group">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Conformidade</h3>
                            <p className="text-gray-600 text-sm">
                                Atendimento rigoroso às normas sanitárias
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* Atuação no Mercado */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Atuação no Mercado Hospitalar
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        A JPL Hospitalar atua de forma abrangente no mercado de produtos hospitalares, atendendo desde pequenas clínicas até grandes complexos hospitalares.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Como representante autorizada da marca KTK, oferecemos produtos com certificações internacionais e garantia de procedência.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        Nossa expertise em processos licitatórios nos permite atender com excelência instituições públicas, sempre em conformidade com a legislação vigente.
                    </p>
                </motion.section>
            </div>
        </div>
    )
}
