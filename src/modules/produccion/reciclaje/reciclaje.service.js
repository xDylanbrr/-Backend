const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const obtenerTodos = async () => {
    return await prisma.reciclaje.findMany({
        orderBy: { fecha: 'desc' }
    });
};

module.exports = { obtenerTodos };
