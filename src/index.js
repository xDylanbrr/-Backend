const express = require("express");
const app = express();

// =====================
// MIDDLEWARE GLOBAL
// =====================
app.use(express.json());

// =====================
// RUTAS GLOBALES
// =====================
const aprobacionRoutes = require("./routes/aprobacionRoutes");
app.use("/api/aprobaciones", aprobacionRoutes);

// =====================
// MÓDULO ADMINISTRACIÓN
// =====================
const departamentosRoutes = require(
  "./modules/administracion/departamentos/routes/departamentosRoutes"
);

const empleadosRoutes = require(
  "./modules/administracion/empleados/routes/empleadosRoutes"
);

app.use("/api/administracion/departamentos", departamentosRoutes);
app.use("/api/administracion/empleados", empleadosRoutes);

// =====================
// MÓDULO AUTH
// =====================
const authRoutes = require("./modules/auth/routes/authRoutes");
app.use("/api/auth", authRoutes);

// =====================
// MÓDULO INVENTARIO
// =====================
const almacenRoutes = require(
  "./modules/inventario/almacen/routes/almacen.routes"
);

const materiaDefectuosaRoutes = require(
  "./modules/inventario/materia_defectuosa/routes/materiaDefectuosa.routes"
);

const materiaPrimaRoutes = require(
  "./modules/inventario/materia_prima/routes/materiaPrima.routes"
);

app.use("/api/inventario/almacen", almacenRoutes);
app.use("/api/inventario/materia-defectuosa", materiaDefectuosaRoutes);
app.use("/api/inventario/materia-prima", materiaPrimaRoutes);

// =====================
// RUTA DE PRUEBA DE DEPARTAMENTOS
// =====================




// =====================
// RUTA BASE
// =====================
app.get("/", (req, res) => {
  res.send("API GTG funcionando correctamente");
});



// =====================
// SERVIDOR
// =====================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto http://localhost:${PORT}`);
});


