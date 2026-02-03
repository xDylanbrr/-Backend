const EstadoAprobacion = require("../enums/estadoAprobacion");
const pool = require("../../db"); // ruta correcta

exports.crearAprobacion = async (req, res) => {
  const { id_pedido_cliente, id_empleado, estado } = req.body;

  // Validación del enum
  if (!Object.values(EstadoAprobacion).includes(estado)) {
    return res.status(400).json({
      error: "Estado de aprobación no válido"
    });
  }

  try {
    await pool.query(
      `INSERT INTO aprobacion_productos
       (id_pedido_cliente, id_empleado, estado, fecha_aprobacion)
       VALUES ($1, $2, $3, NOW())`,
      [id_pedido_cliente, id_empleado, estado]
    );

    res.json({ mensaje: "Aprobación registrada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar aprobación" });
  }
};

exports.actualizarEstado = async (req, res) => {
  const { estado } = req.body;

  if (!Object.values(EstadoAprobacion).includes(estado)) {
    return res.status(400).json({ error: "Estado no válido" });
  }

  await pool.query(
    `UPDATE aprobacion_productos
     SET estado = $1
     WHERE id_aprobacion = $2`,
    [estado, req.params.id]
  );

  res.json({ mensaje: "Estado actualizado correctamente" });
};
