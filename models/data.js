let selectedTools = {
  jenkins: "",
  git: "",
  nexus: "",
  sonarQube: "",
};
let selectedVersions = {
  java: "Java version",
  ubuntu: "Ubuntu version",
  javaSonarVersion: "8",
};
let serverDetails = { ip: "65.0.71.31", username: "ubuntu", key: null };
let selectedPorts = { jenkinsPort: 8080, nexusPort: 8081, sonarPort: 9000 };
let jenkinsInitialPassword = null;
let nexusInitialPassword = null;

const setSelectedTools = (tools) => {
  selectedTools = tools;
};

const getSelectedTools = () => {
  return selectedTools;
};

const setSelectedVersions = (versions) => {
  selectedVersions = versions;
};

const getSelectedVersions = () => {
  return selectedVersions;
};

const setServerDetails = (server) => {
  serverDetails = server;
};

const getServerDetails = () => {
  return serverDetails;
};

const setSelectedPorts = (ports) => {
  selectedPorts = ports;
};

const getSelectedPorts = () => {
  return selectedPorts;
};

const setJenkinsInitialPassword = (password) => {
  jenkinsInitialPassword = password;
};

const getJenkinsInitialPassword = () => {
  return jenkinsInitialPassword;
};

const setNexusInitialPassword = (password) => {
  nexusInitialPassword = password;
};

const getNexusInitialPassword = () => {
  return jenkinsInitialPassword;
};

export {
  setSelectedTools,
  getSelectedTools,
  setSelectedVersions,
  getSelectedVersions,
  setServerDetails,
  getServerDetails,
  setSelectedPorts,
  getSelectedPorts,
  setJenkinsInitialPassword,
  getJenkinsInitialPassword,
  setNexusInitialPassword,
  getNexusInitialPassword,
};
