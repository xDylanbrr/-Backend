// services/detalle_services.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createDetalle = async (dto) => {
  const { id_pedido, id_producto, cantidad } = dto;

  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Verificar que el pedido exista
    const pedido = await tx.pedido_cliente.findUnique({
      where: { id_pedido_cliente: id_pedido },
    });
    if (!pedido) throw new Error("Pedido no existe");

    // 2️⃣ Buscar producto en la tabla correcta (producto)
    const producto = await tx.producto.findUnique({
      where: { id_producto },
    });
    if (!producto) throw new Error("Producto no encontrado");

    const stock = producto.stock_actual ?? 0;
    if (stock < cantidad) throw new Error("Stock insuficiente");

    // Precio real del producto (del campo que definiste en la tabla producto)
    const precio_unitario = producto.precio_unitario;
    const subtotal = precio_unitario * cantidad;

    // 3️⃣ Crear detalle con los campos actuales del schema
    const nuevoDetalle = await tx.detalle_pedido_cliente.create({
      data: {
        id_pedido_cliente: id_pedido,
        id_producto: id_producto,           // ← nuevo campo obligatorio
        cantidad: cantidad,
        precio_unitario: precio_unitario,   // guardamos precio histórico
        subtotal: subtotal,                 // opcional pero útil para reportes
        // Si necesitas color, tamano, dimensiones: agrégalos aquí si vienen en dto
        // color: dto.color || null,
        // tamano: dto.tamano || null,
        // dimensiones: dto.dimensiones || null,
      },
    });

    // 4️⃣ Actualizar stock del producto
    await tx.producto.update({
      where: { id_producto },
      data: { stock_actual: stock - cantidad },
    });

    // 5️⃣ Recalcular total del pedido
    const detalles = await tx.detalle_pedido_cliente.findMany({
      where: { id_pedido_cliente: id_pedido },
    });

    const total = detalles.reduce((acc, d) => {
      // Usamos el precio_unitario guardado en cada detalle
      return acc + (d.precio_unitario || 0) * d.cantidad;
    }, 0);

    await tx.pedido_cliente.update({
      where: { id_pedido_cliente: id_pedido },
      data: { total },
    });

    return {
      message: "Detalle agregado correctamente",
      detalle: nuevoDetalle,
      subtotal,
      total_pedido: total,
    };
  });
};

const deleteDetalle = async (id_detalle) => {
  return await prisma.$transaction(async (tx) => {
    const detalle = await tx.detalle_pedido_cliente.findUnique({
      where: { id_detalle_pedido: id_detalle },
    });
    if (!detalle) throw new Error("Detalle no encontrado");

    const { id_pedido_cliente, cantidad, id_producto, precio_unitario } = detalle;

    await tx.detalle_pedido_cliente.delete({
      where: { id_detalle_pedido: id_detalle },
    });

    // 6️⃣ Restaurar stock (si aplica en tu lógica de negocio)
    if (id_producto) {
      const producto = await tx.producto.findUnique({
        where: { id_producto },
      });
      if (producto) {
        await tx.producto.update({
          where: { id_producto },
          data: { stock_actual: { increment: cantidad } }, // devolvemos al stock
        });
      }
    }

    // 7️⃣ Recalcular total del pedido después de eliminar
    const detalles = await tx.detalle_pedido_cliente.findMany({
      where: { id_pedido_cliente },
    });

    const total = detalles.reduce((acc, d) => {
      return acc + (d.precio_unitario || 0) * d.cantidad;
    }, 0);

    await tx.pedido_cliente.update({
      where: { id_pedido_cliente },
      data: { total },
    });

    return {
      message: "Detalle eliminado correctamente",
      total_actualizado: total,
    };
  });
};

module.exports = {
  createDetalle,
  deleteDetalle,
};