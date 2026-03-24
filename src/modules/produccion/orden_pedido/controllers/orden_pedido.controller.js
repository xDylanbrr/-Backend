const ordenPedidoService = require('../services/orden_pedido.service');

class OrdenPedidoController {
  
  async obtenerTodos(req, res) {
    try {
      console.log("🔍 Intentando buscar las órdenes en BD...");
      const ordenes = await ordenPedidoService.obtenerTodos();
      console.log("✅ Órdenes encontradas:", ordenes.length);
      res.status(200).json(ordenes);
    } catch (error) {
      console.error("❌ Controlador - Error:", error);
      res.status(500).json({ error: 'Error al obtener las órdenes de pedido' });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const orden = await ordenPedidoService.obtenerPorId(id);
      if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });
      res.status(200).json(orden);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la orden' });
    }
  }

  async crear(req, res) {
    try {
      console.log("📥 Datos recibidos para crear orden:", req.body);
      const { id_pedido_cliente, id_empleado, estado } = req.body;

      if (!id_pedido_cliente || !id_empleado) {
         return res.status(400).json({ error: "El ID del pedido y del empleado son obligatorios." });
      }

      const nuevaOrden = await ordenPedidoService.crear({
        id_pedido_cliente,
        id_empleado,
        estado
      });
      
      console.log("✅ Orden creada con éxito:", nuevaOrden.id_orden);
      res.status(201).json(nuevaOrden);

    } catch (error) {
      console.error("❌ Controlador - Error al crear orden:", error);
      res.status(500).json({ error: 'Error al registrar la orden en BD.' });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const orden = await ordenPedidoService.actualizar(id, req.body);
      res.status(200).json(orden);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar' });
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await ordenPedidoService.eliminar(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar' });
    }
  }
}

module.exports = new OrdenPedidoController();