const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/requireAuth");
const {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

// GET wishlist for a user
router.get("/:userId/wishlist", requireAuth, getUserWishlist);

// Add item to wishlist
router.post("/:userId/wishlist", requireAuth, addToWishlist);

// Remove item from wishlist
router.delete("/:userId/wishlist/:itemId", requireAuth, removeFromWishlist);

module.exports = router;
