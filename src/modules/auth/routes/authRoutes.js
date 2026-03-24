const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const dir = path.join(process.cwd(), "uploads/perfiles/");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Rutas Públicas
router.post("/comprador-register", controller.register);
router.post("/comprador-login", controller.login);
router.post("/login", controller.login);

// Rutas de Perfil
router.patch("/perfil/imagen", upload.single("imagenPerfil"), controller.actualizarImagen);
router.patch("/perfil/firma", controller.guardarFirma); // ✅ RUTA DE FIRMA

module.exports = router;