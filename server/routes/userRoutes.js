const express = require("express");
const router = express.Router();

const { changeProfile } = require("../controllers/userController");

router.put("/profile/change", changeProfile);

module.exports = router;
