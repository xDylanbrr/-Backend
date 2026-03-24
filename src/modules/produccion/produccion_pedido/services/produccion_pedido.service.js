const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProduccionPedidoService {
  async obtenerTodos() {
    try {
      return await prisma.produccion_pedido.findMany({
        include: {
          empleado: { select: { nombre: true, apellido: true } },
          orden_pedido: { select: { estado: true, id_pedido_cliente: true } }
        },
        orderBy: { id_produccion: 'desc' }
      });
    } catch (error) {
      console.error("❌ Error en Prisma - obtenerTodos Produccion:", error.message);
      throw error;
    }
  }

  async obtenerPorId(id) {
    return await prisma.produccion_pedido.findUnique({
      where: { id_produccion: Number(id) },
      include: {
        empleado: true,
        orden_pedido: true
      }
    });
  }

  async crear(datos) {
    try {
      // 1. Creamos el registro de producción
      const nuevaProduccion = await prisma.produccion_pedido.create({
        data: datos
      });

      // 2. MAGIA AUTOMÁTICA: Actualizamos el estado de la orden a "En Producción"
      await prisma.orden_pedido.update({
        where: { id_orden: datos.id_orden },
        data: { estado: "En Producción" }
      });

      return nuevaProduccion;
    } catch (error) {
      console.error("❌ Error en Prisma - crear Produccion:", error.message);
      throw error;
    }
  }

  async actualizar(id, datos) {
    try {
      // Si el estado que envían es "Completado", le ponemos la fecha_fin automática
      const dataUpdate = { estado: datos.estado };
      if (datos.estado === "Completado") {
        dataUpdate.fecha_fin = new Date();
      }

      return await prisma.produccion_pedido.update({
        where: { id_produccion: Number(id) },
        data: dataUpdate
      });
    } catch (error) {
      console.error("❌ Error en Prisma - actualizar Produccion:", error.message);
      throw error;
    }
  }

  async eliminar(id) {
    return await prisma.produccion_pedido.delete({
      where: { id_produccion: Number(id) }
    });
  }
}

module.exports = new ProduccionPedidoService();