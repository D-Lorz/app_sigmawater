const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const { isAuthenticated,  } = require('../controllers/authController');
const { } = require('../controllers/customerFormControllers');
const { listar_vendedores,vistaInterna_vendedores} = require('../controllers/adminControllers');


// todo =========================================================

 // * ========== Renderizado de vistas admin ==========
//                           ↓↓
router.get('/administrador', isAuthenticated, (req, res) => {
   res.render('administrador', { user: req.user })
});
router.get('/vendedores', isAuthenticated, listar_vendedores)

// router.get('/perfil-vendedores/:id', isAuthenticated)

router.get('/perfil-vendedores', isAuthenticated, (req, res) => {
   res.render('perfil-vendedores', { user: req.user })
});



// router.get('/clientes', isAuthenticated, (req, res) => {
//   res.render('clientes', { user: req.user })
// });


// *   ================ ===== ↑↑ ==============================

//* router para los métodos del adminControllers

module.exports = router
