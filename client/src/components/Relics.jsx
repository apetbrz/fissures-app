import { useState, useEffect, useCallback } from "react";
import "../App.css";
import MissionType from "./MissionType.jsx";
import ControlBox from "./ControlBox.jsx";
import Clock from "./Clock.jsx";

let hostUrl;
if (import.meta.env.DEV) hostUrl = "http://localhost:3000";
else hostUrl = "https://relics.apetbrz.dev";

function Relics() {
    //the parsed fissure data from the cache server
    const [data, setData] = useState({});
    //timestamp of cache update
    const [timestamp, setTimestamp] = useState(0);
    //solnodes API data, for translating mission id to mission info
    const [solnodes, setSolnodes] = useState();
    //current local time  TODO: MOVE TO CHILD TO AVOID FULL PAGE RERENDER EVERY SECOND
    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleTimeString(),
    );
    //??
    const [updateFlag, forceUpdate] = useState(false);
    //local user settings
    const [enabledMissions, setEnabledMissions] = useState({});

    //this fetches worldstate data from cache server
    const fetchAPI = async () => {
        const res = await fetch(hostUrl + "/worldstate").then((res) => res.json());
        setTimestamp(res.timestamp);
        setData(res.wfdata);
        setSolnodes(res.solnodes);
    };

    //fetch api
    useEffect(() => {
        fetchAPI();
        setInterval(() => {
            fetchAPI();
        }, 60 * 1000);
    }, []);

    useEffect(() => {
        if (!data?.normal) return;
        let cookie = JSON.parse(localStorage.getItem("enabledMissions"));

        let cookieVals = cookie?.normal ? Object.keys(cookie?.normal) : [];
        let dataVals = data?.normal ? Object.keys(data.normal) : [];

        if (
            cookie?.normal &&
            dataVals.length == cookieVals.length &&
            cookieVals.every((element, key) => element == dataVals[key])
        ) {
            setEnabledMissions(cookie);
        } else {
            let missns = {
                normal: {},
                steelpath: {},
            };
            Object.keys(data.normal).map((missionName) => {
                missns.normal[missionName] = true;
            });
            Object.keys(data.steelpath).map((missionName) => {
                missns.steelpath[missionName] = true;
            });

            setEnabledMissions(missns);
            saveSettings();
        }
    }, [data]);

    const toggleMission = (title, steelpath = false) => {
        let mis = { ...enabledMissions };
        let mode = steelpath ? "steelpath" : "normal";
        mis[mode][title] = !mis[mode][title];
        setEnabledMissions(mis);
        saveSettings();
    };

    const saveSettings = () => {
        localStorage.setItem("enabledMissions", JSON.stringify(enabledMissions));
    };

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
                <ControlBox missions={enabledMissions} toggle={toggleMission} />
                <div className="relics">{normalMissions}</div>
                <div className="relics">{spMissions}</div>
            </>
        );
    }
}

export default Relics;
