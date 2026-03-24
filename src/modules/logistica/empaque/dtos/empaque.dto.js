// Ruta: src/modules/logistica/empaque/dtos/empaque.dto.js

class EmpaqueDTO {
  constructor(data) {
    // Recibimos los datos con los nombres exactos que envía el Frontend
    this.id_pedido_terminado = data.id_pedido_terminado;
    this.id_empleado = data.id_empleado;
    this.cantidad = data.cantidad;
    this.peso_total = data.peso_total;
    this.tipo_empaque = data.tipo_empaque;
    this.estado = data.estado || 'Completado';
    this.observaciones = data.observaciones || '';
  }

  validarCreacion() {
    const errores = [];

    // Validaciones lógicas
    if (!this.id_pedido_terminado) errores.push("El ID del lote (pedido_terminado) es obligatorio.");
    if (!this.id_empleado) errores.push("El ID del empleado responsable es obligatorio.");
    if (!this.cantidad || this.cantidad <= 0) errores.push("La cantidad de bultos debe ser mayor a 0.");
    if (!this.peso_total || this.peso_total <= 0) errores.push("El peso total debe ser mayor a 0.");
    if (!this.tipo_empaque) errores.push("El tipo de empaque es obligatorio.");

    // Si hay errores, detenemos el proceso y le avisamos al Frontend
    if (errores.length > 0) {
      throw new Error(errores.join(' '));
    }

    // Si todo está bien, devolvemos los datos limpios para Prisma
    return {
      id_pedido_terminado: parseInt(this.id_pedido_terminado),
      id_empleado: parseInt(this.id_empleado),
      cantidad: parseInt(this.cantidad),
      peso_total: parseFloat(this.peso_total),
      tipo_empaque: this.tipo_empaque,
      estado: this.estado,
      observaciones: this.observaciones
    };
  }
}

module.exports = EmpaqueDTO;