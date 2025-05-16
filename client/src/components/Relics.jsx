import { useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'
import '../App.css'
import MissionType from './MissionType.jsx'
import ControlBox from './ControlBox.jsx'
import Clock from './Clock.jsx'

const hostUrl = "https://relics.apetbrz.dev"

// surely theres a way to make this two-way? instead of two objs? shrug
const missionIds = {
    capture: "MT_CAPTURE",
    exterminate: "MT_EXTERMINATE",
    disruption: "MT_ARTIFACT",
    survival: "MT_SURVIVAL",
    rescue: "MT_RESCUE",
    cascade: "MT_VOID_CASCADE",
}

const missionTitles = {
    MT_CAPTURE: "capture",
    MT_EXTERMINATE: "exterminate",
    MT_ARTIFACT: "disruption",
    MT_SURVIVAL: "survival",
    MT_RESCUE: "rescue",
    MT_VOID_CASCADE: "cascade",
}

const relicTiers = {
    VoidT1: "Lith",
    VoidT2: "Meso",
    VoidT3: "Neo",
    VoidT4: "Axi",
    VoidT5: "Requiem",
    VoidT6: "Omnia"
}

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
        let cookie = Cookies.get("enabledMissions")
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
      console.table(mis);
      setEnabledMissions(mis)
    }
  
    useEffect(() => {
      Cookies.set("enabledMissions", JSON.stringify(enabledMissions), {expires: 14})
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
