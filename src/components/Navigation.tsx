"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Ripple } from "./Ripple"
import { Button } from "./ui/Button"



const Menu = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
)

const X = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
)

export function Navigation() {
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)

    const navigation = [
        { name: "Home", href: "/" },
        { name: "Products", href: "/products" },
        { name: "Parallax", href: "parallax" },
        { name: "Objects", href: "objects" }
    ]

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Ripple>
                            <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                                Site
                            </Link>
                        </Ripple>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Ripple key={item.name}>
                                <Link
                                    to={item.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.href
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            </Ripple>
                        ))}


                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">

                        <Ripple>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                                {isOpen ? <X /> : <Menu />}
                            </Button>
                        </Ripple>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                        {navigation.map((item) => (
                            <Ripple key={item.name}>
                                <Link
                                    to={item.href}
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${location.pathname === item.href
                                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            </Ripple>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}

