"use client"

import type React from "react"
import { useRipple } from "../hooks/useRipple"

interface RippleProps {
    children: React.ReactNode
    className?: string
}

export function Ripple({ children, className = "" }: RippleProps) {
    const { ripples, createRipple } = useRipple()

    return (
        <div className={`relative overflow-hidden ${className}`} onClick={createRipple}>
            {children}
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="absolute pointer-events-none animate-ping"
                    style={{
                        left: ripple.x - 10,
                        top: ripple.y - 10,
                        width: 20,
                        height: 20,
                    }}
                >
                    <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 dark:bg-blue-300"></span>
                </span>
            ))}
        </div>
    )
}


