import '../App.css'

function MissionType({title, missions}) {

    if(!missions) return (<></>)

    let count = 0;
    const missionList = missions.map(mission => {
        return <div className="mission" key={count++}>
            <p>Relic Tier: {mission.relic}</p>
            <p>Planet: {mission.planet}</p>
            <p>Faction: {mission.faction}</p>
            <p>Expires: {mission.until}</p>
        </div>;
    });

    return (
        <div className="mission-type">
            <label>{title}</label>
            <div className="missions">{missionList}</div>
        </div>
    )
}

export default MissionType