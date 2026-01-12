'use client'

import { motion } from 'framer-motion'
import type { TimelineProcessamentoProps } from '@/lib/ia/types'
import { formatRelativeTime } from '@/lib/ia/utils'

export function TimelineProcessamento({ logs }: TimelineProcessamentoProps) {
    if (!logs || logs.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                Nenhum log de processamento disponível
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {logs.map((log, index) => (
                <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4"
                >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    </div>
                    <div className="flex-1 pb-4 border-b border-gray-200 last:border-0">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-semibold text-gray-900">{log.etapa}</p>
                                <p className="text-sm text-gray-600 mt-1">{log.mensagem}</p>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                                {formatRelativeTime(log.createdAt)}
                            </span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
