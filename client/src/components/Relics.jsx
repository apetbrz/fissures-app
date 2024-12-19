import { useState, useEffect } from 'react'
import '../App.css'
import MissionType from './MissionType.jsx'

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
    const [data, setData] = useState({});
    const [fissures, setFissures] = useState();
    const [timestamp, setTimestamp] = useState(0);
    const [solnodes, setSolnodes] = useState();
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [updateFlag, forceUpdate] = useState(false);
    
    useEffect(() => {
        setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
    }, []);

    const fetchAPI = async() => {
        const res = await fetch('http://localhost:3000/worldstate').then((res) => res.json());
        setTimestamp(res.timestamp);
        setData(res.wfdata);
        setSolnodes(res.solnodes);
    }
    
    function solnodeLookup(node){
        if(!solnodes || solnodes[node] === undefined) {
            console.log("SOLNODES IS " + solnodes);
            console.table(solnodes);
            return {};
        }
        return solnodes[node];
    }
    
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
        
        setFissures({normal, steelpath});
    }
    
    useEffect(() => {
        fetchAPI();
    }, []);

    useEffect(() => {
        gatherFissureMissions(data);
    },[data]);
    

    if(fissures) return (
        <>
            <p id="time">Current Time: { currentTime } </p>
            <p id="refresh">Last Worldstate Update: { new Date(timestamp).toLocaleTimeString() }</p>
            <div className="relics">
                <MissionType title="cascade" missions={fissures.normal.cascade} />
                <MissionType title="capture" missions={fissures.normal.capture} />
                <MissionType title="exterminate" missions={fissures.normal.exterminate} />
                <MissionType title="disruption" missions={fissures.normal.disruption} />
                <MissionType title="survival" missions={fissures.normal.survival} />
                <MissionType title="rescue" missions={fissures.normal.rescue} />
                <MissionType title="sp cascade" missions={fissures.steelpath.cascade} />
                <MissionType title="sp capture" missions={fissures.steelpath.capture} />
                <MissionType title="sp exterminate" missions={fissures.steelpath.exterminate} />
                <MissionType title="sp disruption" missions={fissures.steelpath.disruption} />
                <MissionType title="sp survival" missions={fissures.steelpath.survival} />
                <MissionType title="sp rescue" missions={fissures.steelpath.rescue} />
            </div>
        </>
        )

    return (
        <div className="relics">
            <p id="time">Current Time: { currentTime } </p>
            <p>Loading...</p>
        </div>
    )
}

export default Relics