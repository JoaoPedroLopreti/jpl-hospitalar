/**
 * FRONTEND INTEGRATION EXAMPLE
 * How to use the AI processing endpoint from an authenticated client
 * NOW WITH PDF UPLOAD
 */

'use client'

import { useState } from 'react'

interface AIResult {
    summary: string
    compliance: boolean
    recommendations: string[]
}

export function AIProcessingExample() {
    const [processing, setProcessing] = useState(false)
    const [result, setResult] = useState<AIResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [editalText, setEditalText] = useState('')
    const [editalName, setEditalName] = useState('')
    const [file, setFile] = useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            setEditalName(selectedFile.name.replace(/\.[^/.]+$/, ''))

            // Read PDF as text (simplified - in production use proper PDF parser)
            const reader = new FileReader()
            reader.onload = (event) => {
                const text = event.target?.result as string
                // This is a simplified text extraction
                // For production, use a library like pdf-parse or pdfjs-dist
                setEditalText(text || 'Conteúdo do arquivo carregado...')
            }
            reader.readAsText(selectedFile)
        }
    }

    const handleProcess = async () => {
        if (!editalText || !editalName) {
            setError('Por favor, carregue um arquivo ou preencha os campos manualmente')
            return
        }

        setProcessing(true)
        setError(null)
        setResult(null)

        try {
            const response = await fetch('/api/ia/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    editalName,
                    editalText,
                    context: 'Teste do sistema de IA'
                }),
            })

            const data = await response.json()

            if (data.success) {
                setResult(data.data)
            } else {
                setError(data.error)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred')
        } finally {
            setProcessing(false)
        }
    }

    const loadExample = () => {
        setEditalName('Edital Teste - Equipamentos Médicos')
        setEditalText(`OBJETO: Aquisição de aparelhos de anestesia.

REQUISITOS TÉCNICOS:
- Voltagem: 220V bivolt automático
- Monitor digital de pressão e fluxo
- Vaporizadores para agentes anestésicos
- Sistema de ventilação mecânica integrado
- Alarmes audiovisuais
- Bateria backup mínimo 30 minutos

CERTIFICAÇÕES EXIGIDAS:
- Registro ANVISA vigente
- ISO 13485
- Certificado de calibração

CONDIÇÕES COMERCIAIS:
- Prazo de entrega: 60 dias
- Garantia: 24 meses mínimo
- Assistência técnica local comprovada
- Treinamento da equipe incluído

OBSERVAÇÕES:
- Instalação por conta do fornecedor
- Manual em português obrigatório
- Testes in loco antes da aceitação`)
        setFile(null)
    }

    return (
        <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Upload de Edital</h2>

                {/* File Upload */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fazer upload de arquivo (PDF ou TXT)
                    </label>
                    <input
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100
                            cursor-pointer"
                    />
                    {file && (
                        <p className="text-sm text-green-600 mt-2">
                            ✓ Arquivo carregado: {file.name}
                        </p>
                    )}
                </div>

                <div className="text-center my-4 text-gray-500">
                    <span className="px-4 bg-gray-50">ou</span>
                </div>

                {/* Manual Input */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome do Edital
                        </label>
                        <input
                            type="text"
                            value={editalName}
                            onChange={(e) => setEditalName(e.target.value)}
                            placeholder="Ex: Pregão 001/2025 - Equipamentos Médicos"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Conteúdo do Edital
                        </label>
                        <textarea
                            value={editalText}
                            onChange={(e) => setEditalText(e.target.value)}
                            placeholder="Cole o texto do edital aqui..."
                            rows={8}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleProcess}
                        disabled={processing || !editalText || !editalName}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {processing ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processando com IA...
                            </span>
                        ) : (
                            '🤖 Processar com IA'
                        )}
                    </button>

                    <button
                        onClick={loadExample}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Carregar Exemplo
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    <p className="font-semibold">Erro:</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Results Display */}
            {result && (
                <div className="bg-green-50 border border-green-200 rounded-md p-6">
                    <h3 className="font-bold text-green-900 text-lg mb-4">✓ Análise Concluída</h3>

                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold text-green-900 mb-1">📝 Resumo:</p>
                            <p className="text-sm text-gray-700 bg-white p-3 rounded">{result.summary}</p>
                        </div>

                        <div>
                            <p className="font-semibold text-green-900 mb-1">✓ Conformidade:</p>
                            <p className={`text-sm font-semibold ${result.compliance ? 'text-green-600' : 'text-red-600'}`}>
                                {result.compliance ? '✓ Requisitos claros e verificáveis' : '✗ Requisitos incompletos ou pouco claros'}
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text-green-900 mb-2">💡 Recomendações:</p>
                            <ul className="list-disc list-inside space-y-1 bg-white p-3 rounded">
                                {result.recommendations.map((rec: string, i: number) => (
                                    <li key={i} className="text-sm text-gray-700">{rec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
