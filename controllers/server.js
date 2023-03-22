import {
  getSelectedPorts,
  getSelectedTools,
  getSelectedVersions,
  getServerDetails,
  setServerDetails,
} from "../models/data.js";
import { isValidIpv4Addr } from "../utils/utils.js";

const getServer = (req, res) => {
  res.render("server", {
    serverDetails: getServerDetails(),
    ipError: "",
    userNameError: "",
    keyError: "",
  });
};

const postServer = (req, res) => {
  let isIpEntered = false;
  let isUserNameEntered = false;
  let isKeyEntered = false;

  let ip = req.body.ip ? req.body.ip : "";
  let userName = req.body.username ? req.body.username : "";
  let serverKey = req?.files?.key ? req.files.key : "";

  // ip validation
  if (ip == "") {
    res.render("server", {
      serverDetails: getServerDetails(),
      ipError: "**Please enter Ip Address",
      userNameError: "",
      keyError: "",
    });
  } else if (!isNaN(ip) || !isValidIpv4Addr(ip)) {
    res.render("server", {
      serverDetails: getServerDetails(),
      ipError: "**Please enter valid Ip Address",
      userNameError: "",
      keyError: "",
    });
  } else {
    isIpEntered = true;
    setServerDetails({ ...getServerDetails(), ip: req.body.ip });
  }

  // username validation
  if (userName == "") {
    res.render("server", {
      serverDetails: getServerDetails(),
      ipError: "",
      userNameError: "**Username can't be empty",
      keyError: "",
    });
  } else if (userName.length <= 2) {
    res.render("server", {
      serverDetails: getServerDetails(),
      ipError: "",
      userNameError: "**Please enter valid Username",
      keyError: "",
    });
  } else if (!isNaN(userName)) {
    res.render("server", {
      serverDetails: getServerDetails(),
      ipError: "",
      userNameError: "**Numbers not allowed",
      keyError: "",
    });
  } else {
    isUserNameEntered = true;
    setServerDetails({ ...getServerDetails(), username: req.body.username });
  }

  // file validation
  if (!req.files || Object.keys(req.files).length === 0) {
    res.render("server", {
      serverDetails: getServerDetails(),
      ipError: "",
      userNameError: "",
      keyError: "**Please choose a Private key",
    });
  } else if (!req.files.key.name.includes(".pem")) {
    res.render("server", {
      serverDetails: getServerDetails(),
      ipError: "",
      userNameError: "",
      keyError: "**Please choose a .pem file only",
    });
  } else {
    isKeyEntered = true;
    setServerDetails({ ...getServerDetails(), key: serverKey });
  }

  if (isIpEntered && isKeyEntered && isUserNameEntered) {
    res.render("install", {
      selectedPorts: getSelectedPorts(),
      selectedTools: getSelectedTools(),
      selectedVersions: getSelectedVersions(),
      jenkinsPortError: "",
      nexusPortError: "",
      sonarPortError: "",
    });
  }
};

export { getServer, postServer };
