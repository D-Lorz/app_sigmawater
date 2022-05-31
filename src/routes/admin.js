const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const { isAuthenticated,listarAfiliados } = require('../controllers/authController');
const { listarVendedores, listarClientes_PerfilClientes,generar_usuario_vendedor,getVendedores } = require('../controllers/adminControllers');






 // * ========== Renderizado de vistas clientes ==========
//                           ↓↓

router.get('/vendedores', isAuthenticated, listarVendedores)

router.get('/perfil-vendedores/:id', isAuthenticated,listarClientes_PerfilClientes)

// *   ================ ===== ↑↑ ==============================

           
// * ROUTER: para los métodos del controller
 /*=============================================================*/  
 router.post('/aprobarVendedor', isAuthenticated,generar_usuario_vendedor);
 /*=============================================================*/


module.exports = router
