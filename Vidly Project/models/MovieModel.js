const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { genreSchema } = require("./GenreModel");

// Schema
const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 255,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

// Model
const Movie = model("Movie", movieSchema);

// Validate
const validateMovie = (movie) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });

  return schema.validate(movie);
};

module.exports = { movieSchema, Movie, validate: validateMovie };
