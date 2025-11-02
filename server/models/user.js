const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  verificationCode: {
    type: String,
    default: null,
  },
  codeExpiresAt: {
    type: Date,
    default: null,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  idType: {
    type: String,
    default: null,
  },
  idFrontImage: {
    type: String,
    default: null,
  },
  idBackImage: {
    type: String,
    default: null,
  },
  selfieImage: {
    type: String,
    default: null,
  },
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
  role: {
    type: String,
    default: "user",
    required: true,
  },
  provider: {
    type: String,
    default: "local",
    required: true,
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
  earnings: {
    type: Number,
    default: 0,
  },
  // Wishlist: array of Item ObjectId references
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Items",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Users", userSchema);
