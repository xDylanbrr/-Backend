class UpdateAlmacenDTO {
  constructor({ nombre, ubicacion, capacidad }) {
    this.nombre = nombre;
    this.ubicacion = ubicacion;
    this.capacidad = capacidad;
  }
}

module.exports = UpdateAlmacenDTO;
