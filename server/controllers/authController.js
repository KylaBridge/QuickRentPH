const User = require("../models/user");

const { hashPassword, comparePassword } = require("../helpers/auth");
const { createToken, createTempToken, decodeToken } = require("../helpers/jwt");
const user = require("../models/user");

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
    res.status(400).json(error);
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
      decoded = decodeToken(tempToken);
    } catch (error) {
      return res.status(400).json({ error: "Invalid or Expired Token" });
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
    res.status(400).json(error);
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
      decoded = decodeToken(newTempToken);
    } catch (error) {
      return res.status(400).json({ error: "Invalid or Expired Token" });
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
    const token = createToken(newUser._id);
    const { password: pwd, ...userWithoutPassword } = newUser._doc;

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 3,
      })
      .status(200)
      .json({
        message: "Registered Successfully",
        user: userWithoutPassword,
      });
  } catch (error) {
    res.status(400).json(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const token = createToken(user._id);
    const { password: pwd, ...userWithoutPassword } = user._doc;

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 3,
      })
      .status(200)
      .json({ message: "User logged in", user: userWithoutPassword });
  } catch (error) {
    res.status(400).json(error);
  }
};

const logoutUser = (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    res.status(400).json(error);
  }
};

const profile = async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(200).json({ user: null });
    }

    const decoded = decodeToken(token);
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
  profile,
};
