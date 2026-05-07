require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addProduct() {
  try {
    await prisma.producto.create({
      data: {
        id_producto: 2,
        codigo: "GTG-002",
        nombre: "Empaque doypack 250ml",
        precio_unitario: 1.6,
        stock_actual: 1000,
        categoria: "Empaque"
      }
    });
    console.log("Producto 2 creado exitosamente");
  } catch(e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

addProduct();
