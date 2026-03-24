/**
 * Valida los datos de registro de un comprador
 */
function validarRegistro(data) {
  if (!data.nombre || !data.cedula || !data.email || !data.password) {
    return { valido: false, mensaje: "Nombre, Cédula, Email y Contraseña son obligatorios" };
  }

  if (!data.email.includes("@")) {
    return { valido: false, mensaje: "Formato de email inválido" };
  }

  if (data.password.length < 6) {
    return { valido: false, mensaje: "La contraseña debe tener al menos 6 caracteres" };
  }

  const cedulaLimpia = String(data.cedula).replace(/-/g, "");
  if (cedulaLimpia.length < 11) {
    return { valido: false, mensaje: "La cédula debe ser válida (11 dígitos)" };
  }

  return { valido: true };
}

function validarLogin(data) {
  if (!data.cedula || !data.password) {
    return { valido: false, mensaje: "Cédula y contraseña son requeridas" };
  }
  return { valido: true };
}

/**
 * DTO de salida - Nivel "Modo Dios"
 * Transforma los datos de la DB al formato que espera React
 */
function buyerResponseDto(cuenta) {
  // Manejamos si viene el objeto anidado de Prisma o datos planos
  const datosCliente = cuenta.cliente || {};
  
  const profileImage = cuenta.imagen_perfil 
    ? `http://localhost:3000/uploads/perfiles/${cuenta.imagen_perfil}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(datosCliente.nombre || 'User')}&background=1B3A5C&color=fff`;

  return {
    // Identificadores (Mandamos ambos para evitar fallos en el Frontend)
    id: cuenta.id_usuario || cuenta.id,
    id_usuario: cuenta.id_usuario || cuenta.id,
    
    // Datos personales
    nombre: datosCliente.nombre || cuenta.nombre,
    cedula: datosCliente.cedula || cuenta.cedula,
    email: datosCliente.correo || datosCliente.email || cuenta.correo,
    correo: datosCliente.correo || datosCliente.email || cuenta.correo,
    empresa: datosCliente.empresa || null,
    telefono: datosCliente.telefono || null,
    direccion: datosCliente.direccion || null,
    
    // Seguridad y Rol
    rol: cuenta.rol || "COMPRADOR",
    
    // ✅ MODO DIOS: Firma e Imagen
    imagen_perfil: cuenta.imagen_perfil,
    profileImageUrl: profileImage,
    firma: cuenta.firma || null, // Enviamos el Base64 de la firma
    
    // ✅ MODO DIOS: Notificaciones
    notificaciones: cuenta.notificaciones || [] 
  };
}

module.exports = {
  validarRegistro,
  validarLogin,
  buyerResponseDto
};