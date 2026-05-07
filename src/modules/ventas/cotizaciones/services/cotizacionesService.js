const prisma = require("../../../../../prisma.config");
const Decimal = require("decimal.js");

async function crearCotizacion(data) {
  try {
    return await prisma.cotizacion.create({
      data: {
        id_cliente: parseInt(data.id_cliente),
        moneda: data.moneda || "DOP",
        peso_millar_caja: new Decimal(data.peso_millar_caja || 0),
        costo_materia_bruta: new Decimal(data.costo_materia_bruta || 0),
        porcentaje_desperdicio: new Decimal(data.porcentaje_desperdicio || 0),
        costo_materia_liquida: new Decimal(data.costo_materia_liquida || 0),
        costo_embalaje: new Decimal(data.costo_embalaje || 0),
        precio_final: new Decimal(data.precio_final || data.total || 0),
        margen_rentabilidad: new Decimal(data.margen_rentabilidad || 0),
      },
    });
  } catch (error) {
    console.error("❌ ERROR DETALLADO EN PRISMA:", error);
    throw error;
  }
}

async function listarCotizaciones() {
  return await prisma.cotizacion.findMany({
    include: { cliente: true },
    orderBy: { fecha_creacion: "desc" }
  });
}

async function obtenerCotizacionPorId(id) {
  return await prisma.cotizacion.findUnique({
    where: { id_cotizacion: Number(id) },
    include: { cliente: true }
  });
}

async function actualizarCotizacion(id, data) {
  const updateData = {};
  if (data.estado) updateData.estado = data.estado;
  if (data.moneda) updateData.moneda = data.moneda;
  if (data.peso_millar_caja !== undefined) updateData.peso_millar_caja = new Decimal(data.peso_millar_caja);
  if (data.costo_materia_bruta !== undefined) updateData.costo_materia_bruta = new Decimal(data.costo_materia_bruta);
  if (data.porcentaje_desperdicio !== undefined) updateData.porcentaje_desperdicio = new Decimal(data.porcentaje_desperdicio);
  if (data.costo_materia_liquida !== undefined) updateData.costo_materia_liquida = new Decimal(data.costo_materia_liquida);
  if (data.costo_embalaje !== undefined) updateData.costo_embalaje = new Decimal(data.costo_embalaje);
  if (data.precio_final !== undefined) updateData.precio_final = new Decimal(data.precio_final);
  if (data.margen_rentabilidad !== undefined) updateData.margen_rentabilidad = new Decimal(data.margen_rentabilidad);

  return await prisma.cotizacion.update({
    where: { id_cotizacion: Number(id) },
    data: updateData
  });
}

async function eliminarCotizacion(id) {
  return await prisma.cotizacion.delete({
    where: { id_cotizacion: Number(id) }
  });
}

module.exports = {
  crearCotizacion,
  listarCotizaciones,
  obtenerCotizacionPorId,
  actualizarCotizacion,
  eliminarCotizacion
};