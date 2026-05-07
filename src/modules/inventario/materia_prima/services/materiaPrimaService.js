const prisma = require("../../../../../prisma.config");

async function listar() {
  return prisma.materia_prima.findMany({
    include: { proveedor: true }
  });
}

async function obtenerPorId(id) {
  return prisma.materia_prima.findUnique({
    where: { id_materia_prima: Number(id) },
    include: { proveedor: true }
  });
}

// ⚠️ SOLO USADO POR OTROS SERVICES
async function aumentarStock(id, cantidad) {
  return prisma.materia_prima.update({
    where: { id_materia_prima: Number(id) },
    data: {
      stock_actual: { increment: cantidad }
    }
  });
}

async function disminuirStock(id, cantidad) {
  return prisma.materia_prima.update({
    where: { id_materia_prima: Number(id) },
    data: {
      stock_actual: { decrement: cantidad }
    }
  });
}

module.exports = {
  listar,
  obtenerPorId,
  aumentarStock,
  disminuirStock
};
