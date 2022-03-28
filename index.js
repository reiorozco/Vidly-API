const express = require("express");
const app = express();
const config = require("./config/config");
const logger = require("winston");

if (config.NODE_ENV === "production") {
  require("./startup/prod")(app);
}
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const server = app.listen(process.env.PORT, process.env.HOST, () =>
  logger.info(
    `NODE_ENV=${process.env.NODE_ENV}\nApp listening on http://${process.env.HOST}:${process.env.PORT}`
  )
);

module.exports = server;
