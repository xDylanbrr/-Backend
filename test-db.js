const prisma = require('./prisma.config');

async function test() {
    console.log("🚀 Iniciando prueba de base de datos...");
    console.log("🔗 URL de DB en uso:", process.env.DATABASE_URL ? "CONFIGURADA (Neon)" : "NO ENCONTRADA");
    
    try {
        const clientes = await prisma.cliente.findMany({
            take: 5,
            orderBy: { id_cliente: 'desc' }
        });
        
        console.log("\n👥 ÚLTIMOS 5 CLIENTES ENCONTRADOS:");
        if (clientes.length === 0) {
            console.log("❌ No hay clientes en la tabla.");
        } else {
            console.table(clientes.map(c => ({ id: c.id_cliente, nombre: c.nombre, cedula: c.cedula })));
        }

        const usuarios = await prisma.usuario.findMany({
            take: 5,
            orderBy: { id_usuario: 'desc' }
        });

        console.log("\n🔐 ÚLTIMOS 5 USUARIOS ENCONTRADOS:");
        if (usuarios.length === 0) {
            console.log("❌ No hay usuarios en la tabla.");
        } else {
            console.table(usuarios.map(u => ({ id: u.id_usuario, id_cliente: u.id_cliente, login: u.nombre_usuario })));
        }

    } catch (error) {
        console.error("\n❌ ERROR AL CONECTAR CON NEON:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
