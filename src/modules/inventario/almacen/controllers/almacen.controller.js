const CreateAlmacenDto = require('../dtos/create_almacen.dto');
const UpdateAlmacenDto = require('../dtos/update_almacen.dto');
const ResponseAlmacenDto = require('../dtos/response-almacen.dto');

/**
 * Crear almacén
 */
const crearAlmacen = async (req, res) => {
  try {
    const createDto = new CreateAlmacenDto(req.body);

    // AQUÍ luego irá tu lógica de BD (service o model)
    // const almacen = await almacenService.create(createDto);

    return res.status(201).json(
      new ResponseAlmacenDto(true, 'Almacén creado correctamente', createDto)
    );
  } catch (error) {
    return res.status(400).json(
      new ResponseAlmacenDto(false, error.message, null)
    );
  }
};

/**
 * Obtener todos los almacenes
 */
const obtenerAlmacenes = async (req, res) => {
  try {
    // const almacenes = await almacenService.findAll();

    return res.status(200).json(
      new ResponseAlmacenDto(true, 'Lista de almacenes', [])
    );
  } catch (error) {
    return res.status(500).json(
      new ResponseAlmacenDto(false, error.message, null)
    );
  }
};

/**
 * Actualizar almacén
 */
const actualizarAlmacen = async (req, res) => {
  try {
    const { id } = req.params;
    const updateDto = new UpdateAlmacenDto(req.body);

    // const almacen = await almacenService.update(id, updateDto);

    return res.status(200).json(
      new ResponseAlmacenDto(true, 'Almacén actualizado', updateDto)
    );
  } catch (error) {
    return res.status(400).json(
      new ResponseAlmacenDto(false, error.message, null)
    );
  }
};

/**
 * Eliminar almacén
 */
const eliminarAlmacen = async (req, res) => {
  try {
    const { id } = req.params;

    // await almacenService.delete(id);

    return res.status(200).json(
      new ResponseAlmacenDto(true, 'Almacén eliminado', null)
    );
  } catch (error) {
    return res.status(500).json(
      new ResponseAlmacenDto(false, error.message, null)
    );
  }
};

module.exports = {
  crearAlmacen,
  obtenerAlmacenes,
  actualizarAlmacen,
  eliminarAlmacen,
};
