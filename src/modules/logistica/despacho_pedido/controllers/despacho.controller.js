// despacho.controller.js
const despachoService = require('../services/despacho.service');
// ✅ CAMBIO CLAVE: Agregamos la 's' a 'dtos' para que coincida con tu carpeta
const { validarCrearDespacho } = require('../dtos/despacho.dto');

class DespachoController {
  async obtenerTodos(req, res) {
    try {
      const despachos = await despachoService.obtenerTodos();
      res.status(200).json(despachos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los despachos' });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const despacho = await despachoService.obtenerPorId(id);
      if (!despacho) {
        return res.status(404).json({ error: 'Despacho no encontrado' });
      }
      res.status(200).json(despacho);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el despacho' });
    }
  }

  async crear(req, res) {
    try {
      const validacion = validarCrearDespacho(req.body);
      
      if (!validacion.valido) {
        return res.status(400).json({ errores: validacion.errores });
      }

      const nuevoDespacho = await despachoService.crear(validacion.datosLimpios);
      res.status(201).json(nuevoDespacho);

    } catch (error) {
      console.error("Error en Despacho:", error);
      if (error.code === 'P2003') {
        return res.status(400).json({ error: 'El empleado o el pedido no existen.' });
      }
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'No se encontró el pedido para actualizar su estado.' });
      }
      res.status(500).json({ error: 'Error al registrar el despacho' });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const despachoActualizado = await despachoService.actualizar(id, req.body);
      res.status(200).json(despachoActualizado);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el despacho' });
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await despachoService.eliminar(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el despacho' });
    }
  }
}

module.exports = new DespachoController();