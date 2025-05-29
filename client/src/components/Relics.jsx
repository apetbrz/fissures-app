import { useState, useEffect, useCallback } from 'react'
import '../App.css'
import MissionType from './MissionType.jsx'
import ControlBox from './ControlBox.jsx'
import Clock from './Clock.jsx'

const hostUrl = "https://relics.apetbrz.dev"

function Relics() {
    //the parsed fissure data from the cache server
    const [data, setData] = useState({});
    //timestamp of cache update
    const [timestamp, setTimestamp] = useState(0);
    //solnodes API data, for translating mission id to mission info
    const [solnodes, setSolnodes] = useState();
    //current local time TODO: MOVE TO CHILD TO AVOID FULL PAGE RERENDER EVERY SECOND
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
        let cookie = localStorage.getItem("enabledMissions")
        if(cookie){
            setEnabledMissions(JSON.parse(cookie))
            return;
        }
        let missns = {
            alchemy: true,
            capture: true,
            cascade: true,
            exterminate: true,
            disruption: true,
            flood: true,
            rescue: true,
            survival: true,
            spalchemy: true,
            spcapture: true,
            spcascade: true,
            spexterminate: true,
            spdisruption: true,
            spflood: true,
            sprescue: true,
            spsurvival: true,
        }
        setEnabledMissions(missns);
    }, []);

    const toggleMission = (title) => {
      let mis = {...enabledMissions}
      mis[title] = !mis[title]
      setEnabledMissions(mis)
    }
  
    useEffect(() => {
      localStorage.setItem("enabledMissions", JSON.stringify(enabledMissions))
    }, [enabledMissions])

    if(data.normal && data.steelpath){
        let normalMissions = Object.keys(data.normal).map((missionName) => {
            if(enabledMissions[missionName]) return <MissionType title={missionName} missions={data.normal[missionName]} />
            else return <MissionType />
        })
        let spMissions = Object.keys(data.steelpath).map((missionName) => {
            if(enabledMissions["sp" + missionName]) return <MissionType title={"sp " + missionName} missions={data.steelpath[missionName]} />
            else return <MissionType />
        })

        return (
            <>
                <Clock />
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
            <Clock />
            <p className="time">Loading...</p>
        </>
    )
}

export default Relics
