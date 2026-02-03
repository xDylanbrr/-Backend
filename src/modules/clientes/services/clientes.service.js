const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Obtener todos los clientes
 */
async function getAllClientes() {
  return await prisma.cliente.findMany({
    orderBy: {
      id_cliente: "asc"
    }
  });
}

/**
 * Obtener cliente por ID
 */
async function getClienteById(id) {
  return await prisma.cliente.findUnique({
    where: {
      id_cliente: Number(id)
    }
  });
}

/**
 * Crear cliente
 */
async function createCliente(data) {
  return await prisma.cliente.create({
    data: {
      nombre: data.nombre,
      telefono: data.telefono,
      correo: data.correo,
      direccion: data.direccion
    }
  });
}

/**
 * Actualizar cliente
 */
async function updateCliente(id, data) {
  return await prisma.cliente.update({
    where: {
      id_cliente: Number(id)
    },
    data: {
      nombre: data.nombre,
      telefono: data.telefono,
      correo: data.correo,
      direccion: data.direccion
    }
  });
}

/**
 * Eliminar cliente
 */
async function deleteCliente(id) {
  return await prisma.cliente.delete({
    where: {
      id_cliente: Number(id)
    }
  });
}

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente
};
