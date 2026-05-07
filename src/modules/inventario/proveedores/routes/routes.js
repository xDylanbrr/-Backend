const express = require('express');
const router = express.Router();
const prisma = require('../../../../../prisma.config');

router.get('/', async (req, res) => {
    try {
        const data = await prisma.proveedor.findMany();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevo = await prisma.proveedor.create({ data: req.body });
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
