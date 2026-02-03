const service = require("../services/materiaPrimaService");

exports.listar = async (req, res) => {
  const data = await service.listar();
  res.json(data);
};

exports.obtenerPorId = async (req, res) => {
  const data = await service.obtenerPorId(Number(req.params.id));
  if (!data) return res.status(404).json({ error: "No encontrada" });
  res.json(data);
};
