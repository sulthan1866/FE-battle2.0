import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import { ThemeProvider } from "./contexts/ThemeContext"
import { Navigation } from "./components/Navigation"
import ProductsGrid from "./pages/ProductGrid"
import Parallax from "./pages/Parallax"
import { useState } from "react"
import LoadingScreen from "./components/LoadingScreen"
import Objects from "./pages/Objects"
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
                            <Route path="parallax" element={<Parallax />} />
                            <Route path="/objects" element={<Objects />} />
                        </Routes>
                    </div>
                </Router>
            )}
        </ThemeProvider>)
}

export default App
