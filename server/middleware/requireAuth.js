const { decodeAccessToken } = require("../helpers/jwt");

const requireAuth = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const decoded = decodeAccessToken(token);
    req.userId = decoded.id;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { requireAuth };
