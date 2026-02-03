function validarCrearDepartamento(data) {
  if (!data.nombre || typeof data.nombre !== "string") {
    return {
      valido: false,
      mensaje: "El nombre del departamento es obligatorio"
    };
  }

  return { valido: true };
}

function validarActualizarDepartamento(data) {
  if (data.nombre && typeof data.nombre !== "string") {
    return {
      valido: false,
      mensaje: "El nombre debe ser un texto válido"
    };
  }

  return { valido: true };
}

module.exports = {
  validarCrearDepartamento,
  validarActualizarDepartamento
};
