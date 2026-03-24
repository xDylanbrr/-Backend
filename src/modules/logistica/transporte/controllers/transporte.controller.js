// logistica/transporte/controllers/transporte.controller.js
const transporteService = require('../services/transporte.service');
const { crearTransporteDTO } = require('../dtos/transporte.dto');

const crearTransporte = async (req, res) => {
    try {
        const datosLimpios = crearTransporteDTO(req.body);
        const nuevoTransporte = await transporteService.crear(datosLimpios);
        res.status(201).json(nuevoTransporte);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el transporte", detalles: error.message });
    }
};

const listarTransportes = async (req, res) => {
    try {
        const transportes = await transporteService.obtenerTodos();
        res.json(transportes);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener transportes" });
    }
};

module.exports = { crearTransporte, listarTransportes };