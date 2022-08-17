const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const { isAuthenticated } = require('../controllers/authController');
const { listarVendedores, listarVendedores_PerfilVendedores, listarClientes_PerfilClientes, listarClientes,
        ActualizarNivel, actualizarEstadoVendedor, ActualizarCredito, ActualizarMontoAprobado,
        clfirmas, factura, listarVendedoresss, deducciones } = require('../controllers/adminControllers');

 // * ========== Renderizado de vistas clientes ==========
//                           ↓↓
router.get('/vendedores', isAuthenticated, listarVendedores )
router.get('/perfil-vendedores/:id', isAuthenticated,listarVendedores_PerfilVendedores)
router.get('/listar-clientes', isAuthenticated,listarClientes)
router.get('/perfil-cliente/:id', isAuthenticated,listarClientes_PerfilClientes)
router.get('/acuerdo/:id', isAuthenticated,clfirmas )
router.get('/ventas', isAuthenticated,factura)
//  router.get('/documento/:id', isAuthenticated,)
router.get('/hola', isAuthenticated,listarVendedoresss)
// *   ================ ===== ↑↑ ==============================

           
// * ROUTER: para los métodos del controller
/*=============================================================*/  
router.post('/estadoDelVendedor', isAuthenticated,actualizarEstadoVendedor);
/*=============================================================*/
router.post('/ActualizarNivel', isAuthenticated,ActualizarNivel);
/*=============================================================*/
router.post('/ActualizarCredito', isAuthenticated,ActualizarCredito);
/*=============================================================*/
router.post('/ActualizarMontoAprobado', isAuthenticated,ActualizarMontoAprobado);
/*=============================================================*/

// * RUTAS PARA DEDUCCIONES EN LAS DISPERSIONES DE VENTAS
/*=============================================================*/ 
router.post('/deducciones', isAuthenticated, deducciones)

module.exports = router
