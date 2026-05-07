require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedForTransporte() {
  try {
    const despacho = await prisma.despacho_pedido.upsert({
      where: { id_despacho: 1 },
      update: {},
      create: {
        id_despacho: 1,
        id_pedido_terminado: 1,
        id_empleado: 1,
        estado: "En tránsito",
        destino: "Central"
      }
    });
    console.log("Despacho 1 verificado/creado");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

seedForTransporte();
