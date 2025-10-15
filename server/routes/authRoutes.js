const express = require("express");
const passport = require("passport");
const router = express.Router();
const { createAccessToken, createRefreshToken } = require("../helpers/jwt");

const {
  registerEmail,
  registerPassword,
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  profile,
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/requireAuth");

router.post("/login", loginUser);
router.post("/register/email", registerEmail);
router.post("/register/password", registerPassword);
router.post("/register", registerUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.get("/profile", requireAuth, profile);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth` }),
  (req, res) => {
    // req.user is set by passport verify callback
    const user = req.user;
    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 30,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      // redirect to frontend (dashboard or a dedicated oauth success page)
      .redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

module.exports = router;
