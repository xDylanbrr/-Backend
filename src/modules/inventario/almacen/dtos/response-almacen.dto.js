class ResponseAlmacenDTO {
  constructor(almacen) {
    this.id = almacen.id;
    this.nombre = almacen.nombre;
    this.ubicacion = almacen.ubicacion;
    this.capacidad = almacen.capacidad;
  }
}

module.exports = ResponseAlmacenDTO;
