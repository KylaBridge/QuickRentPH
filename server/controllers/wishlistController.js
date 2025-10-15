const mongoose = require("mongoose");
const User = require("../models/user");
const Item = require("../models/item");

// GET /api/wishlist/:userId/wishlist
const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure the authenticated user matches the userId param
    if (!req.userId || req.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await User.findById(userId)
      .populate({
        path: "wishlist",
        populate: { path: "owner", select: "firstName lastName username" },
      })
      .select("wishlist");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ wishlistItems: user.wishlist });
  } catch (error) {
    console.error("getUserWishlist error", error);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
};

// POST /api/wishlist/:userId/wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const { itemId } = req.body;

    // Ensure the authenticated user matches the userId param
    if (!req.userId || req.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(itemId)
    ) {
      return res.status(400).json({ error: "Invalid id(s)" });
    }

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    // Prevent adding own item
    if (item.owner && item.owner.toString() === userId) {
      return res
        .status(400)
        .json({ error: "Cannot add your own item to wishlist" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Prevent duplicates
    if (user.wishlist && user.wishlist.includes(itemId)) {
      return res.status(400).json({ error: "Item already in wishlist" });
    }

    await User.findByIdAndUpdate(userId, { $addToSet: { wishlist: itemId } });

    res.json({ message: "Item added to wishlist successfully" });
  } catch (error) {
    console.error("addToWishlist error", error);
    res.status(500).json({ error: "Failed to add item to wishlist" });
  }
};

// DELETE /api/wishlist/:userId/wishlist/:itemId
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    // Ensure the authenticated user matches the userId param
    if (!req.userId || req.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(itemId)
    ) {
      return res.status(400).json({ error: "Invalid id(s)" });
    }

    await User.findByIdAndUpdate(userId, { $pull: { wishlist: itemId } });

    res.json({ message: "Item removed from wishlist successfully" });
  } catch (error) {
    console.error("removeFromWishlist error", error);
    res.status(500).json({ error: "Failed to remove item from wishlist" });
  }
};

module.exports = {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
};
