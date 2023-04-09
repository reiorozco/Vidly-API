const express = require("express");
const morgan = require("morgan");
const debug = require("debug")("Log");

const genresRoute = require("../routes/GenresRoute");
const customersRoute = require("../routes/CustomersRoute");
const moviesRoute = require("../routes/MoviesRoute");
const rentalsRoute = require("../routes/RentalsRoute");
const usersRoute = require("../routes/UsersRoute");
const authRoute = require("../routes/AuthRoute");
const returnsRoute = require("../routes/ReturnsRoute");
const errorHandler = require("../middleware/error");

module.exports = function (app) {
  app.set("view engine", "pug");
  app.set("views", "./views");

  if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    debug("Morgan enabled...");
  }

  app.use(express.json());

  // Routes
  app.use("/api/genres", genresRoute);
  app.use("/api/customers", customersRoute);
  app.use("/api/movies", moviesRoute);
  app.use("/api/rentals", rentalsRoute);
  app.use("/api/users", usersRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/returns", returnsRoute);

  app.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    res.render("index", { title: "Vidly Project", message: "Vidly Movies" });
  });

  // Error Handler
  app.use(errorHandler);
};
