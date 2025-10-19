const Payment = require("../models/payment");
const Rental = require("../models/rental");
const User = require("../models/user");

// Create payment record when gateway confirms payment (escrow hold)
const createPayment = async (req, res) => {
  try {
    const { requestId, paymentMethod, totalPaid, transactionId } = req.body;
    if (!requestId) return res.status(400).json({ error: "requestId is required" });

    const rental = await Rental.findById(requestId);
    if (!rental) return res.status(404).json({ error: "Rental not found" });

    // Use stored rental.cost.subtotal as the amount (owner earnings on release)
    const amount = rental.cost?.subtotal || 0;

    const txId = transactionId || `TXN-${Date.now()}-${Math.floor(Math.random()*10000)}`;

    const payment = await Payment.create({
      transactionId: txId,
      rental: rental._id,
      owner: rental.owner,
      rentalPeriod: `${rental.preferredStartDate || ''}`,
      duration: String(rental.durationOfRent || 1),
      paymentMethod: paymentMethod === 'paymaya' ? 'PayMaya' : 'GCash',
      status: 'processing', // escrow hold
      amount,
      totalPaid: Number(totalPaid) || 0,
    });

    res.status(201).json({ message: 'Payment recorded (escrow)', payment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Optional: get payments for a user (owner or renter)
const getPayments = async (req, res) => {
  try {
    const userId = req.userId;
    // Only return payments where the current user is the renter
    const payments = await Payment.find({})
      .populate({
        path: 'rental',
        select: 'renter owner item cost durationOfRent preferredStartDate',
        populate: {
          path: 'item',
          select: 'name',
        },
      });

    // Filter payments where user is the renter
    const filtered = payments.filter(
      (p) => p.rental && p.rental.renter && p.rental.renter.toString() === userId.toString()
    );
    res.status(200).json({ payments: filtered });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createPayment, getPayments };
