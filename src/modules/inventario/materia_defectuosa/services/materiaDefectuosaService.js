const prisma = require("../../../../../prisma.config");

async function crear(data) {
  return prisma.$transaction(async (tx) => {
    const materia = await tx.materia_prima.findUnique({
      where: { id_materia_prima: Number(data.materia_prima_id) }
    });

    if (!materia) throw new Error("Materia prima no encontrada");
    if ((materia.stock_actual || 0) < data.cantidad)
      throw new Error("Stock insuficiente");

    await tx.materia_prima.update({
      where: { id_materia_prima: Number(data.materia_prima_id) },
      data: {
        stock_actual: { decrement: data.cantidad }
      }
    });

    return tx.materia_defectuosa.create({
      data: {
        id_produccion: data.id_produccion ? Number(data.id_produccion) : null,
        id_empleado: data.id_empleado ? Number(data.id_empleado) : null,
        descripcion: data.motivo || data.descripcion || null,
        cantidad: Number(data.cantidad),
        fecha: new Date()
      }
    });
  });
}

async function listar() {
  return prisma.materia_defectuosa.findMany({
    include: {
      empleado: { select: { nombre: true, apellido: true } },
      produccion_pedido: true
    }
  });
}

async function obtenerPorId(id) {
  return prisma.materia_defectuosa.findUnique({
    where: { id_defecto: Number(id) },
    include: {
      empleado: true,
      produccion_pedido: true
    }
  });
}

module.exports = {
  crear,
  listar,
  obtenerPorId
};
