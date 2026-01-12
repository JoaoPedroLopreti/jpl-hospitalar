'use client'

import { motion } from 'framer-motion'

interface AnimatedLineProps {
    className?: string
    width?: string
    height?: string
    delay?: number
}

export function AnimatedLine({
    className = 'bg-blue-600',
    width = 'w-20',
    height = 'h-1',
    delay = 0,
}: AnimatedLineProps) {
    return (
        <motion.div
            className={`${height} ${width} ${className} origin-left`}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.43, 0.13, 0.23, 0.96],
            }}
        />
    )
}
