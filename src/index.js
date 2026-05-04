require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const cookieParser = require("cookie-parser");
const path   = require("path");
const fs     = require("fs");
const { verifyToken } = require("./middlewares/auth.middleware");

const app = express();

// ── Crear carpeta de uploads si no existe ────────────────────────────────────
const perfilesDir = path.join(process.cwd(), "uploads/perfiles");
if (!fs.existsSync(perfilesDir)) fs.mkdirSync(perfilesDir, { recursive: true });

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:3001"];

app.use(
  cors({
    origin: (origin, callback) => {
      // En desarrollo se permite sin Origin (Postman, curl)
      if (!origin && process.env.NODE_ENV !== "production") return callback(null, true);
      // En producción se exige Origin explícito
      if (!origin) return callback(new Error("CORS: origin requerido en producción"));
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS bloqueado: origen no permitido — ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ── Headers de seguridad ─────────────────────────────────────────────────────
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

// ── Parsers ───────────────────────────────────────────────────────────────────
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

// ── Archivos estáticos ────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ── Health check (público) ────────────────────────────────────────────────────
app.get("/", (_req, res) => res.json({ status: "API GTG operativa" }));

// ── MÓDULO AUTH (rutas públicas, sin verifyToken) ─────────────────────────────
const authRoutes = require("./modules/auth/routes/authRoutes");
app.use("/api/auth", authRoutes);

// ── GUARDIA GLOBAL: todo lo que sigue requiere JWT válido ─────────────────────
app.use("/api", verifyToken);

// ── MÓDULO ADMINISTRACIÓN ─────────────────────────────────────────────────────
const departamentosRoutes = require("./modules/administracion/departamentos/routes/departamentosRoutes");
const empleadosRoutes     = require("./modules/administracion/empleados/routes/empleadosRoutes");
app.use("/api/administracion/departamentos", departamentosRoutes);
app.use("/api/administracion/empleados",     empleadosRoutes);

// ── MÓDULO INVENTARIO ─────────────────────────────────────────────────────────
const almacenRoutes          = require("./modules/inventario/almacen/routes/almacen.routes");
const materiaDefectuosaRoutes = require("./modules/inventario/materia_defectuosa/routes/materiaDefectuosa.routes");
const materiaPrimaRoutes     = require("./modules/inventario/materia_prima/routes/materiaPrima.routes");
app.use("/api/inventario/almacen",           almacenRoutes);
app.use("/api/inventario/materia_defectuosa", materiaDefectuosaRoutes);
app.use("/api/inventario/materia_prima",     materiaPrimaRoutes);

// ── MÓDULO VENTAS ─────────────────────────────────────────────────────────────
const cotizacionesRoutes = require("./modules/ventas/cotizaciones/routes/cotizacionesRoutes.js");
const pedidoRoutes       = require("./modules/ventas/pedidos_cliente/routes/pedido_routes");
const detalleRoutes      = require("./modules/ventas/detalle_pedidos/routes/detalle_routes");
const facturaRoutes      = require("./modules/ventas/factura/routes/factura_routes");
app.use("/api/ventas/cotizaciones",    cotizacionesRoutes);
app.use("/api/pedidos",                pedidoRoutes);
app.use("/api/ventas/detalle_pedidos", detalleRoutes);
app.use("/api/ventas/facturas",        facturaRoutes);

// ── MÓDULO APROBACIONES ───────────────────────────────────────────────────────
const aprobacionRoutes = require("./routes/aprobacionRoutes");
app.use("/api/aprobaciones", aprobacionRoutes);

// ── MÓDULO LOGÍSTICA ──────────────────────────────────────────────────────────
try {
  const transporteRoutes = require("./modules/logistica/transporte/routes/transporte.routes");
  const empaqueRoutes    = require("./modules/logistica/empaque/routes/empaque.routes");
  const despachoRoutes   = require("./modules/logistica/despacho_pedido/routes/despacho.routes");
  app.use("/api/logistica/transporte", transporteRoutes);
  app.use("/api/logistica/empaque",    empaqueRoutes);
  app.use("/api/logistica/despacho",   despachoRoutes);
} catch (error) {
  console.error("❌ Error al cargar módulo logística:", error.message);
}

// ── MÓDULO PRODUCCIÓN ─────────────────────────────────────────────────────────
try {
  const ordenPedidoRoutes     = require("./modules/produccion/orden_pedido/routes/orden_pedido.routes");
  const produccionPedidoRoutes = require("./modules/produccion/produccion_pedido/routes/produccion_pedido.routes");
  const pedidoTerminadoRoutes  = require("./modules/produccion/pedido_terminado/routes/pedido_terminado.routes");
  const reciclajeRoutes        = require("./modules/produccion/reciclaje/reciclaje.routes");
  app.use("/api/produccion/orden-pedido", ordenPedidoRoutes);
  app.use("/api/produccion/proceso",      produccionPedidoRoutes);
  app.use("/api/produccion/terminado",    pedidoTerminadoRoutes);
  app.use("/api/produccion/reciclaje",    reciclajeRoutes);
} catch (error) {
  console.error("❌ Error al cargar módulo producción:", error.message);
}

// ── MANEJADOR DE ERRORES GLOBAL ───────────────────────────────────────────────
// Debe ser el último middleware
app.use((err, _req, res, _next) => {
  console.error(`[${new Date().toISOString()}] ${_req.method} ${_req.path} —`, err.message);

  // Errores de CORS
  if (err.message?.startsWith("CORS")) {
    return res.status(403).json({ error: err.message });
  }

  // En producción no exponemos el stack trace al cliente
  const message =
    process.env.NODE_ENV === "production" ? "Error interno del servidor" : err.message;

  res.status(err.status || 500).json({ error: message });
});

// ── ARRANQUE ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor GTG en puerto ${PORT} (${process.env.NODE_ENV || "development"})`);
});
