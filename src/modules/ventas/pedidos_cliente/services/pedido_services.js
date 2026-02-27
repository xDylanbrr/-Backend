// pedido_services.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createPedido = async (data) => {
  // Lógica de Transacción: Se crea el pedido y sus detalles en un solo paso
  return await prisma.pedido_cliente.create({
    data: {
      id_cliente: data.id_cliente,
      total: data.total,
      fecha: data.fecha,
      estado: data.estado,
      // Mapeamos los items del carrito a la tabla detalle_pedido_cliente
      detalle_pedido_cliente: {
        create: data.items.map((item) => ({
          id_producto: parseInt(item.id_producto || item.id),
          cantidad: parseInt(item.cantidad),
          precio_unitario: parseFloat(item.price || item.precio_unitario),
          subtotal: parseFloat((item.price || item.precio_unitario) * item.cantidad),
          color: item.color || null,
          tamano: item.tamano || null,
          dimensiones: item.dimensiones || null
        })),
      },
    },
    include: {
      cliente: true,
      detalle_pedido_cliente: {
        include: { producto: true }
      }
    }
  });
};

const getPedidos = async () => {
  return await prisma.pedido_cliente.findMany({
    include: {
      cliente: true,
      detalle_pedido_cliente: {
        include: { producto: true }
      }
    },
    orderBy: { fecha: 'desc' }
  });
};

const getPedidoById = async (id) => {
  return await prisma.pedido_cliente.findUnique({
    where: { id_pedido_cliente: parseInt(id) },
    include: {
      cliente: true,
      detalle_pedido_cliente: {
        include: { producto: true }
      }
    }
  });
};

const updatePedido = async (id, data) => {
  return await prisma.pedido_cliente.update({
    where: { id_pedido_cliente: parseInt(id) },
    data: {
      estado: data.estado,
      total: data.total
    }
  });
};

const deletePedido = async (id) => {
  return await prisma.pedido_cliente.delete({
    where: { id_pedido_cliente: parseInt(id) }
  });
};

module.exports = { createPedido, getPedidos, getPedidoById, updatePedido, deletePedido };