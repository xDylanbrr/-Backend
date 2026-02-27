-- CreateEnum
CREATE TYPE "EstadoCotizacion" AS ENUM ('Pendiente', 'Aprobado', 'Cancelado');

-- CreateTable
CREATE TABLE "cotizacion" (
    "id_cotizacion" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moneda" VARCHAR(10) NOT NULL,
    "peso_millar_caja" DECIMAL(10,2) NOT NULL,
    "costo_materia_bruta" DECIMAL(10,2) NOT NULL,
    "porcentaje_desperdicio" DECIMAL(5,2) NOT NULL,
    "costo_materia_liquida" DECIMAL(10,2) NOT NULL,
    "costo_embalaje" DECIMAL(10,2) NOT NULL,
    "precio_final" DECIMAL(10,2) NOT NULL,
    "margen_rentabilidad" DECIMAL(10,2) NOT NULL,
    "estado" "EstadoCotizacion" NOT NULL DEFAULT 'Pendiente',

    CONSTRAINT "cotizacion_pkey" PRIMARY KEY ("id_cotizacion")
);

-- CreateTable
CREATE TABLE "almacen" (
    "id_almacen" SERIAL NOT NULL,
    "id_produccion" INTEGER,
    "id_empleado" INTEGER,
    "cantidad" INTEGER,
    "fecha_entrada" TIMESTAMP(6),

    CONSTRAINT "almacen_pkey" PRIMARY KEY ("id_almacen")
);

