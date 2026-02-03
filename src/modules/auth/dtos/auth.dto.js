function validarRegistro(data) {
  if (!data.email || !data.password) {
    return { valido: false, mensaje: "Email y contraseña son obligatorios" };
  }

  if (!data.email.includes("@")) {
    return { valido: false, mensaje: "Email inválido" };
  }

  if (data.password.length < 6) {
    return { valido: false, mensaje: "La contraseña debe tener al menos 6 caracteres" };
  }

  return { valido: true };
}

function validarLogin(data) {
  if (!data.email || !data.password) {
    return { valido: false, mensaje: "Credenciales incompletas" };
  }

  return { valido: true };
}

module.exports = {
  validarRegistro,
  validarLogin
};
