import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sobre */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">JPL Hospitalar</h3>
                        <p className="text-gray-400 text-sm">
                            Especializada em fornecimento de produtos hospitalares para
                            instituições de saúde públicas e privadas.
                        </p>
                    </div>

                    {/* Links Rápidos */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/a-jpl" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Sobre Nós
                                </Link>
                            </li>
                            <li>
                                <Link href="/produtos" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Nossos Produtos
                                </Link>
                            </li>
                            <li>
                                <Link href="/areas-atuacao" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Áreas de Atuação
                                </Link>
                            </li>
                            <li>
                                <Link href="/contato" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Contato
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contato */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Contato</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>Email: contato@jplhospitalar.com.br</li>
                            <li>Telefone: (11) 1234-5678</li>
                            <li>WhatsApp: (11) 98765-4321</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} JPL Hospitalar. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
