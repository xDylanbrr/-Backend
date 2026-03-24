const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class DespachoService {
  async obtenerTodos() {
    return await prisma.despacho_pedido.findMany({
      include: {
        empleado: { select: { nombre: true, apellido: true } },
        pedido_terminado: true,
        transporte: true 
      },
      orderBy: { fecha: 'desc' }
    });
  }

  async obtenerPorId(id) {
    return await prisma.despacho_pedido.findUnique({
      where: { id_despacho: Number(id) },
      include: {
        empleado: true,
        pedido_terminado: true,
        transporte: true
      }
    });
  }

  async crear(datos) {
    return await prisma.$transaction(async (tx) => {
      // 1. Crear despacho
      const nuevoDespacho = await tx.despacho_pedido.create({
        data: datos
      });

      // 2. Cambiar estado del pedido
      await tx.pedido_terminado.update({
        where: { id_pedido_terminado: datos.id_pedido_terminado },
        data: { estado: 'Despachado' }
      });

      return nuevoDespacho;
    });
  }

  async actualizar(id, datos) {
    return await prisma.despacho_pedido.update({
      where: { id_despacho: Number(id) },
      data: datos
    });
  }

  async eliminar(id) {
    return await prisma.despacho_pedido.delete({
      where: { id_despacho: Number(id) }
    });
  }
}

module.exports = new DespachoService();