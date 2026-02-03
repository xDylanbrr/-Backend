const service = require("../services/materiaDefectuosaService");
const validateCreate = require("../dtos/createMateriaDefectuosa.dto");

exports.crear = async (req, res) => {
  const error = validateCreate(req.body);
  if (error) return res.status(400).json({ error });

  try {
    const result = await service.crear(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listar = async (req, res) => {
  const data = await service.listar();
  res.json(data);
};

exports.obtenerPorId = async (req, res) => {
  const data = await service.obtenerPorId(Number(req.params.id));
  if (!data) return res.status(404).json({ error: "No encontrada" });
  res.json(data);
};
