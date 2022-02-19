const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const debug = require("debug")("Log");
const mongoose = require("mongoose");

const config = require("./config/config");
const genresRoute = require("./routes/GenresRoute");
const customersRoute = require("./routes/CustomersRoute");

const app = express();

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

app.get("/", (req, res) => {
  res.render("index", { title: "My Express App", message: "Hello" });
});

// const port = process.env.PORT || 3000;
app.listen(config.PORT, config.HOST, () =>
  console.log(
    `NODE_ENV=${config.NODE_ENV}\nApp listening on http://${config.HOST}:${config.PORT}`
  )
);
