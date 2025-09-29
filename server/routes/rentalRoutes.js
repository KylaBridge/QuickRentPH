const express = require("express");
const router = express.Router();

const upload = require("../helpers/multer");
const { requireAuth } = require("../middleware/requireAuth");
const {
  getAllItems,
  getUserItems,
  addItem,
  deleteItem,
  updateItem,
} = require("../controllers/rentalController");

router.get("/items/all", getAllItems);
router.get("/items", requireAuth, getUserItems);
router.post("/items", requireAuth, upload.array("images", 5), addItem);
router.put("/items/:id", requireAuth, upload.array("images", 5), updateItem);
router.delete("/items/:id", requireAuth, deleteItem);

module.exports = router;
