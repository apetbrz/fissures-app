import { useState, useEffect } from 'react'
import '../App.css'

function ControlBox({missions, toggle}){
    
    let toggleMission = (title) => {
      return () => {
        toggle(title)
      }
    }

    return (
      <>
        <div className="control-box">
          <button className="toggle-btn toggle-alchemy" onClick={toggleMission("alchemy")}>alchemy</button>
          <button className="toggle-btn toggle-capture" onClick={toggleMission("capture")}>capture</button>
          <button className="toggle-btn toggle-cascade" onClick={toggleMission("cascade")}>cascade</button>
          <button className="toggle-btn toggle-exterminate" onClick={toggleMission("exterminate")}>exterminate</button>
          <button className="toggle-btn toggle-disruption" onClick={toggleMission("disruption")}>disruption</button>
          <button className="toggle-btn toggle-flood" onClick={toggleMission("flood")}>flood</button>
          <button className="toggle-btn toggle-rescue" onClick={toggleMission("rescue")}>rescue</button>
          <button className="toggle-btn toggle-survival" onClick={toggleMission("survival")}>survival</button>
        </div>
        <div className="control-box">
          <button className="toggle-btn toggle-spalchemy" onClick={toggleMission("spalchemy")}>sp alchemy</button>
          <button className="toggle-btn toggle-spcapture" onClick={toggleMission("spcapture")}>sp capture</button>
          <button className="toggle-btn toggle-spcascade" onClick={toggleMission("spcascade")}>sp cascade</button>
          <button className="toggle-btn toggle-spexterminate" onClick={toggleMission("spexterminate")}>sp exterminate</button>
          <button className="toggle-btn toggle-spdisruption" onClick={toggleMission("spdisruption")}>sp disruption</button>
          <button className="toggle-btn toggle-spflood" onClick={toggleMission("spflood")}>sp flood</button>
          <button className="toggle-btn toggle-sprescue" onClick={toggleMission("sprescue")}>sp rescue</button>
          <button className="toggle-btn toggle-spsurvival" onClick={toggleMission("spsurvival")}>sp survival</button>
        </div>
      </>
    )
}

export default ControlBox
