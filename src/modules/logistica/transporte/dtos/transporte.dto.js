// logistica/transporte/dtos/transporte.dto.js

const crearTransporteDTO = (data) => {
    return {
        id_despacho: data.id_despacho ? parseInt(data.id_despacho) : null,
        empresa: data.empresa || "Sin Empresa",
        chofer: data.chofer || "Sin Asignar",
        placa: data.placa || "",
        fecha_salida: data.fecha_salida ? new Date(data.fecha_salida) : new Date()
    };
};

module.exports = { crearTransporteDTO };