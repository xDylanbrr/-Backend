const service = require("../services/authService");
const dto = require("../dtos/auth.dto");

exports.register = async (req, res) => {
  try {
    const usuarioCreado = await service.registrarUsuario(req.body);
    res.status(201).json({
      message: "¡Registro exitoso!",
      user: dto.buyerResponseDto(usuarioCreado)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const resultado = await service.loginUsuario(req.body);
    res.json({
      message: "Bienvenido a GTG",
      user: dto.buyerResponseDto(resultado.user),
      token: resultado.token
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.actualizarImagen = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!req.file) return res.status(400).json({ message: "No hay imagen" });

    await service.actualizarImagenPerfil(userId, req.file.filename);
    await service.crearNotificacion(userId, "Perfil", "Foto de perfil actualizada", "success");

    const userFull = await service.obtenerPerfilCompleto(userId);
    res.json({ user: dto.buyerResponseDto(userFull) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ NUEVO: Controlador de Firma
exports.guardarFirma = async (req, res) => {
  try {
    const { userId, firma } = req.body;
    await service.actualizarFirmaDigital(userId, firma);
    await service.crearNotificacion(userId, "Seguridad", "Firma digital actualizada", "info");

    const userFull = await service.obtenerPerfilCompleto(userId);
    res.json({ 
      message: "Firma guardada", 
      user: dto.buyerResponseDto(userFull) 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};