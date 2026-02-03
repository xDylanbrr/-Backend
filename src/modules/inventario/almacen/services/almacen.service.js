const prisma = require("../../../../config/prisma");

class AlmacenService {
  async crear(data) {
    return prisma.almacen.create({ data });
  }

  async listar() {
    return prisma.almacen.findMany();
  }

  async obtenerPorId(id) {
    return prisma.almacen.findUnique({
      where: { id: Number(id) }
    });
  }

  async actualizar(id, data) {
    return prisma.almacen.update({
      where: { id: Number(id) },
      data
    });
  }

  async eliminar(id) {
    return prisma.almacen.delete({
      where: { id: Number(id) }
    });
  }
}

module.exports = new AlmacenService();
