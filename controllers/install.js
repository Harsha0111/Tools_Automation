import { Builder, Browser, By, Key, until } from "selenium-webdriver";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { NodeSSH } from "node-ssh";
import * as path from "path";
import fs from "fs";

import {
  getJenkinsInitialPassword,
  getSelectedPorts,
  getSelectedTools,
  getSelectedVersions,
  getServerDetails,
  setJenkinsInitialPassword,
  setNexusInitialPassword,
} from "../models/data.js";
import { errorPage } from "./error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ssh = new NodeSSH();
const reqPath = path.join(__dirname, "../");

const getInstall = (req, res) => {
  res.render("install", {
    selectedPorts: getSelectedPorts(),
    selectedTools: getSelectedTools(),
    selectedVersions: getSelectedVersions(),
    jenkinsPortError: "",
    nexusPortError: "",
    sonarPortError: "",
  });
};

const postInstall = (req, res) => {
  if (getSelectedTools().jenkins) {
    if (
      !req.body.jenkinsPort ||
      req.body.jenkinsPort === "" ||
      isNaN(req.body.jenkinsPort) ||
      req.body.jenkinsPort.length !== 4
    ) {
      res.render("install", {
        selectedPorts: { ...getSelectedPorts(), jenkinsPort: "" },
        selectedTools: getSelectedTools(),
        selectedVersions: getSelectedVersions(),
        jenkinsPortError: "**Please enter valid port number",
        nexusPortError: "",
        sonarPortError: "",
      });
    }
  }

  if (getSelectedTools().sonarQube) {
    if (
      !req.body.sonarPort ||
      req.body.sonarPort === "" ||
      isNaN(req.body.sonarPort) ||
      req.body.sonarPort.length !== 4
    ) {
      res.render("install", {
        selectedPorts: { ...getSelectedPorts(), sonarPort: "" },
        selectedTools: getSelectedTools(),
        selectedVersions: getSelectedVersions(),
        jenkinsPortError: "",
        sonarPortError: "**Please enter valid port number",
        nexusPortError: "",
      });
    }
  }

  if (getSelectedTools().nexus) {
    if (
      !req.body.nexusPort ||
      req.body.nexusPort === "" ||
      isNaN(req.body.nexusPort) ||
      req.body.nexusPort.length !== 4
    ) {
      res.render("install", {
        selectedPorts: { ...getSelectedPorts(), nexusPort: "" },
        selectedTools: getSelectedTools(),
        selectedVersions: getSelectedVersions(),
        jenkinsPortError: "",
        nexusPortError: "**Please enter valid port number",
        sonarPortError: "",
      });
    }
  }

  getServerDetails().key.mv(
    reqPath + "utils/key/" + getServerDetails().key.name,
    async (err) => {
      if (err) return console.log(err);
      else {
        console.log("File uploaded!");

        if (getSelectedTools().jenkins) {
          const remote = {
            cwd: "/home",
          };
          const installJava =
            getSelectedVersions().java === "11"
              ? reqPath + `utils/scripts/java11.sh`
              : reqPath + `utils/scripts/java17.sh`;
          let installJenkins = reqPath + `utils/scripts/jenkins.sh`;

          try {
            let conn = await ssh.connect({
              host: getServerDetails().ip,
              username: getServerDetails().username,
              privateKeyPath:
                reqPath + "utils/key/" + getServerDetails().key.name,
            });

            try {
              let javaResult = await conn.execCommand(
                fs.readFileSync(installJava).toString(),
                remote
              );
              console.log("javaResult STDOUT: " + javaResult.stdout);

              await conn.execCommand(
                fs.readFileSync(installJenkins).toString(),
                remote
              );

              let jenkinsPasswordResult = await conn.execCommand(
                "sudo cat /var/lib/jenkins/secrets/initialAdminPassword",
                {
                  cwd: "/home",
                }
              );
              console.log(
                "jenkinsPasswordResult STDOUT: " + jenkinsPasswordResult.stdout
              );
              console.log(
                "jenkinsPasswordResult stderr: " + jenkinsPasswordResult.stderr
              );
              setJenkinsInitialPassword(jenkinsPasswordResult.stdout);
              console.log("Completed");

              await createJenkinsAccount();
            } catch (error) {
              console.log("next", error);
              errorPage(res, error);
            }
          } catch (error) {
            console.log("main", error);
            errorPage(res, error);
          }
        }

        if (getSelectedTools().git) {
          const remote = {
            cwd: "/home",
          };
          let installGit = reqPath + `utils/scripts/git.sh`;

          try {
            let conn = await ssh.connect({
              host: getServerDetails().ip,
              username: getServerDetails().username,
              privateKeyPath:
                reqPath + "utils/key/" + getServerDetails().key.name,
            });

            try {
              let gitResult = await conn.execCommand(
                fs.readFileSync(installGit).toString(),
                {
                  cwd: "/home",
                }
              );
              console.log("gitResult STDOUT: " + gitResult.stdout);
            } catch (error) {
              console.log("next", error);
              errorPage(res, error);
            }
          } catch (error) {
            console.log("main", error);
            errorPage(res, error);
          }
        }

        if (getSelectedTools().nexus) {
          const remote = {
            cwd: "/home",
          };
          const javaPath = reqPath + `utils/scripts/java8.sh`;
          const nexusPath = reqPath + `utils/scripts/nexus.sh`;

          try {
            let conn = await ssh.connect({
              host: getServerDetails().ip,
              username: getServerDetails().username,
              privateKeyPath:
                reqPath + "utils/key/" + getServerDetails().key.name,
            });

            try {
              let javaResult = await conn.execCommand(
                fs.readFileSync(javaPath).toString(),
                remote
              );
              console.log("javaResult STDOUT: " + javaResult.stdout);

              let nexusResult = await conn.execCommand(
                fs.readFileSync(nexusPath).toString(),
                remote
              );
              console.log("javaResult STDOUT: " + nexusResult.stdout);

              let nexusPasswordResult = await conn.execCommand(
                "sudo cat /opt/sonatype-work/nexus3/admin.properties",
                {
                  cwd: "/home",
                }
              );
              console.log(
                "nexusPasswordResult STDOUT: " + nexusPasswordResult.stdout
              );
              console.log(
                "nexusPasswordResult stderr: " + nexusPasswordResult.stderr
              );
              setNexusInitialPassword(nexusPasswordResult.stdout);
              console.log("Completed");

              await createNexusAccount();
            } catch (error) {
              console.log("next", error);
              errorPage(res, error);
            }
          } catch (error) {
            console.log("main", error);
            errorPage(res, error);
          }
        }

        if (getSelectedTools().sonarQube) {
          const remote = {
            cwd: "/home",
          };
          const installJava = reqPath + `utils/scripts/java8.sh`;

          try {
            let conn = await ssh.connect({
              host: getServerDetails().ip,
              username: getServerDetails().username,
              privateKeyPath:
                reqPath + "utils/key/" + getServerDetails().key.name,
            });

            try {
              let javaResult = await conn.execCommand(
                fs.readFileSync(installJava).toString(),
                remote
              );
              console.log("javaResult STDOUT: " + javaResult.stdout);
            } catch (error) {
              console.log("next", error);
              errorPage(res, error);
            }
          } catch (error) {
            console.log("main", error);
            errorPage(res, error);
          }
        }
        res.render("success");
      }
    }
  );
};

