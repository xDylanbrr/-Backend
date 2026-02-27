const cotizacionesService = require("../services/cotizacionesService.js");

async function listar(req, res) {
  try {
    const data = await cotizacionesService.listarCotizaciones();
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function crear(req, res) {
  try {
    const data = await cotizacionesService.crearCotizacion(req.body);
    res.status(201).json({ data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function obtenerPorId(req, res) {
  try {
    const data = await cotizacionesService.obtenerCotizacionPorId(req.params.id);
    if (!data) return res.status(404).json({ error: "Cotización no encontrada" });
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const data = await cotizacionesService.actualizarCotizacion(req.params.id, req.body);
    res.json({ data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function eliminar(req, res) {
  try {
    const data = await cotizacionesService.eliminarCotizacion(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  listar,
  crear,
  obtenerPorId,
  actualizar,
  eliminar,
};