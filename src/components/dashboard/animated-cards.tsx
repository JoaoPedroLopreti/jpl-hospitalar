'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ReactNode } from 'react'

interface StatsCardProps {
    icon: ReactNode
    title: string
    value: string | number
    delay?: number
}

export function StatsCard({ icon, title, value, delay = 0 }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
            <div className="flex items-center">
                {icon}
                <div className="ml-4">
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </motion.div>
    )
}

interface ProposalCardProps {
    id: string
    title: string
    createdAt: string
    index: number
}

export function ProposalCard({ id, title, createdAt, index }: ProposalCardProps) {
    return (
        <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Criada em {new Date(createdAt).toLocaleDateString("pt-BR")}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

interface ActionCardProps {
    href: string
    label: string
    delay?: number
}

export function ActionCard({ href, label, delay = 0 }: ActionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
            className="bg-white p-6 rounded-lg shadow-md"
        >
            <Link
                href={href}
                className="block bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
                {label}
            </Link>
        </motion.div>
    )
}

interface EmptyStateProps {
    icon: ReactNode
    message: string
    actionLabel: string
    actionHref: string
}

export function EmptyState({ icon, message, actionLabel, actionHref }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
        >
            {icon}
            <p className="text-gray-600 mb-4">{message}</p>
            <Link
                href={actionHref}
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
                {actionLabel}
            </Link>
        </motion.div>
    )
}
