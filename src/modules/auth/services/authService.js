const prisma = require("../../../../prisma.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const ACCESS_SECRET  = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT_SECRET y REFRESH_TOKEN_SECRET deben estar definidos en las variables de entorno");
}

async function registrarUsuario(data) {
  const existeCliente = await prisma.cliente.findFirst({
    where: { OR: [{ cedula: data.cedula }, { correo: data.email }] }
  });

  if (existeCliente) throw new Error("La cédula o el correo ya están registrados");

  const nuevoCliente = await prisma.cliente.create({
    data: {
      nombre: data.nombre,
      cedula: data.cedula,
      empresa: data.empresa || null,
      telefono: data.telefono || null,
      correo: data.email,
      direccion: data.direccion || null
    }
  });

  const hash = await bcrypt.hash(data.password, 10);

  return await prisma.usuario.create({
    data: {
      id_cliente: nuevoCliente.id_cliente,
      nombre_usuario: data.cedula,
      clave: hash,
      rol: "COMPRADOR"
    },
    include: { cliente: true }
  });
}

async function loginUsuario(data) {
  const cuenta = await prisma.usuario.findFirst({
    where: { nombre_usuario: data.cedula },
    include: { cliente: true }
  });

  if (!cuenta) throw new Error("Cédula o contraseña incorrectas");

  const valido = await bcrypt.compare(data.password, cuenta.clave);
  if (!valido) throw new Error("Cédula o contraseña incorrectas");

  const payload = { id: cuenta.id_usuario, nombre: cuenta.cliente?.nombre, rol: cuenta.rol };

  const accessToken  = jwt.sign(payload, ACCESS_SECRET,  { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d"  });

  // Guardar hash del refresh token (no el token en texto plano)
  const hashRefresh = await bcrypt.hash(refreshToken, 10);
  await prisma.usuario.update({
    where: { id_usuario: cuenta.id_usuario },
    data: { refresh_token: hashRefresh }
  });

  return { user: cuenta, accessToken, refreshToken };
}

async function refreshAccessToken(refreshToken) {
  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_SECRET);
  } catch {
    throw new Error("Refresh token inválido o expirado");
  }

  const cuenta = await prisma.usuario.findUnique({
    where: { id_usuario: payload.id },
    include: { cliente: true },
  });

  if (!cuenta || !cuenta.refresh_token) throw new Error("Sesión no encontrada");

  const coincide = await bcrypt.compare(refreshToken, cuenta.refresh_token);
  if (!coincide) throw new Error("Refresh token no coincide");

  const newPayload = { id: cuenta.id_usuario, nombre: cuenta.cliente?.nombre, rol: cuenta.rol };

  // Emitir nuevos tokens (rotación: el refresh anterior queda invalidado)
  const accessToken      = jwt.sign(newPayload, ACCESS_SECRET,  { expiresIn: "15m" });
  const newRefreshToken  = jwt.sign(newPayload, REFRESH_SECRET, { expiresIn: "7d"  });

  // Persistir el hash del nuevo refresh token
  const hashRefresh = await bcrypt.hash(newRefreshToken, 10);
  await prisma.usuario.update({
    where: { id_usuario: cuenta.id_usuario },
    data: { refresh_token: hashRefresh },
  });

  return { user: cuenta, accessToken, refreshToken: newRefreshToken };
}

async function logoutUsuario(userId) {
  await prisma.usuario.update({
    where: { id_usuario: parseInt(userId) },
    data: { refresh_token: null }
  });
}

async function actualizarImagenPerfil(idUsuario, nombreArchivo) {
  const idNumerico = parseInt(idUsuario);
  const usuarioActual = await prisma.usuario.findUnique({
    where: { id_usuario: idNumerico },
    select: { imagen_perfil: true }
  });

  if (usuarioActual?.imagen_perfil) {
    const rutaAnterior = path.join(process.cwd(), "uploads", "perfiles", usuarioActual.imagen_perfil);
    if (fs.existsSync(rutaAnterior)) {
      try { fs.unlinkSync(rutaAnterior); } catch (e) { console.error(e); }
    }
  }

  return await prisma.usuario.update({
    where: { id_usuario: idNumerico },
    data: { imagen_perfil: nombreArchivo },
    include: { cliente: true }
  });
}

async function actualizarFirmaDigital(idUsuario, firmaBase64) {
  return await prisma.usuario.update({
    where: { id_usuario: parseInt(idUsuario) },
    data: { firma: firmaBase64 },
    include: { cliente: true }
  });
}

async function crearNotificacion(idUsuario, titulo, mensaje, tipo = "info") {
  return await prisma.notificacion.create({
    data: {
      id_usuario: parseInt(idUsuario),
      titulo,
      mensaje,
      tipo
    }
  });
}

async function obtenerPerfilCompleto(idUsuario) {
  return await prisma.usuario.findUnique({
    where: { id_usuario: parseInt(idUsuario) },
    include: {
      cliente: true,
      notificaciones: { orderBy: { fecha_creacion: 'desc' }, take: 5 }
    }
  });
}

module.exports = {
  registrarUsuario,
  loginUsuario,
  refreshAccessToken,
  logoutUsuario,
  actualizarImagenPerfil,
  actualizarFirmaDigital,
  crearNotificacion,
  obtenerPerfilCompleto
};
