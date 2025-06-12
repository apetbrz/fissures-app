import './App.css'
import Relics from "./components/Relics.jsx"
import Clock from "./components/Clock.jsx"

function App() {
    return (
        <>
            <h1 className="bold">RelicLookup</h1>
            <Clock />
            <Relics />
        </>
    )
}

export default App
