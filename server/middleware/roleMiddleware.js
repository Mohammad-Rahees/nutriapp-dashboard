const admin = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.toLowerCase() === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied: Admin role required");
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Access denied: User role '${req.user ? req.user.role : "guest"}' is not authorized to access this route`);
    }
    next();
  };
};

module.exports = { admin, authorize };
