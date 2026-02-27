const service = require("../services/authService");
const dto = require("../dtos/auth.dto");

// Registro de Comprador
exports.register = async (req, res) => {
  // 1. Validamos los datos con el DTO
  const validacion = dto.validarRegistro(req.body);
  if (!validacion.valido) {
    return res.status(400).json({ message: validacion.mensaje });
  }

  try {
    // 2. Llamamos al servicio (actualizado a registrarUsuario)
    const usuarioCreado = await service.registrarUsuario(req.body);
    
    // 3. Respondemos con éxito
    res.status(201).json({
      message: "¡Registro exitoso! Ya puedes iniciar sesión.",
      user: dto.buyerResponseDto(usuarioCreado)
    });
  } catch (error) {
    // Si Prisma o el servicio lanzan un error (ej: cédula duplicada)
    res.status(400).json({ message: error.message });
  }
};

// Login de Comprador
exports.login = async (req, res) => {
  // 1. Validamos que vengan cédula y password
  const validacion = dto.validarLogin(req.body);
  if (!validacion.valido) {
    return res.status(400).json({ message: validacion.mensaje });
  }

  try {
    // 2. Intentamos el login (actualizado a loginUsuario)
    // El servicio ahora nos devuelve un objeto con { user, token }
    const resultado = await service.loginUsuario(req.body);
    
    // 3. Enviamos la respuesta con el Token JWT real
    res.json({
      message: "Bienvenido al sistema GTG",
      user: dto.buyerResponseDto(resultado.user),
      token: resultado.token // <-- Ahora sí es el token real generado por el servicio
    });
  } catch (error) {
    // 401 para credenciales inválidas
    res.status(401).json({ message: error.message });
  }
};