// Ruta: src/modules/logistica/empaque/routes/empaque.routes.js

const { Router } = require('express');
const empaqueController = require('../controllers/empaque.controller');

const router = Router();

router.post('/', empaqueController.crear);
router.get('/', empaqueController.obtenerTodos);
router.get('/:id', empaqueController.obtenerPorId);
router.put('/:id', empaqueController.actualizar);
router.delete('/:id', empaqueController.eliminar);

module.exports = router;