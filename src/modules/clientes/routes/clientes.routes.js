const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientes.controller');

// Fíjate que usamos clientesController.getAll (el nombre debe ser idéntico al del paso 2)
router.get('/', clientesController.getAll); 
router.get('/:id', clientesController.getById);

module.exports = router;