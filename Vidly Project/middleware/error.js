module.exports = function (err, req, res, next) {
  // if (res.headersSent) {
  //   return next(err);
  // }
  res.status(500).send("Something failed.");
  res.render("error", { error: err });
};
