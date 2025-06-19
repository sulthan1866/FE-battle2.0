"use client"

import type React from "react"

import { useState } from "react"
import { Ripple } from "./Ripple"
import { Button } from "./ui/Button"

const objects = [
    { id: 1, name: "Sphere", shape: "rounded-full", color: "bg-red-500", size: "w-20 h-20" },
    { id: 2, name: "Square", shape: "rounded-lg", color: "bg-blue-500", size: "w-20 h-20" },
    { id: 3, name: "Rectangle", shape: "rounded-md", color: "bg-green-500", size: "w-24 h-16" },
    { id: 4, name: "Diamond", shape: "rotate-45", color: "bg-yellow-500", size: "w-16 h-16" },
    { id: 5, name: "Oval", shape: "rounded-full", color: "bg-purple-500", size: "w-28 h-16" },
]

export function StrikingObjectsCSS() {
    const [struckObjects, setStruckObjects] = useState<Set<number>>(new Set())

    const strikeObject = (id: number) => {
        setStruckObjects((prev) => new Set([...prev, id]))

        // Remove from struck objects after animation
        setTimeout(() => {
            setStruckObjects((prev) => {
                const newSet = new Set(prev)
                newSet.delete(id)
                return newSet
            })
        }, 2000)
    }

    return (
        <div className="w-full">
            {/* CSS Animation Styles */}
            <style jsx>{`
        @keyframes strike-impact {
          0% { transform: scale(1) translateY(0) rotate(0deg); }
          10% { transform: scale(1.2, 0.8) translateY(10px) rotate(0deg); }
          30% { transform: scale(0.9, 1.1) translateY(-50px) rotate(180deg); }
          60% { transform: scale(1.1, 0.9) translateY(-20px) rotate(270deg); }
          80% { transform: scale(0.95, 1.05) translateY(-5px) rotate(350deg); }
          100% { transform: scale(1) translateY(0) rotate(360deg); }
        }

        @keyframes particle-burst {
          0% { 
            opacity: 1; 
            transform: scale(0) translate(0, 0); 
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1) translate(var(--dx), var(--dy)); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0.5) translate(calc(var(--dx) * 2), calc(var(--dy) * 2)); 
          }
        }

        .strike-animation {
          animation: strike-impact 2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #ff6b6b, #ff4757);
          border-radius: 50%;
          pointer-events: none;
          animation: particle-burst 1s ease-out forwards;
        }
      `}</style>

            {/* Interactive Area */}
            <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden shadow-inner">
                {/* Ground Line */}
                <div className="absolute bottom-16 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-600"></div>

                {/* Objects */}
                {objects.map((object, index) => (
                    <div
                        key={object.id}
                        className={`absolute ${object.color} ${object.size} ${object.shape} cursor-pointer transition-all duration-300 hover:scale-110 ${struckObjects.has(object.id) ? "strike-animation" : ""
                            }`}
                        style={{
                            left: `${15 + index * 15}%`,
                            bottom: "64px",
                            transformOrigin: "center bottom",
                        }}
                        onClick={() => strikeObject(object.id)}
                    >
                        {/* Impact particles */}
                        {struckObjects.has(object.id) && (
                            <>
                                {[...Array(12)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="particle"
                                        style={
                                            {
                                                "--dx": `${(Math.random() - 0.5) * 100}px`,
                                                "--dy": `${-Math.random() * 80}px`,
                                                animationDelay: `${i * 0.05}s`,
                                                left: "50%",
                                                top: "50%",
                                            } as React.CSSProperties
                                        }
                                    />
                                ))}
                            </>
                        )}

                        {/* Object label */}
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                            {object.name}
                        </div>
                    </div>
                ))}

                {/* Strike indicator */}
                <div className="absolute top-4 left-4 text-sm text-gray-600 dark:text-gray-300">
                    Click any object to strike it!
                </div>
            </div>

            {/* Control Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
                {objects.map((object) => (
                    <Ripple key={object.id}>
                        <Button
                            onClick={() => strikeObject(object.id)}
                            disabled={struckObjects.has(object.id)}
                            variant="outline"
                            className="text-sm"
                        >
                            Strike {object.name}
                        </Button>
                    </Ripple>
                ))}

                <Ripple>
                    <Button
                        onClick={() => {
                            objects.forEach((obj, index) => {
                                setTimeout(() => strikeObject(obj.id), index * 300)
                            })
                        }}
                        className="text-sm"
                    >
                        Strike All
                    </Button>
                </Ripple>
            </div>
        </div>
    )
}

