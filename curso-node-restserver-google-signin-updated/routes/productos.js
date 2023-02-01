
const { Router } = require('express');
const { check } = require('express-validator');
const {  obtenerProductos,
         crearProducto,
         obtenerProducto,
         borrarProducto,
         actualizarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');


const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');



const router = Router();

//Obtener todos los productos - publico
router.get('/', obtenerProductos );


//Obtener un producto por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo Valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,    
] ,obtenerProducto );


//Crear producto - privado cualquier persona con token valido
router.post('/', [ validarJWT,
check('nombre','El nombre es obligatorio').not().isEmpty(),
check('categoria','No es un id de Mongo').isMongoId(),
check('categoria').custom( existeCategoriaPorId ),
validarCampos
],crearProducto );


//Actualizar - privado - cualquiera con token valido
router.put('/:id',[
  validarJWT,
  // check('categoria','No es un id de Mongo').isMongoId(),
  check('id').custom( existeProductoPorId ),
  validarCampos
] ,actualizarProducto );


//Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo Valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
] ,borrarProducto);

module.exports = router;