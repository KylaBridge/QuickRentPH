const express = require("express");
const router = express.Router();

const { changeProfile } = require("../controllers/userController");
const { requireAuth } = require("../middleware/requireAuth");

router.put("/profile/change", requireAuth, changeProfile);

module.exports = router;
