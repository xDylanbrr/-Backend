// logistica/transporte/dtos/transporte.dto.js

const crearTransporteDTO = (data) => {
    return {
        id_despacho: data.id_despacho ? parseInt(data.id_despacho) : null,
        empresa: data.empresa || "Sin Empresa",
        chofer: data.chofer || "Sin Asignar",
        placa: data.placa || "",
        fecha_salida: data.fecha_salida ? new Date(data.fecha_salida) : new Date(),
        // ✅ NUEVOS CAMPOS ERP 2026
        numero_paquetes: data.numero_paquetes ? parseInt(data.numero_paquetes) : 0,
        destino: data.destino || "",
        pedidos_asociados: data.pedidos_asociados || ""
    };
};

module.exports = { crearTransporteDTO };