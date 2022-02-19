const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { customerSchema, validate } = require("../models/CustomerModel");

// Model
const Customer = mongoose.model("customer", customerSchema);

router.get("/", async (req, res) => {
  const customer = await Customer.find({}).sort({ name: "asc" });

  res.send(customer);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.find({ _id: req.params.id });

  if (!customer) return res.status(404).send("This customer wasn't found.");
  res.send(customer);
});

router.post("/", async (req, res) => {
  const { error, value } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { isGold, name, phone } = req.body;

  let customer = new Customer({
    isGold,
    name,
    phone,
  });
  customer = await customer.save();

  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error, value } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const { isGold, name, phone } = req.body;

  const customer = await Customer.findByIdAndUpdate(
    { _id: req.params.id },
    { isGold, name, phone },
    { new: true }
  );

  if (!customer) return res.status(404).send("This customer wasn't found.");

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete({ _id: req.params.id });

  if (!customer) return res.status(404).send("This customer wasn't found.");

  res.send(customer);
});

module.exports = router;
