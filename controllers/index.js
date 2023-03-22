import {
  getSelectedTools,
  getSelectedVersions,
  setSelectedTools,
} from "../models/data.js";

const getHome = (req, res) => {
  res.render("index", {
    selectedTools: getSelectedTools(),
    error: "",
  });
};

let postHome = (req, res) => {
  setSelectedTools({
    jenkins: req.body.jenkins,
    git: req.body.git,
    sonarQube: req.body.sonarQube,
    nexus: req.body.nexus,
  });
  if (
    req.body.jenkins ||
    req.body.git ||
    req.body.nexus ||
    req.body.sonarQube
  ) {
    res.render("version", {
      selectedVersions: getSelectedVersions(),
      selectedTools: getSelectedTools(),
      ubuntuVersionError: "",
      javaVersionError: "",
    });
  } else {
    res.render("index", {
      selectedTools: getSelectedTools(),
      error: "**Please choose atleast one tool",
    });
  }
};

export { getHome, postHome };
