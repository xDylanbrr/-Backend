// routes/detalle_routes.js
const express = require("express");
const router = express.Router();
const detalleController = require('../controllers/detalle_controllers');  // ← agrega la "s" al final

// Crear un detalle de pedido
router.post("/detalles", detalleController.createDetalle);

// Eliminar un detalle de pedido por id
router.delete("/detalles/:id_detalle", detalleController.deleteDetalle);

module.exports = router;