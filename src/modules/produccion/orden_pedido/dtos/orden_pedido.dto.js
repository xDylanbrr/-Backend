const validarCrearOrden = (data) => {
  const errores = [];

  // Validaciones básicas (ajusta los nombres según tu schema de Prisma si es necesario)
  if (!data.id_pedido_cliente) errores.push("El ID del pedido del cliente es obligatorio.");
  if (!data.id_empleado) errores.push("El ID del empleado (supervisor) es obligatorio.");

  // Conversión a números
  const idPedidoCliente = parseInt(data.id_pedido_cliente);
  const idEmpleado = parseInt(data.id_empleado);

  if (isNaN(idPedidoCliente)) errores.push("El ID del pedido cliente debe ser un número válido.");
  if (isNaN(idEmpleado)) errores.push("El ID del empleado debe ser un número válido.");

  return {
    valido: errores.length === 0,
    errores,
    datosLimpios: {
      id_pedido_cliente: idPedidoCliente,
      id_empleado: idEmpleado,
      fecha_orden: data.fecha_orden ? new Date(data.fecha_orden) : new Date(),
      estado: data.estado || "Pendiente", // Pendiente, En Producción, Completada
      descripcion: data.descripcion || ""
    }
  };
};

module.exports = {
  validarCrearOrden
};