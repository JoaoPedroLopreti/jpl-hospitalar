'use client'

export function LoadingProcessamento() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative">
                {/* Spinner animado */}
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                {/* Ícone central */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-6">
                Processando edital...
            </h3>
            <p className="text-sm text-gray-600 mt-2 max-w-md text-center">
                Isso pode levar alguns momentos. Estamos analisando o documento e preparando a proposta.
            </p>
            <div className="mt-8 flex gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        </div>
    )
}
