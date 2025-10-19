
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const paymentSchema = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  rental: {
    type: Schema.Types.ObjectId,
    ref: 'Rentals',
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rentalPeriod: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['GCash', 'PayMaya'],
    required: true,
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed', 'refunded', 'processing'],
    default: 'pending',
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  totalPaid: {
    type: Number,
    required: true,
  },
  refunded: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
