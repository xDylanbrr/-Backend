const prisma = require("../../../../../prisma.config");

class AlmacenService {
  async crear(data) {
    return prisma.almacen.create({
      data: {
        id_produccion: data.id_produccion ? Number(data.id_produccion) : null,
        id_empleado: data.id_empleado ? Number(data.id_empleado) : null,
        cantidad: data.cantidad ? Number(data.cantidad) : null,
        fecha_entrada: data.fecha_entrada ? new Date(data.fecha_entrada) : new Date()
      }
    });
  }

  async listar() {
    return prisma.almacen.findMany({
      include: {
        empleado: { select: { nombre: true, apellido: true } },
        produccion_pedido: true
      }
    });
  }

  async obtenerPorId(id) {
    return prisma.almacen.findUnique({
      where: { id_almacen: Number(id) },
      include: {
        empleado: true,
        produccion_pedido: true
      }
    });
  }

  async actualizar(id, data) {
    return prisma.almacen.update({
      where: { id_almacen: Number(id) },
      data
    });
  }

  async eliminar(id) {
    return prisma.almacen.delete({
      where: { id_almacen: Number(id) }
    });
  }
}

module.exports = new AlmacenService();
