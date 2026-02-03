const prisma = require("../../../../config/prisma");


async function crear(data) {
  return prisma.$transaction(async (tx) => {
    const materia = await tx.materia_prima.findUnique({
      where: { id: data.materia_prima_id }
    });

    if (!materia) throw new Error("Materia prima no encontrada");
    if (materia.stock < data.cantidad)
      throw new Error("Stock insuficiente");

    await tx.materia_prima.update({
      where: { id: data.materia_prima_id },
      data: {
        stock: { decrement: data.cantidad }
      }
    });

    return tx.materia_defectuosa.create({
      data
    });
  });
}

async function listar() {
  return prisma.materia_defectuosa.findMany({
    include: { materia_prima: true }
  });
}

async function obtenerPorId(id) {
  return prisma.materia_defectuosa.findUnique({
    where: { id },
    include: { materia_prima: true }
  });
}

module.exports = {
  crear,
  listar,
  obtenerPorId
};
