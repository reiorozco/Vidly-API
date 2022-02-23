const { Schema, model } = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const config = require("../config/config");

const userSchema = new Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 30,
    required: true,
  },
  email: {
    type: String,
    minLength: 5,
    maxLength: 255,
    unique: true,
  },
  password: {
    type: String,
    minLength: 3,
    maxLength: 1026,
    required: true,
  },
  isAdmin: Boolean,
});

// Auth Token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.JWT_PRIVATE_KEY
  );
};

// Model
const User = model("User", userSchema);

// Validate
function userValidate(user) {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  return schema.validate(user);
}

module.exports = { userSchema, User, validate: userValidate };
