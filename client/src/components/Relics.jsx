import { useState, useEffect } from "react";
import "../App.css";
import MissionType from "./MissionType.jsx";
import { ControlBox, defaultSettingsFromData } from "./ControlBox.jsx";

let hostUrl;
if (import.meta.env.DEV) hostUrl = "http://localhost:3000";
else hostUrl = "https://relics.apetbrz.dev";

//save settings to local storage
function saveSettings(newSettings) {
    localStorage.setItem("enabledMissions", JSON.stringify(newSettings));
};

function Relics() {
    //the parsed fissure data from the cache server
    const [data, setData] = useState({});
    //timestamp of cache update
    const [timestamp, setTimestamp] = useState(0);
    //local user settings
    const [enabledMissions, setEnabledMissions] = useState(JSON.parse(localStorage.getItem("enabledMissions") || "{}"));

    //this fetches worldstate data from cache server
    const fetchAPI = async () => {
        const res = await fetch(hostUrl + "/worldstate").then((res) => res.json());
        setTimestamp(res.timestamp);
        setData(res.wfdata);
    };

    //fetch api
    useEffect(() => {
        fetchAPI();
        setInterval(() => {
            fetchAPI();
        }, 60 * 1000);
    }, []);

    //toggle mission visibility (used in ControlBox)
    const toggleMission = (title, steelpath = false) => {
        let mis = { ...enabledMissions };
        let mode = steelpath ? "steelpath" : "normal";
        mis[mode][title] = !mis[mode][title];
        setEnabledMissions(mis);
        saveSettings(enabledMissions);
    };

    //manage sync between locally stored settings and incoming mission type data
    useEffect(() => {
        //broken data?
        if (!data?.normal) return;

        //get local storage item, or {} if not exists
        let localSettings = JSON.parse(localStorage.getItem("enabledMissions") || "{}");

        //assume normal/steelpath have identical mission names
        let localMissionTypes = localSettings?.normal ? Object.keys(localSettings?.normal) : [];
        let incomingMissionTypes = Object.keys(data.normal);

        //if the two lists are not identical,
        if (
            !(incomingMissionTypes.length == localMissionTypes.length &&
                localMissionTypes.every((element, key) => element == incomingMissionTypes[key]))
        ) {
            //create default settings on the new mission data
            let missns = defaultSettingsFromData(data);
            //and save
            setEnabledMissions(missns);
            saveSettings(enabledMissions);
        }
    }, [data]);

    //if data is invalid, render empty element
    if (!data?.normal || !data?.steelpath || !enabledMissions.normal) return (<></>)
    //otherwise, valid data!
    else {
        //get mission lists from the data directly:
        let normalMissions = Object.keys(data.normal).filter((missionName) => enabledMissions.normal[missionName]).map((missionName) => {
            return (
                <MissionType
                    title={missionName}
                    missions={data.normal[missionName]}
                    key={missionName}
                />
            );
        });
        let spMissions = Object.keys(data.steelpath).filter((missionName) => enabledMissions.steelpath[missionName]).map((missionName) => {
            return (
                <MissionType
                    title={"sp " + missionName}
                    missions={data.steelpath[missionName]}
                    key={"sp" + missionName}
                />
            );
        });

        return (
            <>
                <p id="refresh">
                    Last Worldstate Update: {new Date(timestamp).toLocaleTimeString()}
                </p>
                <div className="relics">
                    <ControlBox missions={enabledMissions} toggle={toggleMission} />
                    <div>
                        <div className="mission-block">{normalMissions}</div>
                        <div className="mission-block">{spMissions}</div>
                    </div>
                    <div style={{ width: "100%" }} />
                </div>
            </>
        );
    }
}

export default Relics;
