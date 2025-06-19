"use client"

import type React from "react"
import { useCallback, useState } from "react"

interface RippleEffect {
    x: number
    y: number
    id: number
}

export function useRipple() {
    const [ripples, setRipples] = useState<RippleEffect[]>([])

    const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
        const element = event.currentTarget
        const rect = element.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const id = Date.now()

        setRipples((prev) => [...prev, { x, y, id }])

        setTimeout(() => {
            setRipples((prev) => prev.filter((ripple) => ripple.id !== id))
        }, 1000)
    }, [])

    return { ripples, createRipple }
}


