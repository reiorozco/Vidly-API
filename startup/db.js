const mongoose = require("mongoose");
const logger = require("winston");
const config = require("../config/config");

module.exports = function () {
  const db = config.DB;
  // Open a connection
  mongoose.connect(db).then(() => logger.info(`Connected to MongoDB...`));
  // .catch((err) => logger.error(new Error(err)));
};
