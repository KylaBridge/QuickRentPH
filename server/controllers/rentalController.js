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
    const {
      item: itemId,
      contactName,
      phone,
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

    if (!itemId) return res.status(400).json({ error: "Item id is required" });

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    // Calculate cost
    const duration = Number(durationOfRent) || 1;
    const cost = calculateCost({
      itemPrice: item.price,
      duration,
      deliveryOption,
    });

    // Handle uploaded id files (optional)
    const files = req.files || {};
    const validId = files.validId ? files.validId[0].path : null;
    const selfieWithId = files.selfieWithId ? files.selfieWithId[0].path : null;
    const proofOfBilling = files.proofOfBilling
      ? files.proofOfBilling[0].path
      : null;

    const rentalData = {
      item: item._id,
      renter: renterId,
      owner: item.owner,
      contactName,
      phone,
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
      proofOfBilling,
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

    // Only the item owner can update rental status
    if (rental.item.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this rental" });
    }

    // Valid status transitions
    const validStatuses = [
      "pending_review",
      "approved",
      "rejected",
      "in_progress",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    rental.status = status;
    if (reason) {
      rental.rejectionReason = reason;
    }

    await rental.save();

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
