const { z } = require("zod");

// ── Schemas Zod ─────────────────────────────────────────────────────────────

const registroSchema = z.object({
  nombre:   z.string().min(2,  "El nombre debe tener al menos 2 caracteres"),
  cedula:   z.string().regex(/^\d{11}$/, "La cédula debe tener exactamente 11 dígitos numéricos"),
  email:    z.string().email("Formato de email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  empresa:  z.string().optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional()
});

const loginSchema = z.object({
  cedula:   z.string().min(1, "La cédula es requerida"),
  password: z.string().min(1, "La contraseña es requerida")
});

// ── Validadores (compatibles con el código existente) ────────────────────────

function validarRegistro(data) {
  // Normalizar cédula: quitar guiones antes de validar
  const dataNormalizada = { ...data, cedula: String(data.cedula || "").replace(/-/g, "") };

  const result = registroSchema.safeParse(dataNormalizada);
  if (!result.success) {
    const mensaje = result.error.errors[0]?.message || "Datos inválidos";
    return { valido: false, mensaje };
  }
  return { valido: true };
}

function validarLogin(data) {
  const result = loginSchema.safeParse(data);
  if (!result.success) {
    const mensaje = result.error.errors[0]?.message || "Datos inválidos";
    return { valido: false, mensaje };
  }
  return { valido: true };
}

// ── DTO de salida ────────────────────────────────────────────────────────────

function buyerResponseDto(cuenta) {
  const datosCliente = cuenta.cliente || {};

  const profileImage = cuenta.imagen_perfil
    ? `${process.env.BASE_URL || "http://localhost:3000"}/uploads/perfiles/${cuenta.imagen_perfil}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(datosCliente.nombre || "User")}&background=1B3A5C&color=fff`;

  return {
    id:         cuenta.id_usuario || cuenta.id,
    id_usuario: cuenta.id_usuario || cuenta.id,

    nombre:    datosCliente.nombre    || cuenta.nombre,
    cedula:    datosCliente.cedula    || cuenta.cedula,
    email:     datosCliente.correo    || datosCliente.email || cuenta.correo,
    correo:    datosCliente.correo    || datosCliente.email || cuenta.correo,
    empresa:   datosCliente.empresa   || null,
    telefono:  datosCliente.telefono  || null,
    direccion: datosCliente.direccion || null,

    rol:             cuenta.rol || "COMPRADOR",
    imagen_perfil:   cuenta.imagen_perfil,
    profileImageUrl: profileImage,
    firma:           cuenta.firma || null,
    notificaciones:  cuenta.notificaciones || []
  };
}

module.exports = {
  validarRegistro,
  validarLogin,
  buyerResponseDto
};
