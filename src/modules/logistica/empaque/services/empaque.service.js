// Ruta: src/modules/logistica/empaque/services/empaque.service.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class EmpaqueService {
  async crearEmpaque(data) {
    // Prisma se encarga de la fecha automáticamente gracias al schema
    const nuevoEmpaque = await prisma.empaque.create({
      data: data
    });
    return nuevoEmpaque;
  }

  async obtenerTodos() {
    // Buscamos en el modelo 'empaque' y ordenamos por 'fecha'
    return await prisma.empaque.findMany({
      orderBy: { fecha: 'desc' }
    });
  }

  async obtenerPorId(id) {
    // El ID real en la base de datos se llama 'id_empaque'
    return await prisma.empaque.findUnique({
      where: { id_empaque: parseInt(id) }
    });
  }

  async actualizarEmpaque(id, data) {
    return await prisma.empaque.update({
      where: { id_empaque: parseInt(id) },
      data: data
    });
  }

  async eliminarEmpaque(id) {
    return await prisma.empaque.delete({
      where: { id_empaque: parseInt(id) }
    });
  }
}

module.exports = new EmpaqueService();