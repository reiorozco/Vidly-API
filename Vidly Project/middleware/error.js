const logger = require("../logger");

module.exports = function (err, req, res, next) {
  // if (res.headersSent) {
  //   return next(err);
  // }

  logger.error(new Error(err));

  res.status(500).send("Something failed.");
  // res.render("error", { error: err });
};
