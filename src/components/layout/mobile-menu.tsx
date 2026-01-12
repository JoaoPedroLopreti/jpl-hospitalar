'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MobileMenuProps {
    user: any
    userData: any
}

export function MobileMenu({ user, userData }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const toggleMenu = () => setIsOpen(!isOpen)
    const closeMenu = () => setIsOpen(false)

    const menuItems = [
        { href: '/', label: 'Home' },
        { href: '/a-jpl', label: 'A JPL' },
        { href: '/produtos', label: 'Produtos' },
        { href: '/areas-atuacao', label: 'Áreas de Atuação' },
        { href: '/contato', label: 'Contato' },
    ]

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                aria-label="Toggle menu"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {isOpen ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    )}
                </svg>
            </button>

            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        onClick={closeMenu}
                    />
                )}
            </AnimatePresence>

            {/* Slide-in Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <span className="text-xl font-bold text-blue-600">Menu</span>
                            <button
                                onClick={closeMenu}
                                className="p-2 text-gray-700 hover:text-blue-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* User Info */}
                        {user && userData && (
                            <div className="p-6 bg-gray-50 border-b">
                                <p className="text-sm text-gray-600 mb-1">Olá,</p>
                                <p className="font-semibold text-gray-900">{userData.name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {userData.role === 'ADMIN' ? 'Administrador' : 'Funcionário'}
                                </p>
                            </div>
                        )}

                        {/* Navigation Links */}
                        <nav className="p-6">
                            <div className="space-y-2">
                                {menuItems.map((item, index) => (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={closeMenu}
                                            className={`block py-3 px-4 rounded-lg transition-colors ${pathname === item.href
                                                    ? 'bg-blue-50 text-blue-600 font-semibold'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Auth Buttons */}
                            <div className="mt-6 pt-6 border-t space-y-3">
                                {user && userData ? (
                                    <>
                                        {userData.role === 'ADMIN' && (
                                            <Link
                                                href="/admin"
                                                onClick={closeMenu}
                                                className="block w-full text-center bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                                            >
                                                Admin
                                            </Link>
                                        )}
                                        <Link
                                            href="/dashboard"
                                            onClick={closeMenu}
                                            className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/propostas"
                                            onClick={closeMenu}
                                            className="block w-full text-center bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                                        >
                                            Propostas
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={closeMenu}
                                        className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        Área do Funcionário
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
