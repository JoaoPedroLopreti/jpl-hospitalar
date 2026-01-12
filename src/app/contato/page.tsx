"use client"

import { useState } from "react"
import { motion } from 'framer-motion'

export default function ContatoPage() {
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        telefone: "",
        instituicao: "",
        mensagem: ""
    })
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("sending")

        // Simular envio (aqui você poderia integrar com um serviço de email)
        setTimeout(() => {
            setStatus("success")
            setFormData({
                nome: "",
                email: "",
                telefone: "",
                instituicao: "",
                mensagem: ""
            })
            setTimeout(() => setStatus("idle"), 3000)
        }, 1000)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Entre em Contato
                    </h1>
                    <p className="text-xl text-gray-600">
                        Estamos prontos para atender sua instituição
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Informações de Contato */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Informações de Contato
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">E-mail</h3>
                                    <p className="text-gray-600">contato@jplhospitalar.com.br</p>
                                    <p className="text-gray-600">vendas@jplhospitalar.com.br</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Telefone</h3>
                                    <p className="text-gray-600">(11) 1234-5678</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                                    <p className="text-gray-600">(11) 98765-4321</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="font-semibold text-blue-900 mb-2">
                                Horário de Atendimento
                            </h3>
                            <p className="text-blue-700 text-sm">
                                Segunda a Sexta: 8h às 18h
                            </p>
                            <p className="text-blue-700 text-sm">
                                Sábado: 8h às 12h
                            </p>
                        </div>
                    </motion.div>

                    {/* Formulário */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Envie sua Mensagem
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    required
                                    value={formData.nome}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    E-mail *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    id="telefone"
                                    name="telefone"
                                    value={formData.telefone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="instituicao" className="block text-sm font-medium text-gray-700 mb-1">
                                    Instituição
                                </label>
                                <input
                                    type="text"
                                    id="instituicao"
                                    name="instituicao"
                                    value={formData.instituicao}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mensagem *
                                </label>
                                <textarea
                                    id="mensagem"
                                    name="mensagem"
                                    required
                                    rows={5}
                                    value={formData.mensagem}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {status === "success" && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                                    Mensagem enviada com sucesso! Entraremos em contato em breve.
                                </div>
                            )}

                            {status === "error" && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    Erro ao enviar mensagem. Tente novamente.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                {status === "sending" ? "Enviando..." : "Enviar Mensagem"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}
