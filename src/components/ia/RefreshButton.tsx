'use client'

/**
 * Botão de atualização da página (Client Component)
 */
export function RefreshButton() {
    return (
        <button
            onClick={() => window.location.reload()}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
        >
            🔄 Atualizar
        </button>
    )
}
