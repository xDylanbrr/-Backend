require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedForEmpaque() {
  try {
    // 1. Asegurar que existe el empleado 1
    const empleado = await prisma.empleado.upsert({
      where: { id_empleado: 1 },
      update: {},
      create: {
        id_empleado: 1,
        nombre: "Juan",
        apellido: "Pérez",
        cedula: "12345678901",
        puesto: "Empacador"
      }
    });
    console.log("Empleado 1 verificado/creado");

    // 2. Asegurar que existe el pedido_terminado 1
    const pedidoTerminado = await prisma.pedido_terminado.upsert({
      where: { id_pedido_terminado: 1 },
      update: {},
      create: {
        id_pedido_terminado: 1,
        id_empleado: 1,
        estado: "Completado"
      }
    });
    console.log("Pedido Terminado 1 verificado/creado");

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

seedForEmpaque();
