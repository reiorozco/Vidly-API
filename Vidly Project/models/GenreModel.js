const { Schema, model } = require("mongoose");
const Joi = require("joi");

// Schema
const genreSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 21,
    unique: true,
  },
});

// Model
const Genre = model("Genre", genreSchema);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(genre);
}

module.exports = { genreSchema, Genre, validate: validateGenre };
