const User = require("../models/user");
const { decodeAccessToken } = require("../helpers/jwt");

const changeProfile = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    let decoded;
    try {
      decoded = decodeAccessToken(token);
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const updatedUser = await User.findByIdAndUpdate(decoded.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error updating profile" });
  }
};

module.exports = { changeProfile };
