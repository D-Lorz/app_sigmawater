const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const { isAuthenticated,isAdmin } = require('../controllers/authController');
const { listarVendedores, 
       listarVendedores_PerfilVendedores,
       listarClientes_PerfilClientes,
      listarClientes,
      ActualizarNivel,ActualizarEstado
       
       } = require('../controllers/adminControllers');



 // * ========== Renderizado de vistas clientes ==========
//                           ↓↓
router.get('/vendedores', isAuthenticated,isAdmin, listarVendedores )
router.get('/perfil-vendedores/:id', isAuthenticated,isAdmin,listarVendedores_PerfilVendedores)


router.get('/listar-clientes', isAuthenticated,isAdmin ,listarClientes)
router.get('/perfil-cliente/:id', isAuthenticated,isAdmin,listarClientes_PerfilClientes)

router.get('/prueba', isAuthenticated,isAdmin ,(req, res) => {
       res.render('./1-admin/clientes', { user: req.user })
});
// *   ================ ===== ↑↑ ==============================

           
// * ROUTER: para los métodos del controller
 /*=============================================================*/  
  router.post('/aprobarVendedor', isAuthenticated,isAdmin,ActualizarEstado);
 /*=============================================================*/
  router.post('/ActualizarNivel', isAuthenticated,isAdmin,ActualizarNivel);
/*=============================================================*/

module.exports = router
