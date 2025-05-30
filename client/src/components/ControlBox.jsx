import { useState, useEffect } from 'react'
import '../App.css'

function ControlBox({missions, toggle}){
    
    let toggleMission = (title) => {
      return () => {
        toggle(title)
      }
    }

    //TODO: MAKE THIS A LOOP, LIKE RELICS DISPLAY

    return (
      <>
        <div className="control-box">
          <button className={`toggle-btn toggle-alchemy ${missions.alchemy? "enabled":"disabled"}`} onClick={toggleMission("alchemy")}>alchemy</button>
          <button className={`toggle-btn toggle-capture ${missions.capture? "enabled":"disabled"}`} onClick={toggleMission("capture")}>capture</button>
          <button className={`toggle-btn toggle-cascade ${missions.cascade? "enabled":"disabled"}`} onClick={toggleMission("cascade")}>cascade</button>
          <button className={`toggle-btn toggle-excavation ${missions.excavation? "enabled":"disabled"}`} onClick={toggleMission("excavation")}>excavation</button>
          <button className={`toggle-btn toggle-exterminate ${missions.exterminate? "enabled":"disabled"}`} onClick={toggleMission("exterminate")}>exterminate</button>
          <button className={`toggle-btn toggle-disruption ${missions.disruption? "enabled":"disabled"}`} onClick={toggleMission("disruption")}>disruption</button>
          <button className={`toggle-btn toggle-flood ${missions.flood? "enabled":"disabled"}`} onClick={toggleMission("flood")}>flood</button>
          <button className={`toggle-btn toggle-rescue ${missions.rescue? "enabled":"disabled"}`} onClick={toggleMission("rescue")}>rescue</button>
          <button className={`toggle-btn toggle-survival ${missions.survival? "enabled":"disabled"}`} onClick={toggleMission("survival")}>survival</button>
        </div>
        <div className="control-box">
          <button className={`toggle-btn toggle-spalchemy ${missions.spalchemy? "enabled":"disabled"}`} onClick={toggleMission("spalchemy")}>sp alchemy</button>
          <button className={`toggle-btn toggle-spcapture ${missions.spcapture? "enabled":"disabled"}`} onClick={toggleMission("spcapture")}>sp capture</button>
          <button className={`toggle-btn toggle-spcascade ${missions.spcascade? "enabled":"disabled"}`} onClick={toggleMission("spcascade")}>sp cascade</button>
          <button className={`toggle-btn toggle-spexcavation ${missions.spexcavation? "enabled":"disabled"}`} onClick={toggleMission("spexcavation")}>sp excavation</button>
          <button className={`toggle-btn toggle-spexterminate ${missions.spexterminate? "enabled":"disabled"}`} onClick={toggleMission("spexterminate")}>sp exterminate</button>
          <button className={`toggle-btn toggle-spdisruption ${missions.spdisruption? "enabled":"disabled"}`} onClick={toggleMission("spdisruption")}>sp disruption</button>
          <button className={`toggle-btn toggle-spflood ${missions.spflood? "enabled":"disabled"}`} onClick={toggleMission("spflood")}>sp flood</button>
          <button className={`toggle-btn toggle-sprescue ${missions.sprescue? "enabled":"disabled"}`} onClick={toggleMission("sprescue")}>sp rescue</button>
          <button className={`toggle-btn toggle-spsurvival ${missions.spsurvival? "enabled":"disabled"}`} onClick={toggleMission("spsurvival")}>sp survival</button>
        </div>
      </>
    )
}

export default ControlBox
