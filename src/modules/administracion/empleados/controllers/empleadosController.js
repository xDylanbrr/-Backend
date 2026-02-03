const service = require("../services/empleadosService");
const dto = require("../dtos/empleados.dto");

exports.listar = async (req, res) => {
  try {
    const empleados = await service.listarEmpleados(); // Nombre sincronizado
    res.status(200).json({ success: true, data: empleados, total: empleados.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.crear = async (req, res) => {
  const validacion = dto.validarCrearEmpleado(req.body);
  if (!validacion.valido) return res.status(400).json({ success: false, error: validacion.mensaje });

  try {
    const empleado = await service.crearEmpleado(req.body);
    res.status(201).json({ success: true, data: empleado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const empleado = await service.obtenerEmpleadoPorId(req.params.id);
    if (!empleado) return res.status(404).json({ success: false, error: "No encontrado" });
    res.json({ success: true, data: empleado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  const validacion = dto.validarActualizarEmpleado(req.body);
  if (!validacion.valido) return res.status(400).json({ success: false, error: validacion.mensaje });

  try {
    const actualizado = await service.actualizarEmpleado(req.params.id, req.body);
    res.json({ success: true, data: actualizado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    await service.eliminarEmpleado(req.params.id);
    res.json({ success: true, mensaje: "Eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};