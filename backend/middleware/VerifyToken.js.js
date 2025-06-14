const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("⛔ No token provided");
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("🔓 Token verified. User:", decoded);
    next();
  } catch (error) {
    console.error("❌ Invalid token:", error.message);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
module.exports={verifyToken}
