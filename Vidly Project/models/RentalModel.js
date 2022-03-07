const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { DateTime } = require("luxon");
// Joi.objectId = require("joi-objectid")(Joi);

// Schema
const rentalSchema = new Schema({
  customer: {
    type: new Schema({
      isGold: {
        type: Boolean,
        default: false,
      },
      name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 21,
      },
      phone: {
        type: String,
        required: true,
        maxLength: 50,
      },
    }),
    required: true,
  },
  movie: {
    type: new Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

// Static method
rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    "customer._id": customerId,
    "movie._id": movieId,
  });
};

// Instance method
rentalSchema.methods.returnMovie = function () {
  this.dateReturned = new Date();

  const rentalDays = DateTime.now()
    .diff(DateTime.fromJSDate(this.dateOut))
    .as("days");
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

//Model
const Rental = model("Rental", rentalSchema);

//Validate
const validateRental = (rental) => {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(rental);
};

module.exports = { rentalSchema, Rental, validate: validateRental };
