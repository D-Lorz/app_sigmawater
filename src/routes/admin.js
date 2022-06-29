const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const { isAuthenticated } = require('../controllers/authController');
const { listarVendedores,
        listarVendedores_PerfilVendedores,
        listarClientes_PerfilClientes,
        listarClientes,
        ActualizarNivel,
        ActualizarEstado,
        ActualizarCredito,
        ActualizarMontoAprobado,
        clfirmas, factura
         } = require('../controllers/adminControllers');


 // * ========== Renderizado de vistas clientes ==========
//                           ↓↓
router.get('/vendedores', isAuthenticated, listarVendedores )
router.get('/perfil-vendedores/:id', isAuthenticated,listarVendedores_PerfilVendedores)


router.get('/listar-clientes', isAuthenticated,listarClientes)
router.get('/perfil-cliente/:id', isAuthenticated,listarClientes_PerfilClientes)

 router.get('/acuerdo/:id', isAuthenticated,clfirmas )

  router.get('/ventas', isAuthenticated,factura)

//  router.get('/documento/:id', isAuthenticated,)
 router.get('/pruebaa', isAuthenticated,(req, res) => {
        res.render('./1-admin/pruebaa', { user: req.user })
 });
// *   ================ ===== ↑↑ ==============================

           
// * ROUTER: para los métodos del controller
/*=============================================================*/  
router.post('/aprobarVendedor', isAuthenticated,ActualizarEstado);
/*=============================================================*/
router.post('/ActualizarNivel', isAuthenticated,ActualizarNivel);
/*=============================================================*/
router.post('/ActualizarCredito', isAuthenticated,ActualizarCredito);
/*=============================================================*/
 router.post('/ActualizarMontoAprobado', isAuthenticated,ActualizarMontoAprobado);
/*=============================================================*/

module.exports = router
