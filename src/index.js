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
app.use("/api/ventas/pedidos", pedidoRoutes);
app.use("/api/ventas/detalle_pedidos", detalleRoutes);
app.use("/api/ventas/facturas", facturaRoutes);

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