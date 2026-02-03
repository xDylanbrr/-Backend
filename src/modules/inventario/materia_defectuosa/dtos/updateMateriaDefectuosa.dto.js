module.exports = function validateUpdateMateriaDefectuosa(data) {
  const { cantidad, motivo } = data;

  if (cantidad !== undefined && cantidad <= 0)
    return "Cantidad inválida";

  if (motivo !== undefined && motivo.trim() === "")
    return "Motivo inválido";

  return null;
};
