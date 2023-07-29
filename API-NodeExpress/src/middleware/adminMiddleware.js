const { verifyToken } = require("../utils/jwtUtils");

const adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  try {
    const decoded = verifyToken(token);
    const { role } = decoded;
    if (role !== "admin") {
      return res.status(403).json({ error: "Não autorizado" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = adminMiddleware;
