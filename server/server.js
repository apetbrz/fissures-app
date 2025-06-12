import path from "path";
import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import gatherFissureMissions from "./data.js";

let port;
let corsOrigin;
if(process.env.IS_DEV){
  port = 3000;
  corsOrigin = "*"
}
else{
  port = 4001;
  corsOrigin = "https://relics.apetbrz.dev";
}

console.log("cors origin: " + corsOrigin);

const app = express();

const corsOptions = {
  origin: [corsOrigin]
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
  let clientIp = req.get("x-real-ip");
  if(!clientIp) clientIp = req.ip + " - not proxied";
  console.log("worldstate requested - " + new Date(now).toLocaleTimeString() + " - " + clientIp)
  if(updateTime < (now - 1000*60*1)){
    console.log("data timeout, last update at - " + new Date(updateTime).toLocaleTimeString());
    await updateData();
  }
  let output = {wfdata: wfdata, timestamp: updateTime};
  res.set("Access-Control-Allow-Origin","*")
  res.json(output);
})

let updateData = async () => {
  console.log("refreshing data: " + new Date().toTimeString())
  console.log("fetching wfdata...");
  await fetch('https://content.warframe.com/dynamic/worldState.php')
  .then((res) => res.json())
  .then((data) => {
    console.log("...wfdata loaded");
    wfdata = gatherFissureMissions(data, solnodes);
    updateTime = data.Time*1000;
    console.log("...wfdata parsed");
  })
  .catch((err) => {
    console.log("WORLDSTATE FETCH ERR: " + err);
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
  })
  .catch((err) => {
    console.log("SOLNODES FETCH ERR: " + err);
  });
}

setInterval(() => {
  updateData();
}, 2*60*1000);

setInterval(() => {
  getSolnodesData();
}, 60*60*1000);

var server;
if(process.env.IS_DEV){
  console.log("IS_DEV environment, no HTTPS");
  server = app;
}
else {
  console.log("production environment, HTTPS");
  const key = fs.readFileSync(import.meta.dirname + "/secret/selfsigned.key");
  const cert = fs.readFileSync(import.meta.dirname + "/secret/selfsigned.crt");
  const certOptions = {
    key: key,
    cert: cert
  };
  server = https.createServer(certOptions, app);
}

let main = async () => {
  await getSolnodesData();
  await updateData();
  server.listen(port, () => {
    console.log("server started on port " + port + "\n\n");
  });
}

main();
