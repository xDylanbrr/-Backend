require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs"); 
const app = express();

// =====================
// VERIFICACIÓN DE CARPETAS
// =====================
const perfilesDir = path.join(process.cwd(), 'uploads/perfiles');
if (!fs.existsSync(perfilesDir)) {
    fs.mkdirSync(perfilesDir, { recursive: true });
    console.log("📁 Carpeta 'uploads/perfiles' creada");
}

// =====================
// MIDDLEWARE GLOBAL
// =====================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], 
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// =====================
// CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS
// =====================
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// =====================
// RUTAS GLOBALES
// =====================
const aprobacionRoutes = require("./routes/aprobacionRoutes"); 
app.use("/api/aprobaciones", aprobacionRoutes);

// MÓDULO ADMINISTRACIÓN
const departamentosRoutes = require("./modules/administracion/departamentos/routes/departamentosRoutes");
const empleadosRoutes = require("./modules/administracion/empleados/routes/empleadosRoutes");
app.use("/api/administracion/departamentos", departamentosRoutes);
app.use("/api/administracion/empleados", empleadosRoutes);

// MÓDULO AUTH
const authRoutes = require("./modules/auth/routes/authRoutes");
app.use("/api/auth", authRoutes);

// MÓDULO INVENTARIO
const almacenRoutes = require("./modules/inventario/almacen/routes/almacen.routes");
const materiaDefectuosaRoutes = require("./modules/inventario/materia_defectuosa/routes/materiaDefectuosa.routes");
const materiaPrimaRoutes = require("./modules/inventario/materia_prima/routes/materiaPrima.routes");
app.use("/api/inventario/almacen", almacenRoutes);
app.use("/api/inventario/materia_defectuosa", materiaDefectuosaRoutes);
app.use("/api/inventario/materia_prima", materiaPrimaRoutes);

// MÓDULO VENTAS
const cotizacionesRoutes = require("./modules/ventas/cotizaciones/routes/cotizacionesRoutes.js");
const pedidoRoutes = require("./modules/ventas/pedidos_cliente/routes/pedido_routes");
const detalleRoutes = require("./modules/ventas/detalle_pedidos/routes/detalle_routes");
const facturaRoutes = require("./modules/ventas/factura/routes/factura_routes");
app.use("/api/ventas/cotizaciones", cotizacionesRoutes);
app.use("/api/pedidos", pedidoRoutes); 
app.use("/api/ventas/detalle_pedidos", detalleRoutes);
app.use("/api/ventas/facturas", facturaRoutes);

// =====================
// MÓDULO LOGÍSTICA 🚚
// =====================
console.log("⏳ Intentando montar el módulo de logística...");
try {
    app.get("/api/logistica/prueba-directa", (req, res) => {
        res.status(200).json({ mensaje: "¡El index.js nuevo está funcionando perfectamente!" });
    });

    const transporteRoutes = require("./modules/logistica/transporte/routes/transporte.routes");
    app.use("/api/logistica/transporte", transporteRoutes);
    
    const empaqueRoutes = require("./modules/logistica/empaque/routes/empaque.routes");
    app.use("/api/logistica/empaque", empaqueRoutes);

    const despachoRoutes = require("./modules/logistica/despacho_pedido/routes/despacho.routes"); 
    app.use("/api/logistica/despacho", despachoRoutes);
    
    console.log("✅ Módulo de logística montado correctamente (Transporte, Empaque y Despacho).");
} catch (error) {
    console.error("❌ ERROR CRÍTICO al cargar logística:", error.message);
}

// =====================
// MÓDULO PRODUCCIÓN 🏭 
// =====================
console.log("⏳ Intentando montar el módulo de producción...");
try {
    // 1. ORDEN DE PEDIDO
    const ordenPedidoRoutes = require("./modules/produccion/orden_pedido/routes/orden_pedido.routes"); 
    app.use("/api/produccion/orden-pedido", ordenPedidoRoutes);
    
    // 2. PRODUCCIÓN PEDIDO (PROCESO)
    const produccionPedidoRoutes = require("./modules/produccion/produccion_pedido/routes/produccion_pedido.routes");
    app.use("/api/produccion/proceso", produccionPedidoRoutes);

    // 3. PEDIDO TERMINADO (FIN DE FÁBRICA) - ✅ AHORA SÍ CONECTADO
    const pedidoTerminadoRoutes = require("./modules/produccion/pedido_terminado/routes/pedido_terminado.routes");
    app.use("/api/produccion/terminado", pedidoTerminadoRoutes);
    
    console.log("✅ Módulo de producción montado correctamente (Orden, Proceso, Terminado).");
} catch (error) {
    console.error("❌ ERROR CRÍTICO al cargar producción:", error.message);
}

// =====================
// RUTA BASE Y ERRORES
// =====================
app.get("/", (req, res) => {
  res.send("API GTG funcionando correctamente 🚀");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Algo salió mal en el servidor", error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});