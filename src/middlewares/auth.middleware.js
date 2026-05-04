const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_SECRET;

/**
 * Verifica que la petición tenga un JWT válido.
 * Busca el token en: 1) cookie access_token, 2) header Authorization Bearer.
 */
const verifyToken = (req, res, next) => {
  const token =
    req.cookies?.access_token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Acceso denegado: token requerido" });
  }

  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    }
    return res.status(401).json({ error: "Token inválido" });
  }
};

/**
 * Verifica que el usuario autenticado tenga uno de los roles permitidos.
 * Uso: authorize(["ADMIN", "EMPLEADO"])
 */
const authorize = (rolesPermitidos = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }
    if (rolesPermitidos.length && !rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ error: "Sin permiso para esta acción" });
    }
    next();
  };
};

module.exports = { verifyToken, authorize };
