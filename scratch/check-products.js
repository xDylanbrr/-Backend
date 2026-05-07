require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.producto.findMany()
  .then(res => console.log(JSON.stringify(res, null, 2)))
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
