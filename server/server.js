import path from "path";
import express from "express";
import cors from "cors";

const port = 3000;

const app = express();

const corsOptions = {
  origin: ["http://localhost:" + port]
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
  console.log("worldstate requested - " + new Date(now).toLocaleTimeString())
  if(updateTime < (now - 1000*60*1)){
    console.log("data timeout, last update at - " + new Date(updateTime).toLocaleTimeString());
    await updateData();
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

await updateData();

setInterval(() => {
  updateData();
}, 2*60*1000);

await getSolnodesData();

app.listen(port, async () => {
  console.log("server started on port");
});
