import '../App.css'

function ControlBox({ missions, toggle }) {

    let toggleMission = (title, steelpath) => {
        return () => {
            toggle(title, steelpath)
        }
    }

    let normalButtons = Object.keys(missions.normal).map((missionName) => {
        return <button className={`toggle-btn toggle-${missionName} ${missions.normal[missionName] ? "enabled" : "disabled"}`}
            onClick={toggleMission(missionName)}
            key={missionName}
        >{missionName}</button>
    })
    let steelpathButtons = Object.keys(missions.steelpath).map((missionName) => {
        return <button className={`toggle-btn toggle-${"sp" + missionName} ${missions.steelpath[missionName] ? "enabled" : "disabled"}`}
            onClick={toggleMission(missionName, true)}
            key={"sp" + missionName}
        >{"sp " + missionName}</button>
    })
    return (
        <div>
            <div className="control-box">
                {normalButtons}
            </div>
            <div className="control-box">
                {steelpathButtons}
            </div>
        </div>
    )
}

function defaultSettingsFromData(data) {
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
    return missns
}

export { ControlBox, defaultSettingsFromData }
