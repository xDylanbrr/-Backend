const express = require("express");
const router = express.Router();
const almacenController = require("../controllers/almacen.controller");

router.post("/", (req, res) => almacenController.crear(req, res));
router.get("/", (req, res) => almacenController.listar(req, res));
router.get("/:id", (req, res) => almacenController.obtenerPorId(req, res));
router.put("/:id", (req, res) => almacenController.actualizar(req, res));
router.delete("/:id", (req, res) => almacenController.eliminar(req, res));

module.exports = router;
