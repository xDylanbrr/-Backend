module.exports = function validateCreateMateriaDefectuosa(data) {
  const { materia_prima_id, cantidad, motivo } = data;

  if (!materia_prima_id) return "La materia prima es obligatoria";
  if (!cantidad || cantidad <= 0) return "Cantidad inválida";
  if (!motivo) return "El motivo es obligatorio";

  return null;
};
