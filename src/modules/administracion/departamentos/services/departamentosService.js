const prisma = require("../../../../../prisma.config");

async function listarDepartamentos() {
  // AGREGADO: include para ver los empleados dentro del departamento
  return await prisma.departamento.findMany({
    include: {
      empleado: true 
    }
  });
}

async function crearDepartamento(data) {
  return await prisma.departamento.create({ 
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion
    }
  });
}

async function obtenerDepartamentoPorId(id) {
  const idNumerico = Number(id);
  if (isNaN(idNumerico)) throw new Error("ID no válido");

  // AGREGADO: include para ver empleados al buscar un departamento específico
  return await prisma.departamento.findUnique({
    where: { id_departamento: idNumerico },
    include: {
      empleado: true
    }
  });
}

async function actualizarDepartamento(id, data) {
  return await prisma.departamento.update({
    where: { id_departamento: Number(id) },
    data
  });
}

async function eliminarDepartamento(id) {
  // Nota: Si el departamento tiene empleados, Prisma podría dar error de Foreign Key.
  // Idealmente, primero deberías mover los empleados o borrarlos.
  return await prisma.departamento.delete({
    where: { id_departamento: Number(id) }
  });
}

module.exports = {
  crearDepartamento,
  listarDepartamentos,
  obtenerDepartamentoPorId,
  actualizarDepartamento,
  eliminarDepartamento
};