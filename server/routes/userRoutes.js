const express = require("express");
const router = express.Router();

const { changeCredentials } = require("../controllers/userController");

router.post("/profile/change", changeCredentials);

module.exports = router;
