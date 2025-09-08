const User = require("../models/user");

const { hashPassword, comparePassword } = require("../helpers/auth");
const {
  createToken,
  createTempToken,
  decodeTempToken,
} = require("../helpers/jwt");

const registerEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ error: "Email Already Exists" });
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
      return res.json({
        error: "Invalid, No Token",
      });
    }

    let decoded;
    try {
      decoded = decodeTempToken(tempToken);
    } catch (error) {
      return res.status(400).json({ error: "Invalid or Expired Token" });
    }
    const email = decoded.email;

    if (password.length < 10) {
      return res.json({ error: "Password needs to be at least 10 characters" });
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
      decoded = decodeTempToken(newTempToken);
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

    res.status(200).json({
      message: "Registered Successfully",
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

module.exports = { registerEmail, registerPassword, registerUser, loginUser };
