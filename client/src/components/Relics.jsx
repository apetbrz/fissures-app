import { useState, useEffect, useCallback } from 'react'
import '../App.css'
import MissionType from './MissionType.jsx'
import ControlBox from './ControlBox.jsx'
import Clock from './Clock.jsx'

let hostUrl;
if(import.meta.env.DEV) hostUrl = "http://localhost:3000"
else hostUrl = "https://relics.apetbrz.dev"

function Relics() {
  //the parsed fissure data from the cache server
  const [data, setData] = useState({});
  //timestamp of cache update
  const [timestamp, setTimestamp] = useState(0);
  //solnodes API data, for translating mission id to mission info
  const [solnodes, setSolnodes] = useState();
  //current local time  TODO: MOVE TO CHILD TO AVOID FULL PAGE RERENDER EVERY SECOND
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  //??
  const [updateFlag, forceUpdate] = useState(false);
  //local user settings
  const [enabledMissions, setEnabledMissions] = useState({});

  //this fetches worldstate data from cache server
  const fetchAPI = async() => {
    const res = await fetch(hostUrl+"/worldstate").then((res) => res.json());
    setTimestamp(res.timestamp);
    setData(res.wfdata);
    setSolnodes(res.solnodes);
  }

  //fetch api
  useEffect(() => {
    fetchAPI();
    setInterval(() => {
      fetchAPI();
    }, 60 * 1000);
  }, []);

  useEffect(() => {
    
    if(!data?.normal) return;
    let missns = {
      normal: {},
      steelpath: {},
    }

    let cookie = JSON.parse(localStorage.getItem("enabledMissions"))

                <Clock />
    Object.keys(data.normal).map((missionName) => { missns.normal[missionName] = true })
    Object.keys(data.steelpath).map((missionName) => { missns.steelpath[missionName] = true })

    if(cookie?.normal && Object.keys(cookie?.normal) == Object.keys(missns.normal)){
      setEnabledMissions(cookie)
    }
    else{
      setEnabledMissions(missns);
    }
  }, [data]);

            <Clock />
  const toggleMission = (title, steelpath=false) => {
    let mis = {...enabledMissions}
    let mode = steelpath? "steelpath" : "normal"
    mis[mode][title] = !mis[mode][title]
    setEnabledMissions(mis)
    saveSettings()
  }

  const saveSettings = () => {
    localStorage.setItem("enabledMissions", JSON.stringify(enabledMissions))
  }

  if(data.normal && data.steelpath && enabledMissions.normal){
    let normalMissions = Object.keys(data.normal).map((missionName) => {
      if(enabledMissions.normal[missionName]) return <MissionType title={missionName} missions={data.normal[missionName]} key={missionName} />
      else return <MissionType key={missionName} />
    })
    let spMissions = Object.keys(data.steelpath).map((missionName) => {
      if(enabledMissions.steelpath[missionName]) return <MissionType title={"sp " + missionName} missions={data.steelpath[missionName]} key={"sp"+missionName} />
      else return <MissionType key={"sp"+missionName} />
    })

    return (
      <>
        <p id="refresh">Last Worldstate Update: { new Date(timestamp).toLocaleTimeString() }</p>
        <ControlBox missions={ enabledMissions } toggle={toggleMission}/>
        <div className="relics">
          {normalMissions}
        </div>
        <div className="relics">
          {spMissions}
        </div>
      </>
    )
  }

  else return (
    <>
      <p className="time">Loading...</p>
    </>
  )
}

export default Relics
