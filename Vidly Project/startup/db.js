const mongoose = require("mongoose");
const logger = require("winston");

module.exports = function () {
  // Open a connection
  mongoose
    .connect("mongodb://localhost/vidly")
    .then(() => logger.info("Connected to MongoDB..."));
  // .catch((err) => logger.error(new Error(err)));
};
