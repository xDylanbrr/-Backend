const service = require("../services/departamentosService");

// Listar todos
exports.listar = async (req, res) => {
  try {
    // LLAMADA CORREGIDA: coincidiendo con el service
    const departamentos = await service.listarDepartamentos();

    return res.status(200).json({
      success: true,
      message: "Departamentos obtenidos correctamente",
      data: departamentos,
      total: departamentos.length
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Crear uno nuevo
exports.crear = async (req, res) => {
  try {
    if (!req.body.nombre) {
      return res.status(400).json({ success: false, error: "El nombre es obligatorio" });
    }
    const nuevo = await service.crearDepartamento(req.body);
    res.status(201).json({ success: true, data: nuevo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener por ID
exports.obtenerPorId = async (req, res) => {
  try {
    const dep = await service.obtenerDepartamentoPorId(req.params.id);
    if (!dep) return res.status(404).json({ success: false, error: "No encontrado" });
    res.status(200).json({ success: true, data: dep });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Actualizar
exports.actualizar = async (req, res) => {
  try {
    const actualizado = await service.actualizarDepartamento(req.params.id, req.body);
    res.status(200).json({ success: true, data: actualizado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Eliminar
exports.eliminar = async (req, res) => {
  try {
    await service.eliminarDepartamento(req.params.id);
    res.status(200).json({ success: true, message: "Eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};