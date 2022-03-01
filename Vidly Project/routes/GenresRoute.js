const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
// const asyncMiddleware = require("../middleware/async");

// With Mongoose, everything is derived from a Schema
const { Genre, validate } = require("../models/GenreModel");

// // Compiling our schema into a Model (Collection = Table in SQL)
// const Genre = mongoose.model("Genre", genreSchema);

// const genres = [
//   { id: 1, name: "Action" },
//   { id: 2, name: "Horror" },
//   { id: 3, name: "Romance" },
// ];

router.get("/", async (req, res) => {
  // throw new Error("Could not get the genres.");

  const genres = await Genre.find({}).sort({ name: "asc" });
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.find({ _id: req.params.id });
  // const genre = genres.find((c) => c.id === parseInt(req.params.id));

  if (!genre) return res.status(404).send("This genre wasn't found.");
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error, value } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name,
  });
  genre = await genre.save();
  // const genre = {
  //   id: genres.length + 1,
  //   name: req.body.name,
  // };
  // genres.push(genre);

  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error, value } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    { _id: req.params.id },
    { name: req.body.name },
    { new: true }
  );
  // const genre = genres.find((c) => c.id === parseInt(req.params.id));

  if (!genre) return res.status(404).send("This genre wasn't found.");

  // genre.name = req.body.name;

  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete({ _id: req.params.id });
  // const genre = genres.find((c) => c.id === parseInt(req.params.id));

  if (!genre) return res.status(404).send("This genre wasn't found.");

  // const index = genres.indexOf(genre);
  // genres.splice(index, 1);

  res.send(genre);
});

module.exports = router;
