const express = require("express");
const router = express.Router();

// Login user
router.post("/login", (req, res) => {
  console.log("User logs in");
  res.json({ message: "Sign me in ma nigga" });
});

// Register user
router.post("/register", (req, res) => {
  console.log("Registers the user");
  res.json({ message: "Sign me up ma nigga" });
});

module.exports = router;
