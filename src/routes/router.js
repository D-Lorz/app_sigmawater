const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const { isAuthenticated, nologueado, registrar, login, logout } = require('../controllers/authController');
const { listarClientes } = require('../controllers/formularioControllers');

const rutaAlmacen = multer.diskStorage({

    destination: function (req, file, callback) {
        const rutaLicencia = path.join(__dirname, '../public/licences')
        callback(null, rutaLicencia);
    },

    filename: function (req, file, callback) {
        const fechaActual = Math.floor(Date.now() / 1000)
        // let nomValue;
        if (file.fieldname == 'licencia') {
            urlLicencias[0] = "Seller_Licence_Front_" + fechaActual + "_" + file.originalname;
            // nomValue = urlLicencias[0]
            callback(null, urlLicencias[0])
        } else {
            urlLicencias[1] = "Seller_Licence_Back_" + fechaActual + "_" + file.originalname;
            callback(null, urlLicencias[1])
        }
        // callback(null, nomValue);
    }

});

const cargar = multer({
    storage: rutaAlmacen,
});

//TODO: SIRVE PARA UNIFICAR LOS 2 CAMPOS UPLOAD DEL FORMULARIO REGISTER
const multiupload = cargar.fields([{ name: 'licencia' }, { name: 'licencia_trasera' }]);


router.get('/register', nologueado, (req, res) => {
    res.render('register')
});

router.get('/login', nologueado, (req, res) => {
    res.render('login', { alert: false })
});

router.get('/', isAuthenticated, (req, res) => {
    console.log(">>>>>>>>>>")
console.log(req.user)
res.render('dashboard', { user: req.user })
    
});

router.get('/lista_facturas', isAuthenticated, (req, res) => {
    res.render('lista_facturas', { user: req.user })
});

router.get('/detalle_facturas', isAuthenticated, (req, res) => {
    res.render('detalle_facturas', { user: req.user })
});

router.get('/lista-clientes', isAuthenticated, listarClientes)

router.get('/nuevo-cliente', isAuthenticated, (req, res) => {
    res.render('nuevo-cliente', { user: req.user })
});


router.get('/afiliados', isAuthenticated, (req, res) => {
    res.render('afiliados', { user: req.user })
});

/*==================RUTAS =====================*/

//TODO: router para los métodos del controller

/*=============================================================*/
router.post('/registrar', nologueado, multiupload, registrar);
/*=============================================================*/
router.post('/login', nologueado, login)
/*=============================================================*/
router.get('/logout', logout)
/*=============================================================*/


module.exports = router