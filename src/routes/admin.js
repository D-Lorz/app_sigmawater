const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const { isAuthenticated,isAdmin } = require('../controllers/authController');
const { listarVendedores,
       listarVendedores_PerfilVendedores,
       listarClientes_PerfilClientes,
      listarClientes,
      ActualizarNivel,ActualizarEstado,
      getRegistrarInstalacion } = require('../controllers/adminControllers');


 // * ========== Renderizado de vistas clientes ==========
//                           ↓↓
router.get('/vendedores', isAuthenticated, listarVendedores )
router.get('/perfil-vendedores/:id', isAuthenticated,listarVendedores_PerfilVendedores)


router.get('/listar-clientes', isAuthenticated,listarClientes)
router.get('/perfil-cliente/:id', isAuthenticated,listarClientes_PerfilClientes)

// router.get('/registrar-instalacion/:id', isAuthenticated, getRegistrarInstalacion)



// router.get('/prueba', isAuthenticated,(req, res) => {
//        res.render('./1-admin/clientes', { user: req.user })
// });
// *   ================ ===== ↑↑ ==============================

           
// * ROUTER: para los métodos del controller
 /*=============================================================*/  
router.post('/aprobarVendedor', isAuthenticated,ActualizarEstado);
 /*=============================================================*/
router.post('/ActualizarNivel', isAuthenticated,ActualizarNivel);
/*=============================================================*/

module.exports = router
