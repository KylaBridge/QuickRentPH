const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const {
  createTempToken,
  createAccessToken,
  createRefreshToken,
  decodeTempToken,
  decodeRefreshToken,
} = require("../helpers/jwt");

const { sendVerificationEmail } = require("../nodemailer");
const crypto = require("crypto");

function generate6DigitCode() {
  // Use crypto for secure random code
  return crypto.randomInt(100000, 1000000).toString();
}

const registerEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        error: "This email is already tied to an existing QuickRent account.",
      });
    }

    // Generate verification code
    const code = generate6DigitCode();
    // Store code in temp token
    const tempToken = createTempToken({ email, code });
    await sendVerificationEmail(email, code);
    res.status(200).json({ message: "Email Created", tempToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Send verification code to email using nodemailer.js
// No longer needed: sendVerificationCode only sends email, does not create user

const registerPassword = async (req, res) => {
  try {
    const { password, tempToken } = req.body;

    if (!tempToken) {
      return res.status(400).json({
        error: "Invalid, No Token",
      });
    }

    let decoded;
    try {
      decoded = decodeTempToken(tempToken);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Invalid or Expired Token, Register Your Email Again" });
    }
    const email = decoded.email;
    const code = decoded.code;

    if (password.length < 10) {
      return res
        .status(400)
        .json({ error: "Password needs to be at least 10 characters" });
    }

    const hashedPassword = await hashPassword(password);
    // Store hashed password in temp token
    const newTempToken = createTempToken({
      email,
      password: hashedPassword,
      code,
    });

    // Resend verification code to email (if needed)
    await sendVerificationEmail(email, code);

    res.status(200).json({
      message: "Password created. Verification code sent to email.",
      newTempToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Verify 6-digit code (no user in DB yet)
const verifyCode = async (req, res) => {
  try {
    const { code, newTempToken } = req.body;
    if (!newTempToken) return res.status(400).json({ error: "No token" });
    let decoded;
    try {
      decoded = decodeTempToken(newTempToken);
    } catch (error) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    const email = decoded.email;
    const expectedCode = decoded.code;
    if (!expectedCode)
      return res.status(400).json({ error: "No code sent. Please resend." });
    if (expectedCode !== code)
      return res.status(400).json({ error: "Invalid code." });
    // Mark email verified in temp token
    const verifiedTempToken = createTempToken({
      email,
      password: decoded.password,
      code: null,
      isEmailVerified: true,
    });
    res.status(200).json({ message: "Email verified.", verifiedTempToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Resend code (just send email again)
const resendCode = async (req, res) => {
  try {
    const { newTempToken } = req.body;
    if (!newTempToken) return res.status(400).json({ error: "No token" });
    let decoded;
    try {
      decoded = decodeTempToken(newTempToken);
    } catch (error) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    const email = decoded.email;
    const code = decoded.code;
    if (!code) return res.status(400).json({ error: "No code to resend." });
    await sendVerificationEmail(email, code);
    res.status(200).json({ message: "Verification code resent." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, birthDate, gender, newTempToken } = req.body;

    if (!newTempToken) {
      return res.json({
        error: "Invalid, No Token",
      });
    }

    let decoded;
    try {
      decoded = decodeTempToken(newTempToken);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Invalid or Expired Token, Try Again" });
    }
    const email = decoded.email;
    const password = decoded.password;
    const isEmailVerified = decoded.isEmailVerified;

    // Validate required profile fields
    if (!firstName || String(firstName).trim() === "")
      return res.status(400).json({ error: "First name is required" });
    if (!lastName || String(lastName).trim() === "")
      return res.status(400).json({ error: "Last name is required" });
    if (!birthDate) return res.status(400).json({ error: "Birth date is required" });
    if (!gender) return res.status(400).json({ error: "Gender is required" });

    // Only create user if email is verified
    if (!isEmailVerified) {
      return res.status(400).json({ error: "Email not verified. Please verify your email." });
    }

    // Check if user already exists (should not happen)
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists." });
    }

    // Create user
    user = new User({
      email,
      password,
      firstName,
      lastName,
      birthDate,
      gender,
      isEmailVerified: true,
    });
    await user.save();
    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });
    const { password: pwd, ...userWithoutPassword } = user._doc;

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
      .status(200)
      .json({
        message: "Registered Successfully",
        user: userWithoutPassword,
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email is not registered" });
    }

    // If user registered with Google, block password login and show message
    if (user.provider === 'google') {
      return res.status(400).json({ error: "This email is registered with Google. Please use 'Continue with Google' to log in." });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });
    const { password: pwd, ...userWithoutPassword } = user._doc;

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
      .status(200)
      .json({ message: "User logged in", user: userWithoutPassword });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logoutUser = (req, res) => {
  try {
    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const refreshToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Invalid, no refresh token" });
    }

    let decoded;
    try {
      decoded = decodeRefreshToken(refreshToken);
    } catch (error) {
      return res.status(200).json({ error: "Expired Refresh Token" });
    }

    const newAccessToken = createAccessToken({ id: decoded.id });

    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 30,
      })
      .status(200)
      .json({ message: "Access Token Created" });
  } catch {
    res.status(400).json({ error: error.message });
  }
};

const profile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Server error fetching profile" });
  }
};

module.exports = {
  registerEmail,
  registerPassword,
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  profile,
  verifyCode,
  resendCode,
};
