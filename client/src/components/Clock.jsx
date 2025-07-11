import { useState, useEffect } from 'react'
import '../App.css'

function Clock() {

    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    //begin 1 second timer, for keeping local time correct
    //TODO: PLEASE MOVE TO CHILD
    useEffect(() => {
        setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
    }, []);

    return (
        <div className="clock">
            <p id="time">Current Time: {currentTime}</p>
        </div>
    )
}

export default Clock
