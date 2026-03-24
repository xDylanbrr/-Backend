const express = require('express');
const router = express.Router();
const pedidoTerminadoController = require('../controllers/pedido_terminado.controller'); 

router.get('/', pedidoTerminadoController.obtenerTodos);
router.get('/:id', pedidoTerminadoController.obtenerPorId);
router.post('/', pedidoTerminadoController.crear);
router.put('/:id', pedidoTerminadoController.actualizar);
router.delete('/:id', pedidoTerminadoController.eliminar);

module.exports = router;