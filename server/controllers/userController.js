const User = require("../models/user");

const changeProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { username, mobileNumber, firstName, lastName } = req.body;

    // Validate required fields if they are being updated
    if (typeof firstName !== "undefined") {
      if (!firstName || String(firstName).trim() === "")
        return res.status(400).json({ error: "First name is required" });
    }
    if (typeof lastName !== "undefined") {
      if (!lastName || String(lastName).trim() === "")
        return res.status(400).json({ error: "Last name is required" });
    }

    // Validate mobile number format when provided
    if (typeof mobileNumber !== "undefined" && mobileNumber) {
      if (!/^09\d{9}$/.test(mobileNumber)) {
        return res.status(400).json({ error: "Mobile number must be in format 09XXXXXXXXX" });
      }
    }

    // Check username uniqueness
    if (typeof username !== "undefined" && username) {
      const existing = await User.findOne({ username });
      if (existing && existing._id.toString() !== userId) {
        return res.status(400).json({ error: "Username is already taken" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    res.status(500).json({ error: "Server error updating profile" });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Accepts: idType, idFrontImage, idBackImage, selfieImage (images as file paths or URLs)
    const { idType } = req.body;
    const idFrontImage = req.files?.idFrontImage?.[0]?.path || req.body.idFrontImage;
    const idBackImage = req.files?.idBackImage?.[0]?.path || req.body.idBackImage;
    const selfieImage = req.files?.selfieImage?.[0]?.path || req.body.selfieImage;

    // Basic validation
    if (!idType || !idFrontImage) {
      return res.status(400).json({ error: "ID type and front image are required" });
    }

    // Update user
    const update = {
      idType,
      idFrontImage,
      idBackImage,
      selfieImage,
      isVerified: true,
    };
    const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true, runValidators: true }).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Account verified", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error verifying account" });
  }
};

module.exports = { changeProfile, verifyAccount };
