import { useState, useEffect } from 'react'
import '../App.css'

function ControlBox({missions, toggle}){
    
    let toggleMission = (title) => {
      return () => {
        toggle(title)
      }
    }

    return (
      <div className="container">
        <div className="control-box">
          <button className="toggle-btn toggle-cascade" onClick={toggleMission("cascade")}>cascade</button>
          <button className="toggle-btn toggle-capture" onClick={toggleMission("capture")}>capture</button>
          <button className="toggle-btn toggle-exterminate" onClick={toggleMission("exterminate")}>exterminate</button>
          <button className="toggle-btn toggle-disruption" onClick={toggleMission("disruption")}>disruption</button>
          <button className="toggle-btn toggle-survival" onClick={toggleMission("survival")}>survival</button>
          <button className="toggle-btn toggle-rescue" onClick={toggleMission("rescue")}>rescue</button>
          <button className="toggle-btn toggle-spcascade" onClick={toggleMission("spcascade")}>spcascade</button>
          <button className="toggle-btn toggle-spcapture" onClick={toggleMission("spcapture")}>spcapture</button>
          <button className="toggle-btn toggle-spexterminate" onClick={toggleMission("spexterminate")}>spexterminate</button>
          <button className="toggle-btn toggle-spdisruption" onClick={toggleMission("spdisruption")}>spdisruption</button>
          <button className="toggle-btn toggle-spsurvival" onClick={toggleMission("spsurvival")}>spsurvival</button>
          <button className="toggle-btn toggle-sprescue" onClick={toggleMission("sprescue")}>sprescue</button>
        </div>
      </div>
    )
}

export default ControlBox
