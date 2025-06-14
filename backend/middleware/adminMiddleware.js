const isAdmin = (req, res, next) => {
  console.log("Decoded user:", req.user); // 👈 log it
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Admin access only' });
  }
};
module.exports={isAdmin}