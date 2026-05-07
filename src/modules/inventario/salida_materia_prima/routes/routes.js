const express = require('express');
const router = express.Router();
const prisma = require('../../../../../prisma.config');

router.get('/', async (req, res) => {
    try {
        const data = await prisma.salida_materia_prima.findMany({
            include: { materia_prima: true, empleado: true }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { id_orden, id_materia_prima, id_empleado, cantidad } = req.body;
        const nuevaSalida = await prisma.salida_materia_prima.create({
            data: {
                id_orden: Number(id_orden),
                id_materia_prima: Number(id_materia_prima),
                id_empleado: Number(id_empleado),
                cantidad: Number(cantidad),
                fecha: new Date()
            }
        });
        res.status(201).json(nuevaSalida);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
