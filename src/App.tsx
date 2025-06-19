import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Hello from "./components/Hello"
import Home from "./pages/Home"
import { Ripple } from "./components/Ripple"
import { ThemeProvider } from "./contexts/ThemeContext"
import { Navigation } from "./components/Navigation"
import ProductsGrid from "./pages/ProductGrid"
import Parallax from "./pages/Parallax"
import StrickingObjects from "./pages/StrickingObjects"
import { useState } from "react"
import LoadingScreen from "./components/LoadingScreen"
function App() {
    const [isLoading, setIsLoading] = useState(true);
    return (
        <ThemeProvider>
            {isLoading && (
                <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
            )}
            {!isLoading && (
                <Router>
                    <div className="App">
                        <Navigation />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<ProductsGrid />} />
                            <Route path="/striking-objects" element={<StrickingObjects />} />
                            <Route path="parallax" element={<Parallax />} />
                        </Routes>
                    </div>
                </Router>
            )}
        </ThemeProvider>)
}

export default App
