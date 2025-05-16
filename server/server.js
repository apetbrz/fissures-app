import path from "path";
import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import gatherFissureMissions from "./data.js";

const key = fs.readFileSync(import.meta.dirname + "/secret/selfsigned.key");
const cert = fs.readFileSync(import.meta.dirname + "/secret/selfsigned.crt");
const certOptions = {
  key: key,
  cert: cert
};

const port = 4000;

const app = express();

const corsOptions = {
  origin: ["https://relics.apetbrz.dev:" + port]
};
app.use(cors(corsOptions));

let wfdata = {};
let solnodes = {};
let updateTime = 0;

app.get("/", (req, res) => {
  let fileName = path.resolve("../dist/index.html");
  res.sendFile(fileName);
});
app.use("/assets", express.static("../dist/assets"));
app.get("/worldstate", async (req, res) => {
  let now = Date.now();
  console.log("worldstate requested - " + new Date(now).toLocaleTimeString() + " - " + req.get("x-real-ip"))
  if(updateTime < (now - 1000*60*1)){
    console.log("data timeout, last update at - " + new Date(updateTime).toLocaleTimeString());
    await updateData();
  }
  let output = {wfdata: wfdata, solnodes: solnodes, timestamp: updateTime};
  res.json(output);
})

let updateData = async () => {
  console.log("refreshing data: " + new Date().toTimeString())
  await getSolnodesData();
  console.log("fetching wfdata...");
  fetch('https://content.warframe.com/dynamic/worldState.php')
    .then((res) => res.json())
    .then((data) => {
      console.log("...wfdata loaded");
      wfdata = gatherFissureMissions(data, solnodes);
      console.log("...wfdata parsed");
      updateTime = data.Time*1000;
    });
}

let getSolnodesData = async () => {
  console.log("fetching solnodes data...");
  await fetch('https://api.warframestat.us/solNodes/')
    .then((res) => res.json())
    .then((data) => {
      if(data === null) console.log("...failed to load solnodes data")
      else {
        solnodes = data;
        console.log("...solnodes data loaded");
      }
    });
}

setInterval(() => {
  updateData();
}, 2*60*1000);

var server = https.createServer(certOptions, app);

server.listen(port, async () => {
  console.log("server started on port " + port);
  await updateData();
});
