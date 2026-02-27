const prisma = require("../../../../prisma.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

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

  const token = jwt.sign(
    { id: cuenta.id_usuario, nombre: cuenta.cliente?.nombre, rol: cuenta.rol },
    process.env.JWT_SECRET || "CLAVE_ULTRA_SECRETA_GTG_2026",
    { expiresIn: "8h" }
  );

  return { user: cuenta, token };
}

async function actualizarImagenPerfil(idUsuario, nombreArchivo) {
  const usuarioActual = await prisma.usuario.findUnique({
    where: { id_usuario: parseInt(idUsuario) },
    select: { imagen_perfil: true }
  });

  if (!usuarioActual) throw new Error("Usuario no encontrado");

  if (usuarioActual.imagen_perfil) {
    const rutaAnterior = path.join(process.cwd(), "uploads", "perfiles", usuarioActual.imagen_perfil);
    if (fs.existsSync(rutaAnterior)) {
      try { fs.unlinkSync(rutaAnterior); } catch (e) { console.error("Error borrando:", e); }
    }
  }

  return await prisma.usuario.update({
    where: { id_usuario: parseInt(idUsuario) },
    data: { imagen_perfil: nombreArchivo },
    include: { cliente: true }
  });
}

module.exports = {
  registrarUsuario,
  loginUsuario,
  actualizarImagenPerfil
};