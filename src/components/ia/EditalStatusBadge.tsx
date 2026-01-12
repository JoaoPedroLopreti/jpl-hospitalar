'use client'

import type { EditalStatusBadgeProps } from '@/lib/ia/types'
import { getStatusLabel } from '@/lib/ia/utils'
import { STATUS_COLORS } from '@/lib/ia/types'

const COLOR_CLASSES = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    pink: 'bg-pink-100 text-pink-800 border-pink-200',
    cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
}

export function EditalStatusBadge({ status }: EditalStatusBadgeProps) {
    const label = getStatusLabel(status)
    const colorKey = STATUS_COLORS[status]
    const colorClass = COLOR_CLASSES[colorKey as keyof typeof COLOR_CLASSES] || COLOR_CLASSES.gray

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
            {label}
        </span>
    )
}
