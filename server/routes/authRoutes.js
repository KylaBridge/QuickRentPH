const express = require("express");
const router = express.Router();

const {
  registerEmail,
  registerPassword,
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  profile,
} = require("../controllers/authController");

router.post("/login", loginUser);
router.post("/register/email", registerEmail);
router.post("/register/password", registerPassword);
router.post("/register", registerUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.get("/profile", profile);

module.exports = router;
