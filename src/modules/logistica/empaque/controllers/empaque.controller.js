// Ruta: src/modules/logistica/empaque/controllers/empaque.controller.js

const empaqueService = require('../services/empaque.service');
const EmpaqueDTO = require('../dtos/empaque.dto');

class EmpaqueController {
  async crear(req, res) {
    try {
      const empaqueDTO = new EmpaqueDTO(req.body);
      const datosValidados = empaqueDTO.validarCreacion();

      const nuevoRegistro = await empaqueService.crearEmpaque(datosValidados);
      
      res.status(201).json({ success: true, data: nuevoRegistro });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async obtenerTodos(req, res) {
    try {
      const empaques = await empaqueService.obtenerTodos();
      res.status(200).json({ success: true, data: empaques });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const empaque = await empaqueService.obtenerPorId(id);
      
      if (!empaque) {
        return res.status(404).json({ success: false, message: 'Registro no encontrado' });
      }
      res.status(200).json({ success: true, data: empaque });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const empaqueActualizado = await empaqueService.actualizarEmpaque(id, req.body);
      res.status(200).json({ success: true, data: empaqueActualizado });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await empaqueService.eliminarEmpaque(id);
      res.status(200).json({ success: true, message: 'Registro eliminado' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new EmpaqueController();