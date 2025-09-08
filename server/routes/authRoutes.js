const express = require("express");
const router = express.Router();

const {
  registerEmail,
  registerPassword,
  loginUser,
} = require("../controllers/authController");

router.post("/login", loginUser);
router.post("/register/email", registerEmail);
router.post("/register/password", registerPassword);

module.exports = router;
