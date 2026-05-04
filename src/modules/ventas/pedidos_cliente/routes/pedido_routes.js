// pedido_routes.js
const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedido_controllers");

router.post("/", pedidoController.createPedido);
router.get("/", pedidoController.getPedidos);
router.get("/:id", pedidoController.getPedidoById);
router.patch("/:id/estado", pedidoController.updateEstado); // Usamos PATCH para actualizaciones parciales
router.delete("/:id", pedidoController.deletePedido);

module.exports = router;