const express = require("express");
const router  = express.Router();
const rateLimit = require("express-rate-limit");
const controller = require("../controllers/authController");
const { verifyToken } = require("../../../middlewares/auth.middleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const dir = path.join(process.cwd(), "uploads/perfiles/");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.mimetype === "image/png"  ? ".png"
              : file.mimetype === "image/webp" ? ".webp"
              : ".jpg";
    cb(null, "avatar-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error("Tipo de archivo no permitido. Solo JPG, PNG o WebP."));
    }
    cb(null, true);
  },
});

// Máximo 5 intentos de login por IP cada 15 minutos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Demasiados intentos de acceso. Espera 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false
});

// Máximo 10 registros por IP cada hora
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: "Demasiados registros desde esta IP. Espera una hora." },
  standardHeaders: true,
  legacyHeaders: false
});

// Rutas Públicas
router.post("/comprador-register", registerLimiter, controller.register);
router.post("/comprador-login",    loginLimiter,    controller.login);
router.post("/login",              loginLimiter,    controller.login);

// Rutas de sesión
router.post("/refresh", controller.refresh);
router.post("/logout",  controller.logout);

// Rutas de Perfil (requieren sesión activa)
router.patch("/perfil/imagen", verifyToken, upload.single("imagenPerfil"), controller.actualizarImagen);
router.patch("/perfil/firma",  verifyToken, controller.guardarFirma);

module.exports = router;
