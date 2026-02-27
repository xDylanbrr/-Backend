const express = require("express");
const router = express.Router();
const cotizacionesController = require("../controllers/cotizacionesController.js");

router.get("/", cotizacionesController.listar);
router.get("/:id", cotizacionesController.obtenerPorId);
router.post("/", cotizacionesController.crear);
router.put("/:id", cotizacionesController.actualizar);
router.delete("/:id", cotizacionesController.eliminar);

module.exports = router;