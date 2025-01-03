import './App.css'
import Relics from "./components/Relics.jsx"
import Menu from "./components/Menu.jsx"

function App() {
    return (
        <>
        <Menu />
        <h1 className="bold">RelicLookup</h1>
        <Relics />
        </>
    )
}

export default App