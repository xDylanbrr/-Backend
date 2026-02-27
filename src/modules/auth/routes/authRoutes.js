const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const service = require("../services/authService");
const dto = require("../dtos/auth.dto");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads/perfiles/")); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post("/comprador-register", controller.register);
router.post("/comprador-login", controller.login);

router.patch("/perfil/imagen", upload.single("imagenPerfil"), async (req, res) => {
  try {
    const { userId } = req.body;
    if (!req.file) return res.status(400).json({ message: "No se subió ninguna imagen" });

    const usuarioActualizado = await service.actualizarImagenPerfil(userId, req.file.filename);
    
    res.json({
      message: "Imagen de perfil actualizada",
      user: dto.buyerResponseDto(usuarioActualizado)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;