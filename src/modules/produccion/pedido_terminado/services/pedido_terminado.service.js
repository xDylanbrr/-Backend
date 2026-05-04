const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PedidoTerminadoService {
  async obtenerTodos() {
    try {
      return await prisma.pedido_terminado.findMany({
        include: {
          empleado: { select: { nombre: true, apellido: true } },
          produccion_pedido: {
            include: {
              orden_pedido: { select: { id_pedido_cliente: true } }
            }
          }
        },
        orderBy: { id_pedido_terminado: 'desc' }
      });
    } catch (error) {
      console.error("❌ Error en Prisma - obtenerTodos PedidoTerminado:", error.message);
      throw error;
    }
  }

  async obtenerPorId(id) {
    return await prisma.pedido_terminado.findUnique({
      where: { id_pedido_terminado: Number(id) },
      include: { empleado: true, produccion_pedido: true }
    });
  }

  async crear(datos) {
    try {
      // 🚀 LÓGICA ERP 2026: Si el producto está DAÑADO, se desvía a RECICLAJE
      if (datos.estado === "Dañado") {
        console.log("⚠️ Producto dañado detectado. Desviando a Reciclaje...");
        
        // 1. Crear el registro en la nueva tabla de reciclaje
        await prisma.reciclaje.create({
          data: {
            id_produccion: datos.id_produccion,
            motivo: "Rechazado en Control de Calidad - Dañado",
            cantidad: 1, // Por defecto 1 lote/unidad
            maquina_externa: "Máquina de Reciclaje Externa #1"
          }
        });

        // 2. Cerramos el proceso de producción con un estado especial
        await prisma.produccion_pedido.update({
          where: { id_produccion: datos.id_produccion },
          data: { 
            estado: "Terminado (Rechazado - Dañado)",
            fecha_fin: new Date()
          }
        });

        return { mensaje: "Producto desviado a Reciclaje", desviado: true };
      }

      // FLUJO NORMAL: Si está aprobado, se crea el Pedido Terminado
      const nuevoPedidoTerminado = await prisma.pedido_terminado.create({
        data: datos
      });

      // Cerramos automáticamente el proceso en las máquinas como exitoso
      await prisma.produccion_pedido.update({
        where: { id_produccion: datos.id_produccion },
        data: { 
          estado: "Completado",
          fecha_fin: new Date()
        }
      });

      return nuevoPedidoTerminado;
    } catch (error) {
      console.error("❌ Error en Prisma - crear PedidoTerminado:", error.message);
      throw error;
    }
  }

  async actualizar(id, datos) {
    return await prisma.pedido_terminado.update({
      where: { id_pedido_terminado: Number(id) },
      data: { estado: datos.estado }
    });
  }

  async eliminar(id) {
    return await prisma.pedido_terminado.delete({
      where: { id_pedido_terminado: Number(id) }
    });
  }
}

module.exports = new PedidoTerminadoService();