const authService = require("../services/authService");

module.exports = (req, res, next) => {
  const token = req.cookies["auth-token"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
