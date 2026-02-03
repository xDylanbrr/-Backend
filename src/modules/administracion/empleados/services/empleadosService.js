const prisma = require("../../../../../prisma.config");

async function listarEmpleados() {
  return await prisma.empleado.findMany({
    include: { departamento: true }
  });
}

async function crearEmpleado(data) {
  // Verificar si el departamento existe antes de crear
  const depExiste = await prisma.departamento.findUnique({
    where: { id_departamento: Number(data.departamento_id) }
  });

  if (!depExiste) {
    throw new Error(`El departamento con ID ${data.departamento_id} no existe.`);
  }

  return await prisma.empleado.create({
    data: {
      nombre: data.nombre,
      apellido: data.apellido || null,
      cedula: data.cedula || null,
      telefono: data.telefono || null,
      correo: data.correo || null,
      puesto: data.puesto || null,
      // Convertir string de fecha a objeto Date si viene
      fecha_contratacion: data.fecha_contratacion ? new Date(data.fecha_contratacion) : new Date(),
      id_departamento: Number(data.departamento_id)
    }
  });
}

async function obtenerEmpleadoPorId(id) {
  return await prisma.empleado.findUnique({
    where: { id_empleado: Number(id) },
    include: { departamento: true }
  });
}

async function actualizarEmpleado(id, data) {
  const { departamento_id, fecha_contratacion, ...rest } = data;

  // Si se va a cambiar de departamento, verificar que el nuevo exista
  if (departamento_id) {
    const depExiste = await prisma.departamento.findUnique({
      where: { id_departamento: Number(departamento_id) }
    });
    if (!depExiste) throw new Error("El departamento nuevo no existe");
  }

  return await prisma.empleado.update({
    where: { id_empleado: Number(id) },
    data: {
      ...rest,
      id_departamento: departamento_id ? Number(departamento_id) : undefined,
      fecha_contratacion: fecha_contratacion ? new Date(fecha_contratacion) : undefined
    }
  });
}

async function eliminarEmpleado(id) {
  return await prisma.empleado.delete({
    where: { id_empleado: Number(id) }
  });
}

module.exports = {
  listarEmpleados,
  crearEmpleado,
  obtenerEmpleadoPorId,
  actualizarEmpleado,
  eliminarEmpleado
};