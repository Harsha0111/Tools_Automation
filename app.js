const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

let urlencodedParser = bodyParser.urlencoded({ extended: false });

let selectedTools = { jenkins: "Jenkins", git: null };
let selectedVersions = { java: "Java version", ubuntu: "Ubuntu version" };

let jenkinsPort = { port: 8080 };

// step1
app.get("/", (req, res) => {
  res.render("index", { selectedTools: selectedTools, error: "" });
});

app.post("/", urlencodedParser, (req, res) => {
  console.log(req.body);
  if (!req.body.jenkins || !req.body.git) {
    res.render("index", {
      selectedTools: selectedTools,
      error: "**Please choose any one tool",
    });
  } else {
    selectedTools = { jenkins: req.body.jenkins, git: req.body.git };
    res.render("version", {
      selectedVersions: selectedVersions,
      ubuntuVersionError: "",
      javaVersionError: "",
    });
  }
});

// step2
app.get("/version", (req, res) => {
  res.render("version", {
    selectedVersions: selectedVersions,
    ubuntuVersionError: "",
    javaVersionError: "",
  });
});

app.post("/version", urlencodedParser, (req, res) => {
  console.log(req.body);

  let isUbuntuSelected = false;
  let isJavaSelected = false;

  if (req.body.ubuntuVersion === "Ubuntu version") {
    res.render("version", {
      selectedVersions: selectedVersions,
      ubuntuVersionError: "**Please choose any one version",
      javaVersionError: "",
    });
  } else {
    selectedVersions = {
      ...selectedVersions,
      ubuntu: req.body.ubuntuVersion,
    };
    isUbuntuSelected = true;
  }

  if (req.body.javaVersion === "Java version") {
    res.render("version", {
      selectedVersions: selectedVersions,
      ubuntuVersionError: "",
      javaVersionError: "**Please choose any one version",
    });
  } else {
    selectedVersions = {
      ...selectedVersions,
      java: req.body.javaVersion,
    };
    isJavaSelected = true;
  }

  if (isUbuntuSelected && isJavaSelected) {
    console.log(selectedTools);
    console.log(selectedVersions);
    res.render("server");
  }
});

// step3
app.get("/server", (req, res) => {
  res.render("server");
});

// step4
app.get("/install", (req, res) => {
  res.render("install", {
    port: jenkinsPort,
    error: "",
  });
});

app.post("/install", urlencodedParser, (req, res) => {
  console.log(req.body);
  if (!req.body.port) {
    res.render("install", {
      port: jenkinsPort,
      error: "**Please enter Port",
    });
  } else {
    jenkinsPort = { port: req.body.port };
    res.render("success", {});
  }
});


// step5
app.get("/success", (req, res) => {
  res.render("success");
});

app.listen(port, () => {
  console.log(`Tool Automation app is listening on port ${port}`);
});
