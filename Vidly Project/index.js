require("express-async-errors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const debug = require("debug")("Log");
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { format, transports } = require("winston");

const errorHandler = require("./middleware/error");
const logger = require("./logger");
require("winston-mongodb");

const config = require("./config/config");
const genresRoute = require("./routes/GenresRoute");
const customersRoute = require("./routes/CustomersRoute");
const moviesRoute = require("./routes/MoviesRoute");
const rentalsRoute = require("./routes/RentalsRoute");
const usersRoute = require("./routes/UsersRoute");
const authRoute = require("./routes/AuthRoute");

const app = express();

// Logger
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    logger.add(
      new transports.MongoDB({
        db: "mongodb://localhost/vidly",
        options: {
          useUnifiedTopology: true,
        },
      })
    )
  );
}

// Json Web Token
if (!config.JWT_PRIVATE_KEY) {
  console.error("FATAL ERROR: jwtPrivateKey isn't defined.");
  process.exit(1);
}

// Open a connection
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Couldn't connect to MongoDB...", err));

app.set("view engine", "pug");
app.set("views", "./views");

app.use(helmet());

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

app.get("/", (req, res) => {
  res.render("index", { title: "My Express App", message: "Hello" });
});

// Error Handler
app.use(errorHandler);

// const port = process.env.PORT || 3000;
app.listen(config.PORT, config.HOST, () =>
  console.log(
    `NODE_ENV=${config.NODE_ENV}\nApp listening on http://${config.HOST}:${config.PORT}`
  )
);
