const express = require("express");
const router = express.Router();
const controller = require("../controllers/materiaPrimaController");

router.get("/", controller.listar);
router.get("/:id", controller.obtenerPorId);

module.exports = router;
