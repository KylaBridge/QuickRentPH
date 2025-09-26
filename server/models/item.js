const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  dealOption: {
    type: String,
    enum: [
      "Standard Delivery",
      "Express",
      "Scheduled Delivery",
      "Drop-Off Point",
      "Return",
    ],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  includedAccessories: {
    type: String,
  },
  downpayment: {
    type: Number,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  deliveryOptions: {
    type: String,
    enum: [
      "Standard Delivery",
      "Express",
      "Scheduled Delivery",
      "Drop-Off Point",
      "Return",
    ],
    required: true,
  },
  availability: {
    type: String,
    enum: ["Availability", "Available", "Unavailable", "Rented Out"],
    default: "Available",
    required: true,
  },
});

module.exports = mongoose.model("Items", itemSchema);
