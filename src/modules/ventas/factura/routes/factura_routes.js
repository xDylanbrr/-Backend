const express = require("express");
const router = express.Router();

const facturaController = require("../controllers/factura_controller");

// =============================
// CREAR FACTURA
// =============================
router.post("/", facturaController.crear);

// =============================
// LISTAR FACTURAS
// =============================
router.get("/", facturaController.listar);

// =============================
// REPORTES (ANTES DE :id)
// =============================
router.get("/reporte/ventas", facturaController.reporteVentas);
router.get("/reporte/detalle", facturaController.detalleVentas);

// =============================
// OBTENER FACTURA POR ID
// =============================
router.get("/:id", facturaController.obtenerPorId);

// =============================
// ELIMINAR FACTURA
// =============================
router.delete("/:id", facturaController.eliminar);

// =============================
// PAGAR FACTURA
// =============================
router.put("/:id/pagar", facturaController.pagar);

// =============================
// ANULAR FACTURA
// =============================
router.put("/:id/anular", facturaController.anular);

module.exports = router;