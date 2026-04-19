"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface SectionWrapperProps {
    children: ReactNode
    className?: string
    id?: string
    delay?: number
}

export function SectionWrapper({ children, className, id, delay = 0 }: SectionWrapperProps) {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.7,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98]
            }}
            className={className}
        >
            {children}
        </motion.section>
    )
}
