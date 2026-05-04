const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
    try {
        const users = await prisma.usuario.findMany({
            select: {
                id_usuario: true,
                nombre_usuario: true,
                rol: true,
                id_cliente: true
            }
        });
        console.log("Users in database:");
        console.table(users);
    } catch (error) {
        console.error("Error listing users:", error);
    } finally {
        await prisma.$disconnect();
    }
}

listUsers();
