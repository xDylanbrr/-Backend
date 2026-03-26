// pedido_controllers.js
const pedidoService = require("../services/pedido_services");
const { CreatePedidoClienteDTO, UpdatePedidoClienteDTO } = require("../dtos/pedido_cliente.dto");

const createPedido = async (req, res) => {
  try {
    const dto = new CreatePedidoClienteDTO(req.body);
    const pedido = await pedidoService.createPedido(dto);
    res.status(201).json(pedido);
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(400).json({ error: error.message });
  }
};

const getPedidos = async (req, res) => {
  try {
    const pedidos = await pedidoService.getPedidos();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPedidoById = async (req, res) => {
  try {
    const pedido = await pedidoService.getPedidoById(req.params.id);
    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Arreglado: Faltaba req y res en los parámetros
const updatePedido = async (req, res) => {
  try {
    const dto = new UpdatePedidoClienteDTO(req.body);
    const pedido = await pedidoService.updatePedido(req.params.id, dto);
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePedido = async (req, res) => {
  try {
    await pedidoService.deletePedido(req.params.id);
    res.json({ message: "Pedido eliminado correctamente de GTG" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPedido, getPedidos, getPedidoById, updatePedido, deletePedido };