const createJenkinsAccount = async () => {
  try {
    let driver = new Builder().forBrowser(Browser.CHROME).build();

    try {
      await driver.get(
        `http://${getServerDetails().ip}:${getSelectedPorts().jenkinsPort}`
      );
      await driver.manage().window().maximize();
      await driver.sleep(2000);
      let passwordElement = await driver.wait(
        until.elementLocated(By.id("security-token")),
        10000
      );
      await passwordElement.sendKeys(getJenkinsInitialPassword(), Key.RETURN);

      await driver.sleep(2000);
      await driver
        .wait(
          until.elementLocated(
            By.xpath(
              "//*[@id='main-panel']/div/div/div/div/div/div[2]/div/p[2]/a[1]"
            )
          ),
          10000
        )
        .click();
      await driver.sleep(60000);

      await driver
        .switchTo()
        .frame(driver.wait(until.elementLocated(By.id("setup-first-user"))));

      await driver
        .wait(until.elementLocated(By.id("username")), 10000)
        .sendKeys("admin");
      await driver
        .wait(until.elementLocated(By.name("password1")), 10000)
        .sendKeys("admin");
      await driver
        .wait(until.elementLocated(By.name("password2")), 10000)
        .sendKeys("admin");
      await driver
        .wait(until.elementLocated(By.name("fullname")), 10000)
        .sendKeys("admin");
      await driver
        .wait(until.elementLocated(By.name("email")), 10000)  
        .sendKeys("admin@admin.com");

      await driver.sleep(2000);

      await driver.switchTo().defaultContent();
      await driver
        .wait(
          until.elementLocated(
            By.xpath(
              "//*[@id='main-panel']/div/div/div/div/div/div[3]/button[2]"
            )
          ),
          10000
        )
        .click();

      await driver.sleep(3000);
      await driver
        .wait(
          until.elementLocated(
            By.xpath(
              "//*[@id='main-panel']/div/div/div/div/div/div[3]/button[2]"
            )
          ),
          10000
        )
        .click();
      await driver.sleep(5000);
    } catch (error) {
      console.log("findElement driver", error);
      errorPage(res, error);
    } finally {
      await driver.quit();
    }
  } catch (error) {
    console.log("driver", error);
    errorPage(res, error);
  }
};

const createNexusAccount = async () => {};

export { getInstall, postInstall };
