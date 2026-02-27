const prisma = require("../../../../../prisma.config");
const Decimal = require("decimal.js");

async function crearCotizacion(data) {
  try {
    return await prisma.cotizacion.create({
      data: {
        // Obligatorio: Debe ser un ID de cliente válido que exista en la tabla 'cliente'
        id_cliente: parseInt(data.id_cliente), 
        
        moneda: data.moneda || "DOP",
        
        // Conversión a Decimal estricta para todos tus campos numéricos obligatorios
        peso_millar_caja: new Decimal(data.peso_millar_caja || 0),
        costo_materia_bruta: new Decimal(data.costo_materia_bruta || 0),
        porcentaje_desperdicio: new Decimal(data.porcentaje_desperdicio || 0),
        costo_materia_liquida: new Decimal(data.costo_materia_liquida || 0),
        costo_embalaje: new Decimal(data.costo_embalaje || 0),
        precio_final: new Decimal(data.precio_final || data.total || 0), // Aceptamos "total" pero lo guardamos en "precio_final"
        margen_rentabilidad: new Decimal(data.margen_rentabilidad || 0),
        
        // Nota: No incluimos "observaciones" porque no existe en tu schema.prisma
      },
    });
  } catch (error) {
    console.error("❌ ERROR DETALLADO EN PRISMA:", error);
    throw error;
  }
}

// ... mantén tus otras funciones listarCotizaciones, etc. ...
module.exports = { crearCotizacion, /* tus otras funciones */ };