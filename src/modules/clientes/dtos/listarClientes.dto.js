function validarFiltrosClientes(query) {
  if (query.estado && !["ACTIVO", "INACTIVO"].includes(query.estado)) {
    return { valido: false, mensaje: "Estado inválido" };
  }

  return { valido: true };
}

module.exports = { validarFiltrosClientes };
