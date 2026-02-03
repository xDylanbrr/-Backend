function validarCrearCliente(data) {
  if (!data.nombre || typeof data.nombre !== "string") {
    return { valido: false, mensaje: "El nombre es obligatorio" };
  }

  if (data.email && !data.email.includes("@")) {
    return { valido: false, mensaje: "Email inválido" };
  }

  if (data.telefono && typeof data.telefono !== "string") {
    return { valido: false, mensaje: "Teléfono inválido" };
  }

  return { valido: true };
}

module.exports = { validarCrearCliente };
