const express = require("express");
const router = express.Router();

const {
  registerEmail,
  registerPassword,
  registerUser,
  loginUser,
  logoutUser,
  profile,
} = require("../controllers/authController");

router.post("/login", loginUser);
router.post("/register/email", registerEmail);
router.post("/register/password", registerPassword);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.get("/profile", profile);

module.exports = router;
