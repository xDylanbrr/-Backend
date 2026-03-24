// despacho.dto.js
const validarCrearDespacho = (data) => {
  const errores = [];

  // Validaciones básicas
  if (!data.id_pedido_terminado) errores.push("El ID del pedido terminado es obligatorio.");
  if (!data.id_empleado) errores.push("El ID del empleado responsable es obligatorio.");
  if (!data.destino) errores.push("El destino de entrega es obligatorio.");
  
  // Conversión a números para evitar errores de Prisma
  const id_pedido = parseInt(data.id_pedido_terminado);
  const id_empl = parseInt(data.id_empleado);

  if (isNaN(id_pedido)) errores.push("El ID del pedido debe ser un número válido.");
  if (isNaN(id_empl)) errores.push("El ID del empleado debe ser un número válido.");

  return {
    valido: errores.length === 0,
    errores,
    datosLimpios: {
      id_pedido_terminado: id_pedido,
      id_empleado: id_empl,
      fecha: data.fecha ? new Date(data.fecha) : new Date(),
      estado: data.estado || "Programado",
      destino: data.destino
    }
  };
};

module.exports = {
  validarCrearDespacho
};