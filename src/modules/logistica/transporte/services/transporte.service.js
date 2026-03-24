// logistica/transporte/services/transporte.service.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const crear = async (datos) => {
    return await prisma.transporte.create({
        data: datos
    });
};

const obtenerTodos = async () => {
    return await prisma.transporte.findMany({
        include: { despacho_pedido: true } // Esto trae la info del despacho relacionada
    });
};

module.exports = { crear, obtenerTodos };