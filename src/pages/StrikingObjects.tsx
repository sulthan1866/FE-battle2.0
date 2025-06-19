"use client"

import { Ripple } from "../components/Ripple"
import { StrikingObjects3D } from "../components/StrikingObjects3D"

export function StrikingObjects() {
    return (
        <main className="pt-16">
            {/* Hero Section */}
            <section className="py-24 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Ripple>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Striking Objects</h1>
                    </Ripple>
                    <Ripple>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
                            Experience realistic physics as simple objects react to strikes with deformation, bouncing, and particle
                            effects.
                        </p>
                    </Ripple>
                </div>
            </section>

            {/* 3D Interactive Section */}
            <section className="py-24 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Ripple>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Interactive 3D Physics
                            </h2>
                        </Ripple>
                        <Ripple>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                Click to strike objects and watch them react with realistic physics and stunning visual effects.
                            </p>
                        </Ripple>
                    </div>

                    <StrikingObjects3D />
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: "Realistic Physics",
                                description: "Objects deform on impact and bounce with accurate physics simulation.",
                                icon: "⚡",
                            },
                            {
                                title: "Particle Effects",
                                description: "Stunning particle systems create impact effects on every strike.",
                                icon: "✨",
                            },
                            {
                                title: "3D Rendering",
                                description: "High-quality Three.js rendering with shadows and lighting.",
                                icon: "🎯",
                            },
                            {
                                title: "Interactive Control",
                                description: "Full control over which objects to strike and when.",
                                icon: "🎮",
                            },
                        ].map((feature, index) => (
                            <Ripple key={index} className="group">
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                                </div>
                            </Ripple>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

