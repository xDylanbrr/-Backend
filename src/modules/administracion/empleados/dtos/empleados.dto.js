function validarCrearEmpleado(data) {
  // 1. Validaciones Obligatorias
  if (!data.nombre || typeof data.nombre !== "string" || data.nombre.trim() === "") {
    return { valido: false, mensaje: "El nombre es obligatorio y debe ser texto" };
  }

  // En tu schema, 'apellido' es opcional (String?), pero es buena práctica pedirlo si es posible.
  // Lo dejaremos opcional para respetar tu schema, pero validando tipo si existe.
  if (data.apellido && typeof data.apellido !== "string") {
    return { valido: false, mensaje: "El apellido debe ser texto válido" };
  }

  if (!data.departamento_id || isNaN(Number(data.departamento_id))) {
    return { valido: false, mensaje: "El ID de departamento es obligatorio y debe ser un número" };
  }

  // 2. Validaciones de Formato (Si se envían los datos)
  if (data.correo) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.correo)) {
      return { valido: false, mensaje: "El formato del correo electrónico no es válido" };
    }
  }

  if (data.telefono && typeof data.telefono !== "string") {
    return { valido: false, mensaje: "El teléfono debe ser texto (ej: '809-555-5555')" };
  }

  if (data.cedula && typeof data.cedula !== "string") {
    return { valido: false, mensaje: "La cédula debe ser texto" };
  }

  return { valido: true };
}

function validarActualizarEmpleado(data) {
  if (data.nombre && (typeof data.nombre !== "string" || data.nombre.trim() === "")) {
    return { valido: false, mensaje: "El nombre no puede estar vacío" };
  }

  if (data.departamento_id && isNaN(Number(data.departamento_id))) {
    return { valido: false, mensaje: "El ID de departamento debe ser numérico" };
  }

  if (data.correo) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.correo)) {
      return { valido: false, mensaje: "El formato del correo electrónico no es válido" };
    }
  }

  return { valido: true };
}

module.exports = {
  validarCrearEmpleado,
  validarActualizarEmpleado
};