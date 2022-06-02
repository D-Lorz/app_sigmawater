const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const { isAuthenticated } = require('../controllers/authController');
const { listarVendedores,isAdmin, listarVendedores_PerfilVendedores,generar_usuario_vendedor,listarAfiliadosAdmin } = require('../controllers/adminControllers');




 // * ========== Renderizado de vistas clientes ==========
//                           ↓↓
router.get('/vendedores', isAuthenticated, listarVendedores,isAdmin )
router.get('/perfil-vendedores/:id', isAuthenticated,listarVendedores_PerfilVendedores,isAdmin)

router.get('/prueba', isAuthenticated,isAdmin ,(req, res) => {
       res.render('./1-admin/prueba', { user: req.user })
});
// *   ================ ===== ↑↑ ==============================

           
// * ROUTER: para los métodos del controller
 /*=============================================================*/  
 router.post('/aprobarVendedor', isAuthenticated,generar_usuario_vendedor);
 /*=============================================================*/


module.exports = router
