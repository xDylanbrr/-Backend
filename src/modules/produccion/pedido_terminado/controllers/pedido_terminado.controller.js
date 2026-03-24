const pedidoTerminadoService = require('../services/pedido_terminado.service');
const { validarCrearPedidoTerminado } = require('../dtos/pedido_terminado.dto');

class PedidoTerminadoController {
  async obtenerTodos(req, res) {
    try {
      const pedidos = await pedidoTerminadoService.obtenerTodos();
      res.status(200).json(pedidos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los pedidos terminados.' });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const pedido = await pedidoTerminadoService.obtenerPorId(id);
      if (!pedido) return res.status(404).json({ error: 'No encontrado.' });
      res.status(200).json(pedido);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el pedido.' });
    }
  }

  async crear(req, res) {
    try {
      const validacion = validarCrearPedidoTerminado(req.body);
      if (!validacion.valido) {
        return res.status(400).json({ errores: validacion.errores });
      }

      const nuevoPedido = await pedidoTerminadoService.crear(validacion.datosLimpios);
      res.status(201).json(nuevoPedido);
    } catch (error) {
      console.error("❌ Error al crear:", error);
      res.status(500).json({ error: 'Error al registrar.' });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const actualizado = await pedidoTerminadoService.actualizar(id, req.body);
      res.status(200).json(actualizado);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar.' });
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await pedidoTerminadoService.eliminar(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar.' });
    }
  }
}

module.exports = new PedidoTerminadoController();