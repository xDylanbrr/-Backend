const express = require('express');
const router = express.Router();
// ✅ Esto debería funcionar porque controllers está en minúscula igual que tu carpeta
const despachoController = require('../controllers/despacho.controller.js'); 

router.get('/', despachoController.obtenerTodos);
router.get('/:id', despachoController.obtenerPorId);
router.post('/', despachoController.crear);
router.put('/:id', despachoController.actualizar);
router.delete('/:id', despachoController.eliminar);

module.exports = router;