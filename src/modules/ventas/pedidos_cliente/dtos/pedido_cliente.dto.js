// pedido_cliente.dto.js
class CreatePedidoClienteDTO {
  constructor({ id_cliente, total, items, fecha, estado }) {
    if (!id_cliente) throw new Error("El id_cliente es obligatorio");
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("El pedido debe contener al menos un producto");
    }
    if (!total || total <= 0) throw new Error("El total del pedido no es válido");

    // ✅ NUEVO: Validación rápida de cada producto en el carrito
    items.forEach((item, index) => {
      const nombre = item.title || item.nombre;
      if (!nombre) {
        throw new Error(`El producto en la posición ${index + 1} del carrito no tiene nombre válido.`);
      }
    });

    this.id_cliente = parseInt(id_cliente);
    this.total = parseFloat(total);
    this.fecha = fecha ? new Date(fecha) : new Date();
    this.estado = estado || "Pendiente";
    this.items = items; // El array de productos del carrito ya validado
  }
}

class UpdatePedidoClienteDTO {
  constructor({ estado, total }) {
    this.estado = estado;
    if (total) this.total = parseFloat(total);
  }
}

module.exports = { CreatePedidoClienteDTO, UpdatePedidoClienteDTO };