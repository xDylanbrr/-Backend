require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

prisma.$connect()
  .then(() => console.log('✅ Conexión a la base de datos establecida.'))
  .catch((e) => console.error('❌ Error de conexión:', e.message));

module.exports = prisma; // Exportación única y directa