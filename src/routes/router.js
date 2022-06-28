const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const { isAuthenticated, nologueado, registrar, login, logout,listarAfiliados ,isSeller,isAdmin} = require('../controllers/authController');
const {} = require('../controllers/adminControllers');





 // * ========== Renderizado de vistas generales ==========
//                           ↓↓
     router.get('/login', nologueado, (req, res) => {
        res.render('login', { alert: false })
     });

      router.get('/', isAuthenticated, (req, res) => {
         if(!(req.user.rol ==="vendedor")){res.redirect('./administrador') }
            res.render('dashboard', { user: req.user })
            
     });
    router.get('/administrador', isAuthenticated, (req, res) => {
      if(!(req.user.rol ==="administrador")){res.redirect('./') }
            res.render('administrador', { user: req.user })
           
      });

 // *   ================ ===== ↑↑ ==============================


           
// * ROUTER: para los métodos del controller
/*=============================================================*/
router.post('/login', nologueado, login)
/*=============================================================*/
router.get('/logout', logout)
/*=============================================================*/


module.exports = router






// router.get('/atencion-al-cliente"', isAuthenticated, (req, res) => {
//     res.render('atencion-al-cliente"', { user: req.user })
// });

// router.get('/detalle_facturas', isAuthenticated, (req, res) => {
//     res.render('detalle_facturas', { user: req.user })
// });
