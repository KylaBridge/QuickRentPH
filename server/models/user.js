const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    default: "First Name",
  },
  lastName: {
    type: String,
    required: true,
    default: "Last Name",
  },
  birthDate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Users", userSchema);
