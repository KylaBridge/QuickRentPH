const Rental = require("../models/rental");
const Item = require("../models/item");
const mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");

// Helper to compute cost similar to frontend logic
const calculateCost = ({
  itemPrice = 0,
  duration = 1,
  deliveryOption = "pickup",
}) => {
  const subtotal = itemPrice * duration;
  const deliveryFee = deliveryOption === "delivery" ? 150 : 0; // example flat fee
  const refundableDeposit = Math.ceil(subtotal * 0.1); // 10% deposit
  const total = subtotal + deliveryFee + refundableDeposit;
  return { subtotal, deliveryFee, refundableDeposit, total };
};

const createRental = async (req, res) => {
  try {
    const renterId = req.userId;
    // Accept both item and itemId for flexibility
    const {
      item,
      itemId,
      contactName,
      email,
      completeAddress,
      addressLine1,
      city,
      stateProvince,
      preferredStartDate,
      durationOfRent,
      reasonForRenting,
      idCollectionAgreed,
      deliveryOption,
    } = req.body;

    // Support both item and itemId in request body
    const resolvedItemId = itemId || item;
    if (!resolvedItemId) return res.status(400).json({ error: "Item id is required" });

    const itemDoc = await Item.findById(resolvedItemId);
    if (!itemDoc) return res.status(404).json({ error: "Item not found" });

    // Calculate cost
    const duration = Number(durationOfRent) || 1;
    const cost = calculateCost({
      itemPrice: itemDoc.price,
      duration,
      deliveryOption,
    });

    // Instead of uploading IDs, fetch the user's stored ID images from the user model.
    const user = await require("../models/user").findById(renterId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const validId = user.idFrontImage || null;
    const selfieWithId = user.selfieImage || null;

    const rentalData = {
      item: itemDoc._id,
      renter: renterId,
      owner: itemDoc.owner,
      contactName,
      email,
      completeAddress,
      addressLine1,
      city,
      stateProvince,
      preferredStartDate: preferredStartDate
        ? new Date(preferredStartDate)
        : null,
      durationOfRent: duration,
      reasonForRenting,
      idCollectionAgreed:
        idCollectionAgreed === "true" || idCollectionAgreed === true,
      validId,
      selfieWithId,
      cost,
    };

    const rental = await Rental.create(rentalData);
    res.status(201).json({ message: "Rental request created", rental });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRentalById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Rental id is required" });

    const rental = await Rental.findById(id)
      .populate("item")
      .populate("renter", "firstName lastName email")
      .populate("owner", "firstName lastName email");

    if (!rental) return res.status(404).json({ error: "Rental not found" });

    res.status(200).json({ rental });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserRentals = async (req, res) => {
  try {
    const userId = req.userId;
    const rentals = await Rental.find({ renter: userId })
      .populate("item")
      .populate("owner", "firstName lastName");
    res.status(200).json({ rentals });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get rental requests for items owned by the current user (for Reserved tab)
const getOwnerRentals = async (req, res) => {
  try {
    const userId = req.userId;
    const rentals = await Rental.find({ owner: userId })
      .populate("item")
      .populate("renter", "firstName lastName email phone createdAt");
    res.status(200).json({ rentals });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Mark a rental as cancelled. Allowed by the renter or the owner.
const cancelRental = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    if (!id) return res.status(400).json({ error: "Rental id is required" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid rental id" });

    const rental = await Rental.findById(id);
    if (!rental) return res.status(404).json({ error: "Rental not found" });

    // Only renter or owner can cancel
    const renterId = rental.renter ? rental.renter.toString() : null;
    const ownerId = rental.owner ? rental.owner.toString() : null;
    if (renterId !== userId.toString() && ownerId !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to cancel this rental" });
    }

    rental.status = "cancelled";
    await rental.save();

    res.status(200).json({ message: "Rental cancelled", rental });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a rental. Enforce permissions: renter can delete only when cancelled; owner can delete any.
const deleteRental = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    if (!id) return res.status(400).json({ error: "Rental id is required" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid rental id" });

    const rental = await Rental.findById(id);
    if (!rental) return res.status(404).json({ error: "Rental not found" });

    const renterId = rental.renter ? rental.renter.toString() : null;
    const ownerId = rental.owner ? rental.owner.toString() : null;
    const isRenter = renterId === userId.toString();
    const isOwner = ownerId === userId.toString();

    if (isOwner) {
      // delete associated ID files if present
      const idDir = path.join(__dirname, "..", "user_ids");
      const removeIfInIdDir = async (filePath) => {
        if (!filePath) return;
        try {
          const resolved = path.resolve(filePath);
          const idDirResolved = path.resolve(idDir);
          if (!resolved.startsWith(idDirResolved)) return; // safety
          await fs.unlink(resolved);
        } catch (e) {
          // ignore missing files or permission errors
        }
      };

      await Promise.all([
        removeIfInIdDir(rental.validId),
        removeIfInIdDir(rental.selfieWithId),
        removeIfInIdDir(rental.proofOfBilling),
      ]);

      // Use deleteOne on the document (supported) to remove the rental
      await rental.deleteOne();
      return res.status(200).json({ message: "Rental deleted by owner" });
    }

    // renter can delete only if it's cancelled
    if (isRenter) {
      if (rental.status !== "cancelled") {
        return res
          .status(403)
          .json({ error: "Cannot delete active rental. Cancel first." });
      }
      // delete associated ID files if present (same safety)
      const idDir = path.join(__dirname, "..", "user_ids");
      const removeIfInIdDir = async (filePath) => {
        if (!filePath) return;
        try {
          const resolved = path.resolve(filePath);
          const idDirResolved = path.resolve(idDir);
          if (!resolved.startsWith(idDirResolved)) return; // safety
          await fs.unlink(resolved);
        } catch (e) {
          // ignore missing files or permission errors
        }
      };

      await Promise.all([
        removeIfInIdDir(rental.validId),
        removeIfInIdDir(rental.selfieWithId),
        removeIfInIdDir(rental.proofOfBilling),
      ]);

      await rental.deleteOne();
      return res.status(200).json({ message: "Rental deleted" });
    }

    return res
      .status(403)
      .json({ error: "Not authorized to delete this rental" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateRentalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const userId = req.userId;

    if (!id) return res.status(400).json({ error: "Rental id is required" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid rental id" });

    const rental = await Rental.findById(id).populate("item");
    if (!rental) return res.status(404).json({ error: "Rental not found" });

    // Allow both owner and renter to update status as long as they are involved in the rental
    let isOwner = rental.item.owner.toString() === userId.toString();
    let isRenter = rental.renter.toString() === userId.toString();
    if (!isOwner && !isRenter) {
      return res.status(403).json({ error: "Not authorized to update this rental" });
    }

    const validStatuses = [
      "pending",
      "approved",
      "rejected",
      "cancelled",
      "paid",
      "shipped",
      "received",
      "shipping_for_return",
      "returned_to_owner"
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    rental.status = status;
    if (reason) {
      rental.rejectionReason = reason;
    }
    // Set approval/payment dates
    if (status === "approved") {
      rental.approvedAt = new Date();
    }
    if (status === "paid") {
      rental.paidAt = new Date();
    }

    await rental.save();

    // Update item availability based on rental status
    try {
      const itemId = rental.item?._id || rental.item;
      if (status === "approved" && itemId) {
        // Mark item as rented out
        await Item.findByIdAndUpdate(itemId, { availability: "Rented Out" });
      } else if ((status === "cancelled" || status === "rejected") && itemId) {
        // Only set item back to Available if there are no other approved rentals
        const otherApproved = await Rental.findOne({
          item: itemId,
          status: "approved",
          _id: { $ne: rental._id },
        });
        if (!otherApproved) {
          await Item.findByIdAndUpdate(itemId, { availability: "Available" });
        }
      }
      // If the rental is marked as received, release escrow: mark payment completed and credit owner
      if (status === "received") {
        const Payment = require("../models/payment");
        const User = require("../models/user");
        // Find payment(s) associated with this rental that are processing
        const payments = await Payment.find({ rental: rental._id, status: "processing" });
        for (const p of payments) {
          p.status = "completed";
          await p.save();
          try {
            // credit owner's earnings by payment.amount
            const owner = await User.findById(p.owner);
            if (owner) {
              owner.earnings = (owner.earnings || 0) + (p.amount || 0);
              await owner.save();
            }
          } catch (e) {
            console.error("Failed to credit owner earnings:", e?.message || e);
          }
        }
      }
      // If the rental is marked as returned_to_owner, set item availability to Available
      if (status === "returned_to_owner" && itemId) {
        await Item.findByIdAndUpdate(itemId, { availability: "Available" });
      }
    } catch (e) {
      // Log but don't fail the request
      console.error("Failed to update item availability:", e?.message || e);
    }

    res.status(200).json({ message: "Rental status updated", rental });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createRental,
  getRentalById,
  getUserRentals,
  getOwnerRentals,
  cancelRental,
  deleteRental,
  updateRentalStatus,
};
