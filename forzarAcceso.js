const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); 
const prisma = new PrismaClient();

async function resetDefinitivo() {
    const clavePlana = "admin123";
    try {
        console.log("⏳ Generando nuevo Hash con bcryptjs...");
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(clavePlana, salt);

        // Usamos el ID 3 que es el de admin_gtg según tu base de datos
        const resultado = await prisma.usuario.update({
            where: { 
                id_usuario: 3 
            },
            data: { 
                nombre_usuario: "admin_gtg",
                clave: hash,
                rol: "admin" // Aseguramos que tenga el rol correcto para ver el botón
            }
        });

        console.log("✅ ¡CONTRASEÑA ACTUALIZADA!");
        console.log("-----------------------");
        console.log("👤 Usuario:", resultado.nombre_usuario);
        console.log("🔑 Nueva Clave:", clavePlana);
        console.log("🔐 Hash generado:", hash);
        console.log("-----------------------");
        console.log("👉 IMPORTANTE: Reinicia tu servidor de Backend después de esto.");

    } catch (e) {
        console.error("❌ ERROR AL ACTUALIZAR:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

resetDefinitivo();