-- CreateTable
CREATE TABLE "aprobacion_productos" (
    "id_aprobacion" SERIAL NOT NULL,
    "id_pedido_cliente" INTEGER,
    "id_empleado" INTEGER,
    "estado" VARCHAR(50),
    "fecha_aprobacion" TIMESTAMP(6),

    CONSTRAINT "aprobacion_productos_pkey" PRIMARY KEY ("id_aprobacion")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id_cliente" SERIAL NOT NULL,
    "nombre" VARCHAR(50),
    "cedula" VARCHAR(20),
    "empresa" VARCHAR(100),
    "telefono" VARCHAR(20),
    "correo" VARCHAR(100),
    "direccion" TEXT,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "control_calidad" (
    "id_control" SERIAL NOT NULL,
    "id_produccion" INTEGER,
    "id_empleado" INTEGER,
    "estado" VARCHAR(50),
    "observaciones" TEXT,
    "fecha" TIMESTAMP(6),

    CONSTRAINT "control_calidad_pkey" PRIMARY KEY ("id_control")
);

-- CreateTable
CREATE TABLE "departamento" (
    "id_departamento" SERIAL NOT NULL,
    "nombre" VARCHAR(50),
    "descripcion" TEXT,

    CONSTRAINT "departamento_pkey" PRIMARY KEY ("id_departamento")
);

-- CreateTable
CREATE TABLE "despacho_pedido" (
    "id_despacho" SERIAL NOT NULL,
    "id_pedido_terminado" INTEGER,
    "id_empleado" INTEGER,
    "fecha" TIMESTAMP(6),
    "estado" VARCHAR(50),
    "destino" VARCHAR(100),

    CONSTRAINT "despacho_pedido_pkey" PRIMARY KEY ("id_despacho")
);

-- CreateTable
CREATE TABLE "detalle_pedido_cliente" (
    "id_detalle_pedido" SERIAL NOT NULL,
    "id_pedido_cliente" INTEGER,
    "cantidad" INTEGER NOT NULL,
    "color" VARCHAR(50),
    "tamano" VARCHAR(50),
    "dimensiones" VARCHAR(100),
    "id_producto" INTEGER,
    "precio_unitario" DECIMAL(10,2),
    "subtotal" DECIMAL(10,2),

    CONSTRAINT "detalle_pedido_cliente_pkey" PRIMARY KEY ("id_detalle_pedido")
);

-- CreateTable
CREATE TABLE "empaque" (
    "id_empaque" SERIAL NOT NULL,
    "id_pedido_terminado" INTEGER,
    "id_empleado" INTEGER,
    "tipo_empaque" VARCHAR(50),
    "cantidad" INTEGER,
    "fecha" TIMESTAMP(6),

    CONSTRAINT "empaque_pkey" PRIMARY KEY ("id_empaque")
);

-- CreateTable
CREATE TABLE "empleado" (
    "id_empleado" SERIAL NOT NULL,
    "id_departamento" INTEGER,
    "nombre" VARCHAR(20),
    "apellido" VARCHAR(20),
    "cedula" VARCHAR(20),
    "telefono" VARCHAR(20),
    "correo" VARCHAR(100),
    "puesto" VARCHAR(50),
    "fecha_contratacion" DATE,

    CONSTRAINT "empleado_pkey" PRIMARY KEY ("id_empleado")
);

-- CreateTable
CREATE TABLE "factura" (
    "id_factura" SERIAL NOT NULL,
    "id_pedido_cliente" INTEGER,
    "id_empleado" INTEGER,
    "monto_total" DECIMAL(10,2),
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "metodo_pago" VARCHAR(50),
    "estado" VARCHAR(50) DEFAULT 'Pendiente',
    "cliente_nombre" VARCHAR(255),
    "monto_base" DECIMAL(10,2),
    "monto_itbis" DECIMAL(10,2),
    "numero_factura" VARCHAR(50),
    "rnc_cliente" VARCHAR(50),

    CONSTRAINT "factura_pkey" PRIMARY KEY ("id_factura")
);

-- CreateTable
CREATE TABLE "materia_defectuosa" (
    "id_defecto" SERIAL NOT NULL,
    "id_produccion" INTEGER,
    "id_empleado" INTEGER,
    "descripcion" VARCHAR(100),
    "cantidad" INTEGER,
    "fecha" TIMESTAMP(6),

    CONSTRAINT "materia_defectuosa_pkey" PRIMARY KEY ("id_defecto")
);

-- CreateTable
CREATE TABLE "materia_prima" (
    "id_materia_prima" SERIAL NOT NULL,
    "id_proveedor" INTEGER,
    "nombre" VARCHAR(50),
    "descripcion" TEXT,
    "unidad" VARCHAR(50),
    "stock_minimo" INTEGER,
    "stock_actual" INTEGER,

    CONSTRAINT "materia_prima_pkey" PRIMARY KEY ("id_materia_prima")
);

-- CreateTable
CREATE TABLE "orden_pedido" (
    "id_orden" SERIAL NOT NULL,
    "id_pedido_cliente" INTEGER,
    "id_empleado" INTEGER,
    "fecha" TIMESTAMP(6),
    "estado" VARCHAR(50),

    CONSTRAINT "orden_pedido_pkey" PRIMARY KEY ("id_orden")
);

-- CreateTable
CREATE TABLE "pedido_cliente" (
    "id_pedido_cliente" SERIAL NOT NULL,
    "id_cliente" INTEGER,
    "fecha" TIMESTAMP(6),
    "estado" VARCHAR(50),
    "total" DECIMAL(12,2),

    CONSTRAINT "pedido_cliente_pkey" PRIMARY KEY ("id_pedido_cliente")
);

-- CreateTable
CREATE TABLE "pedido_terminado" (
    "id_pedido_terminado" SERIAL NOT NULL,
    "id_produccion" INTEGER,
    "id_empleado" INTEGER,
    "fecha" TIMESTAMP(6),
    "estado" VARCHAR(50),

    CONSTRAINT "pedido_terminado_pkey" PRIMARY KEY ("id_pedido_terminado")
);

-- CreateTable
CREATE TABLE "produccion_pedido" (
    "id_produccion" SERIAL NOT NULL,
    "id_orden" INTEGER,
    "id_empleado" INTEGER,
    "estado" VARCHAR(50),
    "fecha_inicio" TIMESTAMP(6),
    "fecha_fin" TIMESTAMP(6),

    CONSTRAINT "produccion_pedido_pkey" PRIMARY KEY ("id_produccion")
);

-- CreateTable
CREATE TABLE "proveedor" (
    "id_proveedor" SERIAL NOT NULL,
    "nombre" VARCHAR(20),
    "telefono" VARCHAR(20),
    "correo" VARCHAR(100),
    "direccion" TEXT,

    CONSTRAINT "proveedor_pkey" PRIMARY KEY ("id_proveedor")
);

-- CreateTable
CREATE TABLE "salida_materia_prima" (
    "id_salida" SERIAL NOT NULL,
    "id_orden" INTEGER,
    "id_materia_prima" INTEGER,
    "id_empleado" INTEGER,
    "cantidad" INTEGER,
    "fecha" TIMESTAMP(6),

    CONSTRAINT "salida_materia_prima_pkey" PRIMARY KEY ("id_salida")
);

-- CreateTable
CREATE TABLE "transporte" (
    "id_transporte" SERIAL NOT NULL,
    "id_despacho" INTEGER,
    "empresa" VARCHAR(50),
    "chofer" VARCHAR(50),
    "placa" VARCHAR(20),
    "fecha_salida" TIMESTAMP(6),

    CONSTRAINT "transporte_pkey" PRIMARY KEY ("id_transporte")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "id_cliente" INTEGER,
    "nombre_usuario" VARCHAR(50),
    "clave" VARCHAR(255),
    "rol" VARCHAR(50),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "producto" (
    "id_producto" SERIAL NOT NULL,
    "codigo" VARCHAR(50),
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "stock_actual" INTEGER NOT NULL DEFAULT 0,
    "stock_minimo" INTEGER NOT NULL DEFAULT 0,
    "unidad_medida" VARCHAR(20),
    "categoria" VARCHAR(50),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "producto_pkey" PRIMARY KEY ("id_producto")
);

-- CreateIndex
CREATE UNIQUE INDEX "cliente_cedula_key" ON "cliente"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "factura_numero_factura_key" ON "factura"("numero_factura");

-- CreateIndex
CREATE UNIQUE INDEX "producto_codigo_key" ON "producto"("codigo");

-- AddForeignKey
ALTER TABLE "cotizacion" ADD CONSTRAINT "cotizacion_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "almacen" ADD CONSTRAINT "almacen_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "almacen" ADD CONSTRAINT "almacen_id_produccion_fkey" FOREIGN KEY ("id_produccion") REFERENCES "produccion_pedido"("id_produccion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "aprobacion_productos" ADD CONSTRAINT "aprobacion_productos_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "aprobacion_productos" ADD CONSTRAINT "aprobacion_productos_id_pedido_cliente_fkey" FOREIGN KEY ("id_pedido_cliente") REFERENCES "pedido_cliente"("id_pedido_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "control_calidad" ADD CONSTRAINT "control_calidad_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "control_calidad" ADD CONSTRAINT "control_calidad_id_produccion_fkey" FOREIGN KEY ("id_produccion") REFERENCES "produccion_pedido"("id_produccion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "despacho_pedido" ADD CONSTRAINT "despacho_pedido_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "despacho_pedido" ADD CONSTRAINT "despacho_pedido_id_pedido_terminado_fkey" FOREIGN KEY ("id_pedido_terminado") REFERENCES "pedido_terminado"("id_pedido_terminado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_pedido_cliente" ADD CONSTRAINT "detalle_pedido_cliente_id_pedido_cliente_fkey" FOREIGN KEY ("id_pedido_cliente") REFERENCES "pedido_cliente"("id_pedido_cliente") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_pedido_cliente" ADD CONSTRAINT "detalle_pedido_cliente_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id_producto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empaque" ADD CONSTRAINT "empaque_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empaque" ADD CONSTRAINT "empaque_id_pedido_terminado_fkey" FOREIGN KEY ("id_pedido_terminado") REFERENCES "pedido_terminado"("id_pedido_terminado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empleado" ADD CONSTRAINT "empleado_id_departamento_fkey" FOREIGN KEY ("id_departamento") REFERENCES "departamento"("id_departamento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_id_pedido_cliente_fkey" FOREIGN KEY ("id_pedido_cliente") REFERENCES "pedido_cliente"("id_pedido_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "materia_defectuosa" ADD CONSTRAINT "materia_defectuosa_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "materia_defectuosa" ADD CONSTRAINT "materia_defectuosa_id_produccion_fkey" FOREIGN KEY ("id_produccion") REFERENCES "produccion_pedido"("id_produccion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "materia_prima" ADD CONSTRAINT "materia_prima_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedor"("id_proveedor") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orden_pedido" ADD CONSTRAINT "orden_pedido_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orden_pedido" ADD CONSTRAINT "orden_pedido_id_pedido_cliente_fkey" FOREIGN KEY ("id_pedido_cliente") REFERENCES "pedido_cliente"("id_pedido_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedido_cliente" ADD CONSTRAINT "pedido_cliente_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_cliente") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_terminado" ADD CONSTRAINT "pedido_terminado_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedido_terminado" ADD CONSTRAINT "pedido_terminado_id_produccion_fkey" FOREIGN KEY ("id_produccion") REFERENCES "produccion_pedido"("id_produccion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "produccion_pedido" ADD CONSTRAINT "produccion_pedido_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "produccion_pedido" ADD CONSTRAINT "produccion_pedido_id_orden_fkey" FOREIGN KEY ("id_orden") REFERENCES "orden_pedido"("id_orden") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "salida_materia_prima" ADD CONSTRAINT "salida_materia_prima_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "salida_materia_prima" ADD CONSTRAINT "salida_materia_prima_id_materia_prima_fkey" FOREIGN KEY ("id_materia_prima") REFERENCES "materia_prima"("id_materia_prima") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "salida_materia_prima" ADD CONSTRAINT "salida_materia_prima_id_orden_fkey" FOREIGN KEY ("id_orden") REFERENCES "orden_pedido"("id_orden") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transporte" ADD CONSTRAINT "transporte_id_despacho_fkey" FOREIGN KEY ("id_despacho") REFERENCES "despacho_pedido"("id_despacho") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;
