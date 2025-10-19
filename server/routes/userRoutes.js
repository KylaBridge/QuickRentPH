const express = require("express");
const router = express.Router();

const { changeProfile, verifyAccount } = require("../controllers/userController");
const { idUpload } = require("../helpers/multer");
const { requireAuth } = require("../middleware/requireAuth");

router.put("/profile/change", requireAuth, changeProfile);
router.post("/verify", requireAuth, idUpload.fields([
  { name: "idFrontImage", maxCount: 1 },
  { name: "idBackImage", maxCount: 1 },
  { name: "selfieImage", maxCount: 1 },
]), verifyAccount);

module.exports = router;
