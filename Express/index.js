const debug = require("debug");
const config = require("config");
const express = require("express");
const morgan = require("morgan");
const Joi = require("joi");
const helmet = require("helmet");
const courses = require("./routes/courses");
const home = require("./routes/home");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
app.use("/api/courses", courses);
app.use("/", home);

// Configuration

console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
console.log("Mail Password: " + config.get("mail.password"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan enabled...");
}

// Get - Getting Data
// Post - Creating Data
// Put - Updating Data
// Del - Deleting Data

const port = process.env.PORT || 3000; // $env:PORT = 5000, to change the value of process.env.PORT, powershell, cmd is, set PORT = 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
