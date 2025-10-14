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
} = require("../controllers/itemController");

router.get("/all", getAllItems);
router.get("/", requireAuth, getUserItems);
router.post("/", requireAuth, upload.array("images", 5), addItem);
router.put("/:id", requireAuth, upload.array("images", 5), updateItem);
router.delete("/:id", requireAuth, deleteItem);

module.exports = router;
