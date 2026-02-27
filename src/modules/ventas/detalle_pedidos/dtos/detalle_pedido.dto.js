// dto/detalle_pedido.dto.js
class CreateDetallePedidoDTO {
  constructor(body) {
    const { id_pedido, id_producto, cantidad } = body;

    if (!id_pedido || !id_producto || !cantidad) {
      throw new Error("Faltan campos obligatorios: id_pedido, id_producto o cantidad");
    }

    this.id_pedido = id_pedido;
    this.id_producto = id_producto;
    this.cantidad = cantidad;
  }
}

module.exports = {
  CreateDetallePedidoDTO,
};