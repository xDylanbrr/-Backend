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

  const cedulaLimpia = data.cedula.replace(/-/g, "");
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
 * DTO de salida corregido
 */
function buyerResponseDto(cuenta) {
  const datosCliente = cuenta.cliente || cuenta;
  
  const profileImageUrl = cuenta.imagen_perfil 
    ? `http://localhost:3000/uploads/perfiles/${cuenta.imagen_perfil}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(datosCliente.nombre)}&background=0D8ABC&color=fff`;

  return {
    id: cuenta.id_usuario || cuenta.id, // ✅ Cambio clave para que el Frontend lo encuentre
    nombre: datosCliente.nombre,
    cedula: datosCliente.cedula,
    email: datosCliente.correo || datosCliente.email,
    empresa: datosCliente.empresa || null,
    telefono: datosCliente.telefono || null,
    rol: cuenta.rol || "COMPRADOR",
    profileImageUrl: profileImageUrl 
  };
}

module.exports = {
  validarRegistro,
  validarLogin,
  buyerResponseDto
};