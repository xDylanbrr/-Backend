const service = require("../services/authService");
const dto = require("../dtos/auth.dto");

// Opciones base de cookie — httpOnly previene acceso desde JS del navegador
const cookieOpts = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure:   process.env.NODE_ENV === "production"
};

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie("access_token",  accessToken,  { ...cookieOpts, maxAge: 15 * 60 * 1000 });         // 15 min
  res.cookie("refresh_token", refreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 días
}

function clearAuthCookies(res) {
  res.clearCookie("access_token",  cookieOpts);
  res.clearCookie("refresh_token", cookieOpts);
}

exports.register = async (req, res) => {
  const validacion = dto.validarRegistro(req.body);
  if (!validacion.valido) return res.status(400).json({ message: validacion.mensaje });

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
  const validacion = dto.validarLogin(req.body);
  if (!validacion.valido) return res.status(400).json({ message: validacion.mensaje });

  try {
    const resultado = await service.loginUsuario(req.body);

    setAuthCookies(res, resultado.accessToken, resultado.refreshToken);

    res.json({
      message: "Bienvenido a GTG",
      user: dto.buyerResponseDto(resultado.user),
      // Mantenemos el token en el body durante la transición al frontend con cookies
      token: resultado.accessToken
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.refresh = async (req, res) => {
  // Acepta refresh token desde cookie httpOnly o desde body (compatibilidad con frontend actual)
  const refreshToken = req.cookies?.refresh_token || req.body?.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Sin refresh token" });

  try {
    const resultado = await service.refreshAccessToken(refreshToken);

    // Actualizar ambas cookies con los nuevos tokens rotados
    setAuthCookies(res, resultado.accessToken, resultado.refreshToken);

    res.json({
      message: "Token renovado",
      token:        resultado.accessToken,
      refreshToken: resultado.refreshToken,
      user:         dto.buyerResponseDto(resultado.user),
    });
  } catch (error) {
    clearAuthCookies(res);
    res.status(401).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  const refreshToken = req.cookies?.refresh_token;

  try {
    if (refreshToken) {
      // Intentar extraer el userId del refresh token para invalidarlo en DB
      const jwt = require("jsonwebtoken");
      const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "REFRESH_ULTRA_SECRETA_GTG_2026";
      const payload = jwt.verify(refreshToken, REFRESH_SECRET);
      await service.logoutUsuario(payload.id);
    }
  } catch {
    // Si el token está expirado igual limpiamos las cookies
  }

  clearAuthCookies(res);
  res.json({ message: "Sesión cerrada" });
};

exports.actualizarImagen = async (req, res) => {
  try {
    // req.user.id proviene del JWT verificado — nunca del cliente
    const userId = req.user.id;
    if (!req.file) return res.status(400).json({ message: "No hay imagen" });

    await service.actualizarImagenPerfil(userId, req.file.filename);
    await service.crearNotificacion(userId, "Perfil", "Foto de perfil actualizada", "success");

    const userFull = await service.obtenerPerfilCompleto(userId);
    res.json({ user: dto.buyerResponseDto(userFull) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.guardarFirma = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firma } = req.body;
    if (!firma) return res.status(400).json({ message: "Firma requerida" });

    await service.actualizarFirmaDigital(userId, firma);
    await service.crearNotificacion(userId, "Seguridad", "Firma digital actualizada", "info");

    const userFull = await service.obtenerPerfilCompleto(userId);
    res.json({
      message: "Firma guardada",
      user: dto.buyerResponseDto(userFull),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
