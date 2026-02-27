// create-cotizacion.dto.js
class CreateCotizacionDTO {
  constructor({ cliente, fecha, total, observaciones }) {
    this.cliente = cliente;
    this.fecha = fecha;
    this.total = total;
    this.observaciones = observaciones;
  }
}

module.exports = CreateCotizacionDTO;

// update-cotizacion.dto.js
class UpdateCotizacionDTO {
  constructor({ cliente, fecha, total, observaciones }) {
    this.cliente = cliente;
    this.fecha = fecha;
    this.total = total;
    this.observaciones = observaciones;
  }
}

module.exports = UpdateCotizacionDTO;