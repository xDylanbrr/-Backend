const validarCrearPedidoTerminado = (data) => {
  const errores = [];

  if (!data.id_produccion) errores.push("El ID del proceso de producción es obligatorio.");
  if (!data.id_empleado) errores.push("El ID del empleado es obligatorio.");

  const idProduccion = parseInt(data.id_produccion);
  const idEmpleado = parseInt(data.id_empleado);

  if (isNaN(idProduccion)) errores.push("El ID de producción debe ser un número.");
  if (isNaN(idEmpleado)) errores.push("El ID del empleado debe ser un número.");

  return {
    valido: errores.length === 0,
    errores,
    datosLimpios: {
      id_produccion: idProduccion,
      id_empleado: idEmpleado,
      estado: data.estado || "Listo para Empaque",
      fecha: data.fecha ? new Date(data.fecha) : new Date()
    }
  };
};

module.exports = {
  validarCrearPedidoTerminado
};