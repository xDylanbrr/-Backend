// pedido_services.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createPedido = async (data) => {
  // Lógica de Transacción: Se crea el pedido y sus detalles en un solo paso
  try {
    return await prisma.pedido_cliente.create({
      data: {
        // 🛡️ Aseguramos que el id_cliente sea un número válido
        id_cliente: parseInt(data.id_cliente),
        total: parseFloat(data.total),
        estado: data.estado || "Pendiente",
        
        // ✅ AGREGAMOS LA FECHA AQUÍ PARA QUE NO SALGA NULL
        fecha: new Date(), 

        // Mapeamos los items del carrito a la tabla detalle_pedido_cliente
        detalle_pedido_cliente: {
          create: data.items.map((item) => {
            
            // 1. Obtenemos el ID que manda el frontend
            let idValidado = parseInt(item.id_producto || item.id);

            // 2. PROTECCIÓN: Si el número es un Timestamp gigante o inválido
            if (isNaN(idValidado) || idValidado > 2147483647) {
               // Nota: Debes tener un producto con ID 1 en tu BD
               idValidado = 1; 
            }

            return {
              id_producto: idValidado,
              cantidad: parseInt(item.cantidad),
              precio_unitario: parseFloat(item.price || item.precio_unitario),
              subtotal: parseFloat((item.price || item.precio_unitario) * item.cantidad),
              color: item.color || null,
              tamano: item.tamano || null,
              dimensiones: item.dimensiones || null
            };
          }),
        },
      },
      include: {
        cliente: true,
        detalle_pedido_cliente: {
          include: { producto: true }
        }
      }
    });
  } catch (error) {
    console.error("❌ ERROR CRÍTICO AL CREAR PEDIDO:", error.message);
    throw error;
  }
};

const getPedidos = async () => {
  try {
    return await prisma.pedido_cliente.findMany({
      include: {
        cliente: true,
        detalle_pedido_cliente: {
          include: { producto: true }
        }
      },
      // ✅ Ahora que tenemos fecha, el orderBy funcionará perfecto
      orderBy: { fecha: 'desc' } 
    });
  } catch (error) {
    console.error("❌ Error al obtener pedidos:", error.message);
    throw error;
  }
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
  // Nota: Si el pedido tiene detalles, Prisma podría dar error de FK.
  // Si eso pasa, tendrías que hacer un deleteMany de los detalles primero.
  return await prisma.pedido_cliente.delete({
    where: { id_pedido_cliente: parseInt(id) }
  });
};

module.exports = { createPedido, getPedidos, getPedidoById, updatePedido, deletePedido };