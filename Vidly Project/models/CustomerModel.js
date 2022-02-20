const { Schema, model } = require("mongoose");
const Joi = require("joi");

// Schema
const customerSchema = new Schema({
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
    validate: {
      validator: function (v) {
        return /^\d+$/.test(v) && v.length === 10;
      },
      message: (props) =>
        `${props.value} should have only numbers and ten digits. `,
    },
  },
});

// Model
const Customer = model("customer", customerSchema);

// Validate
const validateCustomer = (customer) => {
  const schema = Joi.object({
    isGold: Joi.boolean(),
    name: Joi.string().min(3).max(21).required(),
    phone: Joi.string().length(10).required(),
  });

  return schema.validate(customer);
};

module.exports = { customerSchema, Customer, validate: validateCustomer };
