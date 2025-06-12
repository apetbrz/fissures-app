import { useState, useEffect } from 'react'
import '../App.css'

function ControlBox({ missions, toggle }) {

    let toggleMission = (title, steelpath) => {
        return () => {
            toggle(title, steelpath)
        }
    }

    let normalButtons = Object.keys(missions.normal).map((missionName) => {
        return <button className={`toggle-btn toggle-${missionName} ${missions.normal[missionName] ? "enabled" : "disabled"}`}
            onClick={toggleMission(missionName)}
            key={missionName}
        >{missionName}</button>
    })
    let steelpathButtons = Object.keys(missions.steelpath).map((missionName) => {
        return <button className={`toggle-btn toggle-${"sp" + missionName} ${missions.steelpath[missionName] ? "enabled" : "disabled"}`}
            onClick={toggleMission(missionName, true)}
            key={"sp" + missionName}
        >{"sp " + missionName}</button>
    })
    return (
        <>
            <div className="control-box">
                {normalButtons}
            </div>
            <div className="control-box">
                {steelpathButtons}
            </div>
        </>
    )
}

export default ControlBox
