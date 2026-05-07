require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
prisma.$queryRawUnsafe("SELECT 1")
  .then((res) => console.log("Connection successful:", res))
  .catch((err) => console.error("Connection failed:", err))
  .finally(() => prisma.$disconnect());
