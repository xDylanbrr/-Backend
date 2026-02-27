// routes/empleados.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/empleadosController");



// Crear un empleado
router.post("/", controller.crear);

// Listar todos los empleados
router.get("/", controller.listar);

// Obtener un empleado por ID
router.get("/:id", controller.obtenerPorId);

// Actualizar un empleado
router.put("/:id", controller.actualizar);

// Eliminar un empleado por ID
router.delete("/:id", controller.eliminar);

module.exports = router;