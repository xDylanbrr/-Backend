const prisma = require("../../../../prisma.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registrarUsuario(data) {
  const existe = await prisma.usuarios.findUnique({
    where: { email: data.email }
  });

  if (existe) {
    throw new Error("El usuario ya existe");
  }

  const hash = await bcrypt.hash(data.password, 10);

  return await prisma.usuarios.create({
    data: {
      email: data.email,
      password: hash,
      rol: "USER"
    }
  });
}

async function loginUsuario(data) {
  const usuario = await prisma.usuarios.findUnique({
    where: { email: data.email }
  });

  if (!usuario) {
    throw new Error("Credenciales inválidas");
  }

  const valido = await bcrypt.compare(data.password, usuario.password);
  if (!valido) {
    throw new Error("Credenciales inválidas");
  }

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    "CLAVE_SECRETA",
    { expiresIn: "1d" }
  );

  return { token };
}

module.exports = {
  registrarUsuario,
  loginUsuario
};
