const express = require('express');
const router = express.Router();
const produccionPedidoController = require('../controllers/produccion_pedido.controller'); 

router.get('/', produccionPedidoController.obtenerTodos);
router.get('/:id', produccionPedidoController.obtenerPorId);
router.post('/', produccionPedidoController.crear);
router.put('/:id', produccionPedidoController.actualizar);
router.delete('/:id', produccionPedidoController.eliminar);

module.exports = router;