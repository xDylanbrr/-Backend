class FacturaDTO {
  constructor({
    id_pedido_cliente,
    id_empleado,
    metodo_pago
  }) {

    if (!id_pedido_cliente || !id_empleado || !metodo_pago) {
      throw new Error(
        "Campos obligatorios: id_pedido_cliente, id_empleado, metodo_pago"
      );
    }

    this.id_pedido_cliente = id_pedido_cliente;
    this.id_empleado = id_empleado;
    this.metodo_pago = metodo_pago;
  }
}

module.exports = { FacturaDTO };