const express = require("express");
const router = express.Router();

// 👉 IMPORT CORRECTO SEGÚN TU ARQUITECTURA
const aprobacionController = require(
  "../modules/produccion/aprobacion_productos/controllers/controllers"
);

// Crear aprobación
router.post("/", aprobacionController.crearAprobacion);

// Actualizar estado de aprobación
router.put("/:id", aprobacionController.actualizarEstado);

// Obtener todas las aprobaciones
router.get("/", aprobacionController.listarAprobaciones);

// Obtener una aprobación por ID
router.get("/:id", aprobacionController.obtenerAprobacionPorId);

module.exports = router;
