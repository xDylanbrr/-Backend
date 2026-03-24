// logistica/transporte/routes/transporte.routes.js
const express = require('express');
const router = express.Router();
const transporteController = require('../controllers/transporte.controller');

router.post('/', transporteController.crearTransporte);
router.get('/', transporteController.listarTransportes);

module.exports = router;