const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));


// step1
app.get("/", (req, res) => {
  res.render("index");
});

// step2
app.get("/version", (req, res) => {
  res.render("version");
});

// step3
app.get("/server", (req, res) => {
  res.render("server");
});

// step4
app.get("/install", (req, res) => {
  res.render("install");
});

// step5
app.get("/success", (req, res) => {
  res.render("success");
});

app.listen(port, () => {
  console.log(`Tool Automation app is listening on port ${port}`);
});
