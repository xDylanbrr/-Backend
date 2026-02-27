// controllers/detalle_controller.js
const detalleService = require("../services/detalle_services");
const { CreateDetallePedidoDTO } = require("../dtos/detalle_pedido.dto");

const createDetalle = async (req, res) => {
  try {
    const dto = new CreateDetallePedidoDTO(req.body);
    const result = await detalleService.createDetalle(dto);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteDetalle = async (req, res) => {
  try {
    const { id_detalle } = req.params;
    const result = await detalleService.deleteDetalle(Number(id_detalle));
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createDetalle,
  deleteDetalle,
};