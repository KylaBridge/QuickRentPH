const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
  item: {
    type: Schema.Types.ObjectId,
    ref: "Items",
    required: true,
  },
  renter: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  contactName: { type: String },
  phone: { type: String },
  email: { type: String },
  completeAddress: { type: String },
  addressLine1: { type: String },
  city: { type: String },
  stateProvince: { type: String },
  preferredStartDate: { type: Date },
  durationOfRent: { type: Number, default: 1 },
  reasonForRenting: { type: String },
  idCollectionAgreed: { type: Boolean, default: false },
  validId: { type: String },
  selfieWithId: { type: String },
  proofOfBilling: { type: String },
  cost: {
    subtotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    refundableDeposit: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  status: {
    type: String,
    enum: [
      "pending",
      "approved",
      "rejected",
      "cancelled",
      "paid",
      "shipped",
      "received",
      "shipping_for_return",
      "returned_to_owner"
    ],
    default: "pending",
  },
  approvedAt: { type: Date },
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Rentals", rentalSchema);
