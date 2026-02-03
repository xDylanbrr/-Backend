const service = require("../services/authService");
const dto = require("../dtos/auth.dto");

// Registro
exports.register = async (req, res) => {
  const validacion = dto.validarRegistro(req.body);
  if (!validacion.valido) {
    return res.status(400).json({ error: validacion.mensaje });
  }

  try {
    const usuario = await service.registrarUsuario(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const validacion = dto.validarLogin(req.body);
  if (!validacion.valido) {
    return res.status(400).json({ error: validacion.mensaje });
  }

  try {
    const resultado = await service.loginUsuario(req.body);
    res.json(resultado);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
