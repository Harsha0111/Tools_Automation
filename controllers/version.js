import {
  getSelectedTools,
  getSelectedVersions,
  getServerDetails,
  setSelectedVersions,
} from "../models/data.js";

const getVersion = (req, res) => {
  res.render("version", {
    selectedVersions: getSelectedVersions(),
    selectedTools: getSelectedTools(),
    ubuntuVersionError: "",
    javaVersionError: "",
  });
};

const postVersion = (req, res) => {
  let isUbuntuSelected = false;
  let isJavaSelected = false;

  if (req.body.ubuntuVersion === "Ubuntu version") {
    res.render("version", {
      selectedVersions: getSelectedVersions(),
      selectedTools: getSelectedTools(),
      ubuntuVersionError: "**Please choose any one version",
      javaVersionError: "",
    });
  } else {
    setSelectedVersions({
      ...getSelectedVersions(),
      ubuntu: req.body.ubuntuVersion,
    });
    isUbuntuSelected = true;
  }

  if (req.body.javaVersion === "Java version") {
    res.render("version", {
      selectedVersions: getSelectedVersions(),
      selectedTools: getSelectedTools(),
      ubuntuVersionError: "",
      javaVersionError: "**Please choose any one version",
    });
  } else {
    setSelectedVersions({
      ...getSelectedVersions(),
      java: req.body.javaVersion,
    });
    isJavaSelected = true;
  }

  setSelectedVersions({
    ...getSelectedVersions(),
    javaSonarVersion: req.body.javaSonarVersion,
  });

  if (isUbuntuSelected && isJavaSelected) {
    res.render("server", {
      serverDetails: getServerDetails(),
      ipError: "",
      userNameError: "",
      keyError: "",
    });
  }
};

export { getVersion, postVersion };
