import { Suspense } from "react";
import './App.css'
import Relics from "./components/Relics.jsx"
import Clock from "./components/Clock.jsx"
import Loading from "./components/Loading.jsx"

function App() {
    return (
        <>
            <h1 className="bold">RelicLookup</h1>
            <Clock />
            <Suspense fallback={<Loading />}>
                <Relics />
            </Suspense>
        </>
    )
}

export default App
