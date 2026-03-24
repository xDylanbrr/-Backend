const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt'); // Si usas bcryptjs, pon 'bcryptjs' aquí
const prisma = new PrismaClient();

async function crearNuevoAdmin() {
    const usuarioNuevo = "dylan_admin"; // Tu nuevo usuario
    const claveNueva = "admin123";      // Contraseña fácil para pruebas

    try {
        console.log("⏳ Encriptando contraseña y conectando a la BD...");
        const claveHasheada = await bcrypt.hash(claveNueva, 10);

        // 👇 OJO AQUÍ: Asegúrate de que 'usuario' sea el nombre de tu tabla en Prisma
        const nuevoAdmin = await prisma.usuario.create({
            data: {
                nombre_usuario: usuarioNuevo,
                clave: claveHasheada,
                // Si tu base de datos exige otros campos obligatorios, agrégalos aquí:
                // nombre: "Dylan",
                // correo: "dylan@gtg.com",
                // rol: "admin" 
            }
        });

        console.log("✅ ¡Nuevo administrador creado con éxito!");
        console.log("========================================");
        console.log(`👤 Usuario: ${usuarioNuevo}`);
        console.log(`🔑 Contraseña: ${claveNueva}`);
        console.log("========================================");

    } catch (error) {
        console.error("❌ Error al crear el administrador:");
        console.error(error.message);
        console.log("\n💡 TIP: Revisa tu archivo 'prisma/schema.prisma'. Si el script falló, probablemente te faltó llenar algún campo obligatorio (como nombre, correo, etc.) o la tabla no se llama 'usuario'.");
    } finally {
        await prisma.$disconnect();
    }
}

crearNuevoAdmin();