const express = require('express');
const router = express.Router();
const { obtenerTodos } = require('./reciclaje.service');

router.get('/', async (req, res) => {
    try {
        const registros = await obtenerTodos();
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
