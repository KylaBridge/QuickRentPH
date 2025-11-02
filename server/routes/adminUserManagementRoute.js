const express = require("express");
const router = express.Router();
const adminUserManagement = require("../controllers/adminUserManagement");

// Get all users
router.get("/user", adminUserManagement.getAllUsers);
// Delete user by ID
router.delete("/user/:id", adminUserManagement.deleteUser);

module.exports = router;
