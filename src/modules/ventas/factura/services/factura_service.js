const prisma = require("../../../../../db");

// =============================
// CREAR FACTURA (SOPORTA PEDIDO O MANUAL WEB)
// =============================
exports.crearFactura = async (datosFactura) => {
  const {
    id_pedido_cliente,
    id_empleado,
    metodo_pago,
    // Nuevos campos para la factura manual/web
    cliente_nombre,
    rnc_cliente,
    monto_base
  } = datosFactura;

  // 1️⃣ Generar el número de factura para ambos casos (FAC-100X)
  const count = await prisma.factura.count();
  const numero_factura = `FAC-${1000 + count + 1}`;

  // ==========================================================
  // FLUJO A: FACTURA DESDE UN PEDIDO (Lógica original de la fábrica)
  // ==========================================================
  if (id_pedido_cliente) {
    return await prisma.$transaction(async (tx) => {
      // 1️⃣ Verificar que el pedido exista
      const pedido = await tx.pedido_cliente.findUnique({
        where: { id_pedido_cliente: Number(id_pedido_cliente) },
        include: { detalle_pedido_cliente: true }
      });

      if (!pedido) {
        throw new Error("El pedido no existe");
      }

      if (pedido.estado === "facturado") {
        throw new Error("Este pedido ya fue facturado");
      }

      if (!pedido.detalle_pedido_cliente.length) {
        throw new Error("El pedido no tiene productos");
      }

      // 2️⃣ Calcular total
      const monto_total = pedido.detalle_pedido_cliente.reduce(
        (acc, item) =>
          acc + Number(item.cantidad) * Number(item.precio_unitario || 0),
        0
      );

      if (monto_total <= 0) {
        throw new Error("El pedido no tiene monto válido");
      }

      // Cálculos contables para República Dominicana
      const base_pedido = monto_total / 1.18;
      const itbis_pedido = monto_total - base_pedido;

      // 3️⃣ Crear factura
      const factura = await tx.factura.create({
        data: {
          numero_factura,
          id_pedido_cliente: Number(id_pedido_cliente),
          id_empleado: id_empleado ? Number(id_empleado) : null,
          monto_base: base_pedido,
          monto_itbis: itbis_pedido,
          monto_total,
          fecha: new Date(),
          metodo_pago: metodo_pago || "No especificado",
          estado: "emitida"
        }
      });

      // 4️⃣ Actualizar pedido a facturado
      await tx.pedido_cliente.update({
        where: { id_pedido_cliente: Number(id_pedido_cliente) },
        data: { estado: "facturado" }
      });

      return factura;
    });
  }

  // ==========================================================
  // FLUJO B: FACTURA MANUAL O DESDE LA WEB (Configurador)
  // ==========================================================
  if (!monto_base) {
    throw new Error("Se requiere un pedido asociado o un monto base para facturar manualmente.");
  }

  const base = parseFloat(monto_base);
  const itbis = base * 0.18;
  const total = base + itbis;

  return await prisma.factura.create({
    data: {
      numero_factura,
      cliente_nombre: cliente_nombre || "Cliente Web",
      rnc_cliente: rnc_cliente || null,
      monto_base: base,
      monto_itbis: itbis,
      monto_total: total,
      id_empleado: id_empleado ? Number(id_empleado) : null,
      fecha: new Date(),
      metodo_pago: metodo_pago || "Transferencia / Web",
      estado: "Pendiente"
    }
  });
};

// =============================
// LISTAR FACTURAS
// =============================
exports.obtenerFacturas = async () => {
  return await prisma.factura.findMany({
    orderBy: { fecha: "desc" }
  });
};

// =============================
// OBTENER FACTURA POR ID
// =============================
exports.obtenerFacturaPorId = async (id) => {
  return await prisma.factura.findUnique({
    where: { id_factura: Number(id) }
  });
};

// =============================
// PAGAR FACTURA
// =============================
exports.pagarFactura = async (id) => {
  const factura = await prisma.factura.findUnique({
    where: { id_factura: Number(id) }
  });

  if (!factura) {
    throw new Error("La factura no existe");
  }

  if (factura.estado === "pagada") {
    throw new Error("La factura ya está pagada");
  }

  if (factura.estado === "anulada") {
    throw new Error("No se puede pagar una factura anulada");
  }

  return await prisma.factura.update({
    where: { id_factura: Number(id) },
    data: { estado: "pagada" }
  });
};

// =============================
// ANULAR FACTURA
// =============================
exports.anularFactura = async (id) => {
  const factura = await prisma.factura.findUnique({
    where: { id_factura: Number(id) }
  });

  if (!factura) {
    throw new Error("La factura no existe");
  }

  if (factura.estado === "pagada") {
    throw new Error("No se puede anular una factura pagada");
  }

  if (factura.estado === "anulada") {
    throw new Error("La factura ya está anulada");
  }

  return await prisma.factura.update({
    where: { id_factura: Number(id) },
    data: { estado: "anulada" }
  });
};

// =============================
// ELIMINAR FACTURA
// =============================
exports.eliminarFactura = async (id) => {
  const factura = await prisma.factura.findUnique({
    where: { id_factura: Number(id) }
  });

  if (!factura) {
    throw new Error("La factura no existe");
  }

  if (factura.estado === "pagada") {
    throw new Error("No se puede eliminar una factura pagada");
  }

  await prisma.factura.delete({
    where: { id_factura: Number(id) }
  });

  return true;
};

// =============================
// REPORTE DE VENTAS POR FECHAS
// =============================
exports.reporteVentasPorFechas = async (fecha_inicio, fecha_fin) => {
  const facturas = await prisma.factura.findMany({
    where: {
      estado: "pagada",
      fecha: {
        gte: new Date(fecha_inicio),
        lte: new Date(fecha_fin)
      }
    }
  });

  const total_facturas = facturas.length;

  const total_vendido = facturas.reduce(
    (acc, f) => acc + Number(f.monto_total || 0),
    0
  );

  return {
    total_facturas,
    total_vendido
  };
};

// =============================
// DETALLE DE VENTAS POR FECHAS
// =============================
exports.detalleVentasPorFechas = async (fecha_inicio, fecha_fin) => {
  return await prisma.factura.findMany({
    where: {
      estado: "pagada",
      fecha: {
        gte: new Date(fecha_inicio),
        lte: new Date(fecha_fin)
      }
    },
    orderBy: { fecha: "asc" }
  });
};