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
  username: {
    type: String,
    default: null,
    unique: true,
  },
  birthDate: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
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
  mobileNumber: {
    type: String,
    trim: true,
    match: [/^09\d{9}$/, "Invalid Philippine mobile number"],
    default: null,
  },
});

module.exports = mongoose.model("Users", userSchema);
