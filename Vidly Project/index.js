const express = require("express");
const app = express();
const config = require("./config/config");
const logger = require("winston");

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

app.listen(config.PORT, config.HOST, () =>
  logger.info(
    `NODE_ENV=${config.NODE_ENV}\nApp listening on http://${config.HOST}:${config.PORT}`
  )
);
