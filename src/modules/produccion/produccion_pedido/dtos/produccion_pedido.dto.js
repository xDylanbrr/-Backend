const validarCrearProduccion = (data) => {
  const errores = [];

  if (!data.id_orden) errores.push("El ID de la orden de pedido es obligatorio.");
  if (!data.id_empleado) errores.push("El ID del empleado (operario) es obligatorio.");

  const idOrden = parseInt(data.id_orden);
  const idEmpleado = parseInt(data.id_empleado);

  if (isNaN(idOrden)) errores.push("El ID de la orden debe ser un número.");
  if (isNaN(idEmpleado)) errores.push("El ID del empleado debe ser un número.");

  return {
    valido: errores.length === 0,
    errores,
    datosLimpios: {
      id_orden: idOrden,
      id_empleado: idEmpleado,
      estado: data.estado || "En Proceso",
      fecha_inicio: data.fecha_inicio ? new Date(data.fecha_inicio) : new Date(),
      // fecha_fin se deja nula al crear, se actualiza cuando terminan
    }
  };
};

module.exports = {
  validarCrearProduccion
};