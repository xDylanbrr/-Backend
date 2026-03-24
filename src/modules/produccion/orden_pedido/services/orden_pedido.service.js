const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OrdenPedidoService {
  async obtenerTodos() {
    try {
      return await prisma.orden_pedido.findMany({
        include: {
          empleado: { select: { nombre: true, apellido: true } },
          pedido_cliente: { select: { estado: true } }
        },
        orderBy: { id_orden: 'desc' }
      });
    } catch (error) {
      console.error("❌ Error en Prisma - obtenerTodos:", error.message);
      throw error;
    }
  }

  async obtenerPorId(id) {
    return await prisma.orden_pedido.findUnique({
      where: { id_orden: Number(id) },
      include: {
        empleado: { select: { nombre: true, apellido: true } },
        pedido_cliente: true
      }
    });
  }

  async crear(datos) {
    try {
      return await prisma.orden_pedido.create({
        data: {
          id_pedido_cliente: Number(datos.id_pedido_cliente),
          id_empleado: Number(datos.id_empleado),
          estado: datos.estado || "Pendiente",
          fecha: new Date() 
        }
      });
    } catch (error) {
      console.error("❌ Error en Prisma - crear:", error.message);
      throw error;
    }
  }

  async actualizar(id, datos) {
    return await prisma.orden_pedido.update({
      where: { id_orden: Number(id) },
      data: { estado: datos.estado }
    });
  }

  async eliminar(id) {
    try {
      const idOrden = Number(id);

      // 1. Buscamos qué procesos (hijos) tiene la orden
      const procesos = await prisma.produccion_pedido.findMany({
        where: { id_orden: idOrden },
        select: { id_produccion: true }
      });
      const idsProcesos = procesos.map(p => p.id_produccion);

      if (idsProcesos.length > 0) {
        
        // 2. Buscamos qué pedidos terminados (nietos) tienen esos procesos
        const terminados = await prisma.pedido_terminado.findMany({
          where: { id_produccion: { in: idsProcesos } },
          select: { id_pedido_terminado: true }
        });
        const idsTerminados = terminados.map(pt => pt.id_pedido_terminado);

        if (idsTerminados.length > 0) {
          
          // 3. Buscamos qué despachos (bisnietos) tienen esos terminados
          const despachos = await prisma.despacho_pedido.findMany({
            where: { id_pedido_terminado: { in: idsTerminados } },
            select: { id_despacho: true }
          });
          const idsDespachos = despachos.map(d => d.id_despacho);

          // 4. ELIMINAMOS TATARANIETOS (Transportes)
          if (idsDespachos.length > 0) {
            await prisma.transporte.deleteMany({
              where: { id_despacho: { in: idsDespachos } }
            });
          }

          // 5. ELIMINAMOS BISNIETOS (Empaques y Despachos)
          await prisma.empaque.deleteMany({
            where: { id_pedido_terminado: { in: idsTerminados } }
          });
          await prisma.despacho_pedido.deleteMany({
            where: { id_pedido_terminado: { in: idsTerminados } }
          });
        }

        // 6. ELIMINAMOS NIETOS (Terminados, Calidad, Defectos, Almacén)
        await prisma.pedido_terminado.deleteMany({ where: { id_produccion: { in: idsProcesos } } });
        await prisma.control_calidad.deleteMany({ where: { id_produccion: { in: idsProcesos } } });
        await prisma.materia_defectuosa.deleteMany({ where: { id_produccion: { in: idsProcesos } } });
        await prisma.almacen.deleteMany({ where: { id_produccion: { in: idsProcesos } } });

        // 7. ELIMINAMOS HIJOS (Procesos)
        await prisma.produccion_pedido.deleteMany({
          where: { id_orden: idOrden }
        });
      }

      // 8. ELIMINAMOS MATERIA PRIMA (Otro hijo de la orden)
      await prisma.salida_materia_prima.deleteMany({
        where: { id_orden: idOrden }
      });

      // 9. GOLPE FINAL: Eliminamos la orden
      return await prisma.orden_pedido.delete({
        where: { id_orden: idOrden }
      });

    } catch (error) {
      console.error("❌ Error al forzar la eliminación absoluta:", error.message);
      throw error;
    }
  }
}

module.exports = new OrdenPedidoService();