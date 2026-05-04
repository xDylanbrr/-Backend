const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createPedido = async (data) => {
  try {
    console.log("🚀 createPedido iniciado");

    const pedido = await prisma.pedido_cliente.create({
      data: {
        id_cliente: parseInt(data.id_cliente),
        total: parseFloat(data.total),
        estado: "Pendiente",
        fecha: new Date(),

        detalle_pedido_cliente: {
          create: data.items.map((item) => {
            const nombre = item.title || item.nombre || item.nombre_producto || `Producto GTG`;
            const precio = parseFloat(item.precio_unitario ?? item.price ?? item.precio ?? 0);
            const cantidad = parseInt(item.cantidad) || 1;

            return {
              id_producto: item.id_producto ? parseInt(item.id_producto) : null,
              nombre_producto: nombre,
              cantidad,
              precio_unitario: precio,
              subtotal: precio * cantidad,
              color: item.color || null,
              tamano: item.tamano || null,
              dimensiones: item.dimensiones || null,
            };
          }),
        },
        // Guardamos el primer estado en el historial
        historial_pedido: {
          create: {
            estado_nuevo: "Pendiente",
            estado_anterior: null
          }
        }
      },
      include: {
        cliente: true,
        detalle_pedido_cliente: true,
        historial_pedido: true
      },
    });

    console.log("🎉 PEDIDO CREADO REALMENTE EN DB - ID:", pedido.id_pedido_cliente);
    return pedido;
  } catch (error) {
    console.error("❌ ERROR en createPedido:", error.message);
    throw error;
  }
};

const getPedidos = async () => {
  return await prisma.pedido_cliente.findMany({
    include: {
      cliente: true,
      detalle_pedido_cliente: true,
      historial_pedido: { orderBy: { fecha: 'desc' } }
    },
    orderBy: { fecha: 'desc' }
  });
};

const getPedidoById = async (id) => {
  return await prisma.pedido_cliente.findUnique({
    where: { id_pedido_cliente: parseInt(id) },
    include: {
      cliente: true,
      detalle_pedido_cliente: true,
      historial_pedido: { orderBy: { fecha: 'desc' } }
    }
  });
};

const updateEstadoPedido = async (id, nuevoEstado, idUsuario = null) => {
  const idNum = parseInt(id);
  const pedidoActual = await prisma.pedido_cliente.findUnique({ where: { id_pedido_cliente: idNum } });

  if (!pedidoActual) throw new Error("Pedido no encontrado");

  return await prisma.pedido_cliente.update({
    where: { id_pedido_cliente: idNum },
    data: {
      estado: nuevoEstado,
      historial_pedido: {
        create: {
          estado_anterior: pedidoActual.estado,
          estado_nuevo: nuevoEstado,
          id_usuario: idUsuario
        }
      }
    },
    include: { historial_pedido: true }
  });
};

const deletePedido = async (id) => {
  return await prisma.pedido_cliente.delete({
    where: { id_pedido_cliente: parseInt(id) }
  });
};

module.exports = { 
  createPedido, 
  getPedidos, 
  getPedidoById, 
  updateEstadoPedido, 
  deletePedido 
};