const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const c = await prisma.cliente.findMany();
  console.log(c);
}

main().catch(console.error).finally(() => prisma.$disconnect());
