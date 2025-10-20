const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/requireAuth");
const {
  createRental,
  getRentalById,
  getUserRentals,
  getOwnerRentals,
  cancelRental,
  deleteRental,
  updateRentalStatus,
} = require("../controllers/rentalController");

router.post("/", requireAuth, createRental);
router.get("/", requireAuth, getUserRentals);
router.get("/owner", requireAuth, getOwnerRentals);
router.get("/:id", requireAuth, getRentalById);
router.patch("/:id/status", requireAuth, updateRentalStatus);
router.patch("/:id/cancel", requireAuth, cancelRental);
router.delete("/:id", requireAuth, deleteRental);

module.exports = router;
