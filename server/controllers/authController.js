const User = require("../models/user");
const jwt = require("jsonwebtoken");

const { hashPassword, comparePassword } = require("../helpers/auth");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ email });

    if (exists) {
      return res.json({ error: "Email already exists" });
    }
    if (password.length < 6) {
      return res.json({ error: "Password must be over 6 characters" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ email, password: hashedPassword });

    const token = createToken(newUser._id);

    res.status(200).json({
      message: "Registered Successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const loginUser = async (req, res) => {
  try {
    // continue here
  } catch (error) {
    res.json(error);
  }
};

module.exports = { registerUser, loginUser };
