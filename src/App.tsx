import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Hello from "./components/Hello"
import Home from "./pages/Home"
import { Ripple } from "./components/Ripple"
import { ThemeProvider } from "./contexts/ThemeContext"
import { Navigation } from "./components/Navigation"
import { StrikingObjects } from "./pages/StrikingObjects"
import ProductsGrid from "./pages/ProductGrid"
function App() {

    return (
        <ThemeProvider>
            <Router>
                <div className="App">
                    <Navigation />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/testimonials" element={<ProductsGrid />} />
                        <Route path="/striking-objects" element={<StrikingObjects />} />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>)
}

export default App
