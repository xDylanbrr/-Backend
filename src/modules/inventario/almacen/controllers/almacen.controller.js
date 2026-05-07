const almacenService = require('../services/almacen.service');

/**
 * Crear almacén
 */
const crear = async (req, res) => {
  try {
    const nuevoAlmacen = await almacenService.crear(req.body);
    return res.status(201).json({
      success: true,
      message: 'Almacén creado correctamente',
      data: nuevoAlmacen
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener todos los almacenes
 */
const listar = async (req, res) => {
  try {
    const almacenes = await almacenService.listar();
    return res.status(200).json({
      success: true,
      message: 'Lista de almacenes',
      data: almacenes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener almacén por ID
 */
const obtenerPorId = async (req, res) => {
  try {
    const almacen = await almacenService.obtenerPorId(req.params.id);
    if (!almacen) return res.status(404).json({ success: false, error: 'Almacén no encontrado' });
    return res.status(200).json({ success: true, data: almacen });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Actualizar almacén
 */
const actualizar = async (req, res) => {
  try {
    const almacenActualizado = await almacenService.actualizar(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Almacén actualizado',
      data: almacenActualizado
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Eliminar almacén
 */
const eliminar = async (req, res) => {
  try {
    await almacenService.eliminar(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Almacén eliminado'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  crear,
  listar,
  obtenerPorId,
  actualizar,
  eliminar,
};
