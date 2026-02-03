function validarActualizarCliente(data) {
  if (data.nombre && typeof data.nombre !== "string") {
    return { valido: false, mensaje: "Nombre inválido" };
  }

  if (data.email && !data.email.includes("@")) {
    return { valido: false, mensaje: "Email inválido" };
  }

  if (data.telefono && typeof data.telefono !== "string") {
    return { valido: false, mensaje: "Teléfono inválido" };
  }

  if (data.estado && !["ACTIVO", "INACTIVO"].includes(data.estado)) {
    return { valido: false, mensaje: "Estado inválido" };
  }

  return { valido: true };
}

module.exports = { validarActualizarCliente };
