const jwt = require("jsonwebtoken");

const createTempToken = (payload) => {
  return jwt.sign(payload, process.env.TEMP_SECRET, { expiresIn: "5m" });
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: "30m" });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "7d" });
};

const decodeTempToken = (token) => {
  try {
    return jwt.verify(token, process.env.TEMP_SECRET);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const decodeAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_SECRET);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const decodeRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_SECRET);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  createTempToken,
  createAccessToken,
  createRefreshToken,
  decodeTempToken,
  decodeAccessToken,
  decodeRefreshToken,
};
