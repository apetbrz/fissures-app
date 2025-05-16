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
            cascade: true,
            capture: true,
            exterminate: true,
            disruption: true,
            survival: true,
            rescue: true,
            spcascade: true,
            spcapture: true,
            spexterminate: true,
            spdisruption: true,
            spsurvival: true,
            sprescue: true
        }
        setEnabledMissions(missns);
    }, []);

    const toggleMission = (title) => {
      let mis = {...enabledMissions}
      mis[title] = !mis[title]
      setEnabledMissions(mis)
    }
  
    useEffect(() => {
      Cookies.set("enabledMissions", JSON.stringify(enabledMissions), {expires: 14})
    }, [enabledMissions])

    if(data) return (
        <>
            <Clock />
            <p id="refresh">Last Worldstate Update: { new Date(timestamp).toLocaleTimeString() }</p>
            <ControlBox missions={ enabledMissions } toggle={toggleMission}/>
            <div className="relics">
                {enabledMissions.cascade ? <MissionType title="cascade" missions={data.normal.cascade} /> : <MissionType />}
                {enabledMissions.capture ? <MissionType title="capture" missions={data.normal.capture} /> : <MissionType />}
                {enabledMissions.exterminate ? <MissionType title="exterminate" missions={data.normal.exterminate} /> : <MissionType />}
                {enabledMissions.disruption ? <MissionType title="disruption" missions={data.normal.disruption} /> : <MissionType />}
                {enabledMissions.survival ? <MissionType title="survival" missions={data.normal.survival} /> : <MissionType />}
                {enabledMissions.rescue ? <MissionType title="rescue" missions={data.normal.rescue} /> : <MissionType />}
            </div>
            <div className="relics">
                {enabledMissions.spcascade ? <MissionType title="sp cascade" missions={data.steelpath.cascade} /> : <MissionType />}
                {enabledMissions.spcapture ? <MissionType title="sp capture" missions={data.steelpath.capture} /> : <MissionType />}
                {enabledMissions.spexterminate ? <MissionType title="sp exterminate" missions={data.steelpath.exterminate} /> : <MissionType />}
                {enabledMissions.spdisruption ? <MissionType title="sp disruption" missions={data.steelpath.disruption} /> : <MissionType />}
                {enabledMissions.spsurvival ? <MissionType title="sp survival" missions={data.steelpath.survival} /> : <MissionType />}
                {enabledMissions.sprescue ? <MissionType title="sp rescue" missions={data.steelpath.rescue} /> : <MissionType />}
            </div>
        </>
    )

    else return (
        <div className="relics">
            <p id="time">Current Time: { currentTime } </p>
            <p>Loading...</p>
        </div>
    )
}

export default Relics
