const produccionPedidoService = require('../services/produccion_pedido.service');
const { validarCrearProduccion } = require('../dtos/produccion_pedido.dto');

class ProduccionPedidoController {
  async obtenerTodos(req, res) {
    try {
      const producciones = await produccionPedidoService.obtenerTodos();
      res.status(200).json(producciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los procesos de producción' });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const produccion = await produccionPedidoService.obtenerPorId(id);
      if (!produccion) return res.status(404).json({ error: 'Proceso no encontrado' });
      res.status(200).json(produccion);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el proceso de producción' });
    }
  }

  async crear(req, res) {
    try {
      const validacion = validarCrearProduccion(req.body);
      if (!validacion.valido) {
        return res.status(400).json({ errores: validacion.errores });
      }

      const nuevaProduccion = await produccionPedidoService.crear(validacion.datosLimpios);
      res.status(201).json(nuevaProduccion);
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar el proceso de producción' });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const produccionActualizada = await produccionPedidoService.actualizar(id, req.body);
      res.status(200).json(produccionActualizada);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el proceso de producción' });
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await produccionPedidoService.eliminar(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el proceso de producción' });
    }
  }
}

module.exports = new ProduccionPedidoController();