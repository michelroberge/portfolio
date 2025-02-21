module.exports = (req, res, next) => {
    if (!req.cookies.session) return res.status(401).json({ message: "Unauthorized" });
    next();
  };
  