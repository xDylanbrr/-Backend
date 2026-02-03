const prisma = require("../../../../config/prisma");

async function listar() {
  return prisma.materia_prima.findMany({
    include: { almacen: true }
  });
}

async function obtenerPorId(id) {
  return prisma.materia_prima.findUnique({
    where: { id },
    include: { almacen: true }
  });
}

// ⚠️ SOLO USADO POR OTROS SERVICES
async function aumentarStock(id, cantidad) {
  return prisma.materia_prima.update({
    where: { id },
    data: {
      stock: { increment: cantidad }
    }
  });
}

async function disminuirStock(id, cantidad) {
  return prisma.materia_prima.update({
    where: { id },
    data: {
      stock: { decrement: cantidad }
    }
  });
}

module.exports = {
  listar,
  obtenerPorId,
  aumentarStock,
  disminuirStock
};
