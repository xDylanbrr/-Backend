const express = require('express');
const router = express.Router();
const ordenPedidoController = require('../controllers/orden_pedido.controller'); 

router.get('/', ordenPedidoController.obtenerTodos);
router.get('/:id', ordenPedidoController.obtenerPorId);
router.post('/', ordenPedidoController.crear);
router.put('/:id', ordenPedidoController.actualizar);
router.delete('/:id', ordenPedidoController.eliminar);

module.exports = router;