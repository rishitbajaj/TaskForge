const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Access Denied: Missing user role profile." });
    }

    const hasPermission = allowedRoles.includes(req.user.role);
    if (!hasPermission) {
      return res.status(403).json({ message: "Access Denied: Insufficient privilege levels." });
    }

    next();
  };
};

module.exports = authorizeRoles;