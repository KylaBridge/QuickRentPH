const User = require("../models/user");
const jwt = require("jsonwebtoken");

const { hashPassword, comparePassword } = require("../helpers/auth");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "3d" });
};

const createTempToken = (email) => {
  return jwt.sign({ email }, process.env.SECRET, { expiresIn: "5m" });
};

const decodeTempToken = (tempToken) => {
  try {
    return jwt.verify(tempToken, process.env.SECRET);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const registerEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ error: "Email Already Exists" });
    }

    const tempToken = createTempToken(email);
    res.status(200).json({ message: "Email Created", tempToken });
  } catch (error) {
    res.status(400).json(error);
  }
};

const registerPassword = async (req, res) => {
  try {
    const { password, tempToken } = req.body;

    if (!tempToken) {
      return res.json({
        error: "Invalid, No Token",
      });
    }

    let decoded;
    try {
      decoded = decodeTempToken(tempToken);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          error: "Email expired, Please Register again",
        });
      }
      return res.status(400).json({ error: "Invalid Token" });
    }
    const email = decoded.email;

    if (password.length < 8) {
      return res.json({ error: "Password needs to be at least 8 characters" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ email, password: hashedPassword });
    const token = createToken(newUser._id);

    res.status(200).json({
      message: "Registration Successful",
      newUser,
      token,
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
      return res.status(200).json({ error: "Invalid Credentials" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).json({ message: "Invalid Credentials" });
    }

    const token = createToken(user._id);

    return res.status(200).json({ message: "User logged in", user, token });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = { registerEmail, registerPassword, loginUser };
