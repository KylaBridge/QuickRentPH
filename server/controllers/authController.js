const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const {
  createTempToken,
  createAccessToken,
  createRefreshToken,
  decodeTempToken,
  decodeAccessToken,
  decodeRefreshToken,
} = require("../helpers/jwt");

const registerEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        error: "This email is already tied to an existing QuickRent account.",
      });
    }

    const tempToken = createTempToken({ email });
    res.status(200).json({ message: "Email Created", tempToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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

    if (password.length < 10) {
      return res
        .status(400)
        .json({ error: "Password needs to be at least 10 characters" });
    }

    const hashedPassword = await hashPassword(password);
    const newTempToken = createTempToken({
      email,
      password: hashedPassword,
    });

    res.status(200).json({
      message: "Password created",
      newTempToken,
    });
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

    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName,
      birthDate,
      gender,
    });
    const accessToken = createAccessToken({ id: newUser._id });
    const refreshToken = createRefreshToken({ id: newUser._id });
    const { password: pwd, ...userWithoutPassword } = newUser._doc;

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
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(200).json({ user: null });
    }

    const decoded = decodeAccessToken(token);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(200).json({ user: null });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(200).json({ user: null });
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
};
