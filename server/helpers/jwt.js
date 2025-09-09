const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "3d" });
};

const createTempToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET, { expiresIn: "5m" });
};

const decodeTempToken = (tempToken) => {
  try {
    return jwt.verify(tempToken, process.env.SECRET);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { createToken, createTempToken, decodeTempToken };
