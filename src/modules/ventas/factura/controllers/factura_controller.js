const { FacturaDTO } = require("../dtos/factura_dto");
const facturaService = require("../services/factura_service");

// =============================
// CREAR FACTURA
// =============================
exports.crear = async (req, res) => {
  try {
    // Pasamos el body directo para soportar tanto facturas con pedido como manuales
    const datosFactura = req.body; 

    const nuevaFactura = await facturaService.crearFactura(datosFactura);

    return res.status(201).json({
      mensaje: "Factura creada correctamente",
      data: nuevaFactura
    });

  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
};

// =============================
// LISTAR FACTURAS
// =============================
exports.listar = async (req, res) => {
  try {
    const facturas = await facturaService.obtenerFacturas();

    return res.status(200).json({
      total: facturas.length,
      data: facturas
    });

  } catch (error) {
    return res.status(500).json({
      error: "Error al obtener las facturas"
    });
  }
};

// =============================
// OBTENER FACTURA POR ID
// =============================
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const factura = await facturaService.obtenerFacturaPorId(id);

    if (!factura) {
      return res.status(404).json({
        error: "Factura no encontrada"
      });
    }

    return res.status(200).json(factura);

  } catch (error) {
    return res.status(500).json({
      error: "Error al buscar la factura"
    });
  }
};

// =============================
// PAGAR FACTURA
// =============================
exports.pagar = async (req, res) => {
  try {
    const { id } = req.params;
    const facturaActualizada = await facturaService.pagarFactura(id);

    return res.status(200).json({
      mensaje: "Factura pagada correctamente",
      data: facturaActualizada
    });

  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
};

// =============================
// ANULAR FACTURA
// =============================
exports.anular = async (req, res) => {
  try {
    const { id } = req.params;
    const facturaActualizada = await facturaService.anularFactura(id);

    return res.status(200).json({
      mensaje: "Factura anulada correctamente",
      data: facturaActualizada
    });

  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
};

// =============================
// ELIMINAR FACTURA
// =============================
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    await facturaService.eliminarFactura(id);

    return res.status(200).json({
      mensaje: "Factura eliminada correctamente"
    });

  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
};

// =============================
// REPORTE DE VENTAS POR FECHAS
// =============================
exports.reporteVentas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        error: "Debe enviar fecha_inicio y fecha_fin"
      });
    }

    const reporte = await facturaService.reporteVentasPorFechas(
      fecha_inicio,
      fecha_fin
    );

    return res.status(200).json({
      rango: {
        desde: fecha_inicio,
        hasta: fecha_fin
      },
      data: reporte
    });

  } catch (error) {
    return res.status(500).json({
      error: "Error al generar el reporte"
    });
  }
};

// =============================
// DETALLE DE VENTAS POR FECHAS
// =============================
exports.detalleVentas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        error: "Debe enviar fecha_inicio y fecha_fin"
      });
    }

    const detalle = await facturaService.detalleVentasPorFechas(
      fecha_inicio,
      fecha_fin
    );

    return res.status(200).json({
      total_facturas: detalle.length,
      data: detalle
    });

  } catch (error) {
    return res.status(500).json({
      error: "Error al generar el detalle de ventas"
    });
  }
};