import { useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'
import '../App.css'
import MissionType from './MissionType.jsx'
import ControlBox from './ControlBox.jsx'

const hostUrl = "http://muro.lan:3000"

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
    //the raw worldstate JSON from cache server
    const [data, setData] = useState({});
    //fissure data
    const [fissures, setFissures] = useState();
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
    
    //begin 1 second timer, for keeping local time correct
    //TODO: PLEASE MOVE TO CHILD
    useEffect(() => {
        setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 60*1000);
    }, []);

    //this fetches worldstate data from cache server
    const fetchAPI = async() => {
        const res = await fetch(hostUrl+"/worldstate").then((res) => res.json());
        setTimestamp(res.timestamp);
        setData(res.wfdata);
        setSolnodes(res.solnodes);
    }
    
    //get info for mission from solnodes
    function solnodeLookup(node){
        if(!solnodes || solnodes[node] === undefined) {
            console.log("SOLNODES INVALID");
            return {};
        }
        return solnodes[node];
    }
    
    //convert fissure mission in worldstate into object for rendering on UI
    const worldstateMissionToJSON = (mission) => {
        let node = solnodeLookup(mission.Node);
        return {
            relic: relicTiers[mission.Modifier],
            planet: node.value,
            steelpath: mission.Hard != null,
            faction: node.enemy,
            until: new Date(Number(mission.Expiry.$date.$numberLong)).toLocaleTimeString()
        }
    }

    //scrape worldstate for all fissure missions and return, separating normal and steel path
    const gatherFissureMissions = (missionData) => {
        if(!missionData) return;
        if(!missionData.ActiveMissions) return;
        
        let normal = { 
            capture: [],
            exterminate: [],
            disruption: [],
            survival: [],
            rescue: [],
            cascade: []
        };
        let steelpath = { 
            capture: [],
            exterminate: [],
            disruption: [],
            survival: [],
            rescue: [],
            cascade: []
        };

        missionData.ActiveMissions.forEach(mission => {
            let missionTitle = missionTitles[mission.MissionType];
            if(missionTitle) {
                let missionObj = worldstateMissionToJSON(mission);
                (missionObj.steelpath ? steelpath : normal)[missionTitle].push(missionObj);
            }
        });
        
        return {normal, steelpath};
    }
    
    //fetch api
    useEffect(() => {
        fetchAPI();
        setInterval(() => {
            fetchAPI();
        }, 60 * 1000);
    }, []);

    //gather fissures
    useEffect(() => {
        setFissures(gatherFissureMissions(data));
    },[data]);

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

    if(fissures) return (
        <>
            <p id="time">Current Time: { currentTime }</p>
            <p id="refresh">Last Worldstate Update: { new Date(timestamp).toLocaleTimeString() }</p>
            <ControlBox missions={ enabledMissions } toggle={toggleMission}/>
            <div className="relics">
                {enabledMissions.cascade ? <MissionType title="cascade" missions={fissures.normal.cascade} /> : <MissionType />}
                {enabledMissions.capture ? <MissionType title="capture" missions={fissures.normal.capture} /> : <MissionType />}
                {enabledMissions.exterminate ? <MissionType title="exterminate" missions={fissures.normal.exterminate} /> : <MissionType />}
                {enabledMissions.disruption ? <MissionType title="disruption" missions={fissures.normal.disruption} /> : <MissionType />}
                {enabledMissions.survival ? <MissionType title="survival" missions={fissures.normal.survival} /> : <MissionType />}
                {enabledMissions.rescue ? <MissionType title="rescue" missions={fissures.normal.rescue} /> : <MissionType />}
            </div>
            <div className="relics">
                {enabledMissions.spcascade ? <MissionType title="sp cascade" missions={fissures.steelpath.cascade} /> : <MissionType />}
                {enabledMissions.spcapture ? <MissionType title="sp capture" missions={fissures.steelpath.capture} /> : <MissionType />}
                {enabledMissions.spexterminate ? <MissionType title="sp exterminate" missions={fissures.steelpath.exterminate} /> : <MissionType />}
                {enabledMissions.spdisruption ? <MissionType title="sp disruption" missions={fissures.steelpath.disruption} /> : <MissionType />}
                {enabledMissions.spsurvival ? <MissionType title="sp survival" missions={fissures.steelpath.survival} /> : <MissionType />}
                {enabledMissions.sprescue ? <MissionType title="sp rescue" missions={fissures.steelpath.rescue} /> : <MissionType />}
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
