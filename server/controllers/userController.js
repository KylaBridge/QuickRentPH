const User = require("../models/user");
const { decodeAccessToken } = require("../helpers/jwt");

const changeCredentials = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const {
      firstName,
      lastName,
      userName,
      mobileNumber,
      email,
      gender,
      birthDate,
    } = req.body;

    let decoded;
    try {
      decoded = decodeAccessToken(accessToken);
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized User" });
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({ error: "Invalid Email" });
    }
    if (!/^09\d{9}$/.test(mobileNumber)) {
      return res.status(400).json({ error: "Invalid PH Phone Number" });
    }

    const user = await User.put({
      firstName,
      lastName,
      userName,
      mobileNumber,
      email,
      gender,
      birthDate,
    });

    res.status(200).json({ message: "Profile updated" });
  } catch (error) {
    res.status(401).json(error);
  }
};

module.exports = { changeCredentials };
