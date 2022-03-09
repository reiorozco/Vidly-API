const express = require("express");
const router = express.Router();

const { Customer, validateCustomer } = require("../models/CustomerModel");
const validateObjectId = require("../middleware/validateObjectId");
const validate = require("../middleware/validate");

router.get("/", async (req, res) => {
  const customers = await Customer.find({}).sort({ name: "asc" });

  res.send(customers);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) return res.status(404).send("This customer wasn't found.");

  res.send(customer);
});

router.post("/", validate(validateCustomer), async (req, res) => {
  const { isGold, name, phone } = req.body;

  let customer = new Customer({
    isGold,
    name,
    phone,
  });
  customer = await customer.save();

  res.send(customer);
});

router.put(
  "/:id",
  [validateObjectId, validate(validateCustomer)],
  async (req, res) => {
    const { isGold, name, phone } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      { _id: req.params.id },
      { isGold, name, phone },
      { new: true }
    );

    if (!customer) return res.status(404).send("This customer wasn't found.");

    res.send(customer);
  }
);

router.delete("/:id", validateObjectId, async (req, res) => {
  const customer = await Customer.findByIdAndDelete({ _id: req.params.id });

  if (!customer) return res.status(404).send("This customer wasn't found.");

  res.send(customer);
});

module.exports = router;
