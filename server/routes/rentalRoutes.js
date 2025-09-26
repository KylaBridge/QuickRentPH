const express = require("express");
const router = express.Router();

const upload = require("../helpers/multer");
const { addItem } = require("../controllers/rentalController");

router.post("/addItem", upload.array("images", 5), addItem);

module.exports = router;
