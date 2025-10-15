const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/requireAuth");
const {
  createRental,
  getRentalById,
  getUserRentals,
  cancelRental,
  deleteRental,
} = require("../controllers/rentalController");
const { idUpload } = require("../helpers/multer");

// Accept multipart form-data for ID uploads. Fields are optional.
const uploadFields = idUpload.fields([
  { name: "validId", maxCount: 1 },
  { name: "selfieWithId", maxCount: 1 },
  { name: "proofOfBilling", maxCount: 1 },
]);

router.post("/", requireAuth, uploadFields, createRental);
router.get("/", requireAuth, getUserRentals);
router.get("/:id", requireAuth, getRentalById);
router.patch("/:id/cancel", requireAuth, cancelRental);
router.delete("/:id", requireAuth, deleteRental);

module.exports = router;
