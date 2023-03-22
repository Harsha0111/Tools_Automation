import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { postHome, getHome } from "./controllers/index.js";
import { getVersion, postVersion } from "./controllers/version.js";
import { getServer, postServer } from "./controllers/server.js";
import { getInstall, postInstall } from "./controllers/install.js";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());

let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get("/", getHome);

app.post("/", urlencodedParser, postHome);

app.get("/version", urlencodedParser, getVersion);

app.post("/version", urlencodedParser, postVersion);

app.get("/server", urlencodedParser, getServer);

app.post("/server", urlencodedParser, postServer);

app.get("/install", urlencodedParser, getInstall);

app.post("/install", urlencodedParser, postInstall);

app.listen(port, () => {
  console.log(`Tool Automation app is listening on port ${port}`);
});

// https://www.npmjs.com/package/selenium-webdriver
// windows - env path
// linux - sudo gedit /etc/environment => PATH=""
// export PATH=$PATH:
