const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  specifications: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    enum: ["Available", "Unavailable", "Rented Out"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

module.exports = mongoose.model("Items", itemSchema);
