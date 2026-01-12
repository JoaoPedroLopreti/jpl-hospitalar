import { createClient } from '@/lib/supabase/server'
import Link from "next/link"
import { SignOutButton } from "./sign-out-button"
import { MobileMenu } from "./mobile-menu"

export async function Header() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userData = null
    if (user) {
        const { data } = await supabase
            .from('User')
            .select('*')
            .eq('id', user.id)
            .single()
        userData = data
    }

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-bold text-blue-600">JPL Hospitalar</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Home
                        </Link>
                        <Link href="/a-jpl" className="text-gray-700 hover:text-blue-600 transition-colors">
                            A JPL
                        </Link>
                        <Link href="/produtos" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Produtos
                        </Link>
                        <Link href="/areas-atuacao" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Áreas de Atuação
                        </Link>
                        <Link href="/contato" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Contato
                        </Link>
                    </nav>

                    {/* Desktop Auth Section */}
                    <div className="hidden md:flex items-center">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">
                                    Olá, {userData?.name || 'Usuário'}
                                </span>
                                {userData?.role === "ADMIN" && (
                                    <Link
                                        href="/admin"
                                        className="text-sm bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <Link
                                    href="/dashboard"
                                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <SignOutButton />
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Área do Funcionário
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <MobileMenu user={user} userData={userData} />
                </div>
            </div>
        </header>
    )
}
