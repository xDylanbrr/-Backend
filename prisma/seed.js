const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  console.log("Iniciando sembrado completo para GTG...");

  // 1. LIMPIEZA TOTAL (Orden inverso a las relaciones)
  await prisma.transporte.deleteMany({});
  await prisma.despacho_pedido.deleteMany({});
  await prisma.empaque.deleteMany({});
  await prisma.almacen.deleteMany({});
  await prisma.control_calidad.deleteMany({});
  await prisma.materia_defectuosa.deleteMany({});
  await prisma.pedido_terminado.deleteMany({});
  await prisma.produccion_pedido.deleteMany({});
  await prisma.salida_materia_prima.deleteMany({});
  await prisma.orden_pedido.deleteMany({});
  await prisma.factura.deleteMany({});
  await prisma.aprobacion_productos.deleteMany({});
  await prisma.detalle_pedido_cliente.deleteMany({});
  await prisma.pedido_cliente.deleteMany({});
  await prisma.cotizacion.deleteMany({});
  await prisma.usuario.deleteMany({});
  await prisma.cliente.deleteMany({});
  await prisma.materia_prima.deleteMany({});
  await prisma.proveedor.deleteMany({});
  await prisma.producto.deleteMany({});
  await prisma.empleado.deleteMany({});
  await prisma.departamento.deleteMany({});

  // 2. DATOS MAESTROS
  const dptoProd = await prisma.departamento.create({ data: { nombre: "Producción", descripcion: "Planta Principal" } });
  const dptoLog = await prisma.departamento.create({ data: { nombre: "Logística", descripcion: "Almacén y Despacho" } });

  const emp1 = await prisma.empleado.create({
    data: { nombre: "Dylan", apellido: "Admin", cedula: "402-111-1", correo: "dylan@gtg.do", puesto: "Gerente", id_departamento: dptoProd.id_departamento }
  });

  const cliente = await prisma.cliente.create({
    data: { nombre: "Notions Group", empresa: "Global Tech", cedula: "001-222-2", correo: "ventas@notions.com", direccion: "Santiago, RD" }
  });

  const hashedPass = await bcrypt.hash('admin123', 10);
  await prisma.usuario.create({
    data: { id_cliente: cliente.id_cliente, nombre_usuario: "admin_gtg", clave: hashedPass, rol: "ADMIN" }
  });

  // CORRECCIÓN AQUÍ: Nombres de máximo 20 caracteres
  const prov = await prisma.proveedor.create({
    data: { 
      nombre: "Suministros RD", // Antes: "Suministros Industriales" (24 chars) - CORREGIDO
      telefono: "809-000-0000", 
      correo: "ventas@suministros.do" 
    }
  });

  const matPrima = await prisma.materia_prima.create({
    data: { 
      id_proveedor: prov.id_proveedor, 
      nombre: "Plástico Ref.", // Antes: "Plástico Reforzado" - CORREGIDO
      unidad: "Rollos", 
      stock_actual: 1000, 
      stock_minimo: 100 
    }
  });

  const prod = await prisma.producto.create({
    data: { codigo: "GTG-001", nombre: "Caja Premium", precio_unitario: 50.00, stock_actual: 100, categoria: "Empaque" }
  });

  // 3. FLUJO DE NEGOCIO
  const cotiz = await prisma.cotizacion.create({
    data: { id_cliente: cliente.id_cliente, moneda: "DOP", peso_millar_caja: 200, costo_materia_bruta: 5000, porcentaje_desperdicio: 2, costo_materia_liquida: 5100, costo_embalaje: 300, precio_final: 8000, margen_rentabilidad: 25, estado: "Aprobado" }
  });

  const pedido = await prisma.pedido_cliente.create({
    data: { id_cliente: cliente.id_cliente, estado: "En Proceso", total: 5000 }
  });

  await prisma.detalle_pedido_cliente.create({
    data: { id_pedido_cliente: pedido.id_pedido_cliente, id_producto: prod.id_producto, cantidad: 100, precio_unitario: 50, subtotal: 5000 }
  });

  await prisma.aprobacion_productos.create({
    data: { id_pedido_cliente: pedido.id_pedido_cliente, id_empleado: emp1.id_empleado, estado: "Aprobado", fecha_aprobacion: new Date() }
  });

  const orden = await prisma.orden_pedido.create({
    data: { id_pedido_cliente: pedido.id_pedido_cliente, id_empleado: emp1.id_empleado, estado: "Abierta", fecha: new Date() }
  });

  await prisma.salida_materia_prima.create({
    data: { id_orden: orden.id_orden, id_materia_prima: matPrima.id_materia_prima, id_empleado: emp1.id_empleado, cantidad: 10, fecha: new Date() }
  });

  const produccion = await prisma.produccion_pedido.create({
    data: { id_orden: orden.id_orden, id_empleado: emp1.id_empleado, estado: "Finalizado", fecha_inicio: new Date(), fecha_fin: new Date() }
  });

  await prisma.control_calidad.create({
    data: { id_produccion: produccion.id_produccion, id_empleado: emp1.id_empleado, estado: "Excelente", observaciones: "Sin defectos", fecha: new Date() }
  });

  await prisma.almacen.create({
    data: { id_produccion: produccion.id_produccion, id_empleado: emp1.id_empleado, cantidad: 100, fecha_entrada: new Date() }
  });

  const terminado = await prisma.pedido_terminado.create({
    data: { id_produccion: produccion.id_produccion, id_empleado: emp1.id_empleado, estado: "Listo para Despacho", fecha: new Date() }
  });

  await prisma.empaque.create({
    data: { id_pedido_terminado: terminado.id_pedido_terminado, id_empleado: emp1.id_empleado, tipo_empaque: "Palletizado", cantidad: 1, fecha: new Date() }
  });

  const despacho = await prisma.despacho_pedido.create({
    data: { id_pedido_terminado: terminado.id_pedido_terminado, id_empleado: emp1.id_empleado, estado: "En Ruta", destino: "Santiago Central", fecha: new Date() }
  });

  await prisma.transporte.create({
    data: { id_despacho: despacho.id_despacho, empresa: "Logística Express", chofer: "Pedro Rodriguez", placa: "L123456", fecha_salida: new Date() }
  });

  await prisma.factura.create({
    data: { id_pedido_cliente: pedido.id_pedido_cliente, id_empleado: emp1.id_empleado, monto_total: 5000, metodo_pago: "Efectivo", numero_factura: "GT-0001", rnc_cliente: "131-12345-1" }
  });

  console.log("¡Todas las tablas en Beekeeper han sido pobladas con éxito!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });