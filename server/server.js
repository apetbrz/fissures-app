const path = require("path");
const express = require("express");
const cors = require("cors");

const port = 5173;

const app = express();

const corsOptions = {
    origin: ["http://localhost:" + port]
};
app.use(cors(corsOptions));

let wfdata = {};
let solnodes = {};
let updateTime = 0;

app.get("/", (req, res) => {
    let fileName = path.resolve(__dirname + "/../dist/index.html");
    res.sendFile(fileName);
});
app.get("/assets/:filename", (req, res) => {
    let fileName = path.resolve(__dirname + "/../dist/assets/" + req.params.filename);
    res.sendFile(fileName);
});
app.get("/worldstate", (req, res) => {
    let now = Date.now();
    console.log("worldstate requested - " + new Date(now).toTimeString())
    if(updateTime < (now - 1000*60*1)){
        console.log("data timeout");
        updateData();
    }
    let output = {wfdata: wfdata, solnodes: solnodes, timestamp: updateTime};
    res.json(output);
})

let updateData = async () => {
    updateTime = Date.now();
    console.log("refreshing data: " + new Date(updateTime).toTimeString())
    console.log("fetching wfdata...");
    fetch('https://content.warframe.com/dynamic/worldState.php')
    .then((res) => res.json())
    .then((data) => {
        wfdata = data;
        console.log("...wfdata loaded");
    });
}

let getSolnodesData = async () => {
    console.log("fetching solnodes data...");
    fetch('https://api.warframestat.us/solNodes/')
    .then((res) => res.json())
    .then((data) => {
        if(data === null) console.log("...failed to load solnodes data")
        else {
            solnodes = data;
            console.log("...solnodes data loaded");
        }
    });
}

app.listen(3000, async () => {
    console.log("server started on 3000");
    updateData();
    getSolnodesData();
});