const service = require("../services/materiaPrimaService");

exports.listar = async (req, res) => {
  try {
    const data = await service.listar();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const data = await service.obtenerPorId(Number(req.params.id));
    if (!data) return res.status(404).json({ error: "No encontrada" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
