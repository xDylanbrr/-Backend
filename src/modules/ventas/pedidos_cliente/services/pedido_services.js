// pedido_services.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createPedido = async (data) => {
  try {
    return await prisma.pedido_cliente.create({
      data: {
        id_cliente: parseInt(data.id_cliente),
        total: parseFloat(data.total),
        estado: data.estado || "Pendiente",
        fecha: new Date(), 
        
        detalle_pedido_cliente: {
          create: data.items.map((item) => {
            
            let idValidado = parseInt(item.id_producto || item.id);
            // ✅ Ahora siempre guardamos el nombre del producto, venga de donde venga
            let nombreGuardado = item.title || item.nombre || "Producto GTG";

            if (isNaN(idValidado) || idValidado > 10000) {
               idValidado = null; 
            }

            // ✅ PROTECCIÓN: Si el frontend no manda cantidad, asumimos 1 para evitar errores "NaN"
            let cantidadValidada = parseInt(item.cantidad) || 1;
            let precioValidado = parseFloat(item.price || item.precio_unitario) || 0;

            return {
              id_producto: idValidado,
              nombre_producto: nombreGuardado, 
              cantidad: cantidadValidada,
              precio_unitario: precioValidado,
              subtotal: precioValidado * cantidadValidada, // Ya no dará error
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
  return await prisma.pedido_cliente.delete({
    where: { id_pedido_cliente: parseInt(id) }
  });
};

module.exports = { createPedido, getPedidos, getPedidoById, updatePedido, deletePedido };