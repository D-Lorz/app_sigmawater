const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const { isAuthenticated, nologueado, registrar, login, logout } = require('../controllers/authController');




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

//* para unificar las 2 variables de subir licencia de vendedor
const multiupload = cargar.fields([{ name: 'licencia' }, { name: 'licencia_trasera' }]);




 // * ========== Renderizado de vistas vendedor ==========
//                           ↓↓
        router.get('/register', nologueado, (req, res) => {
            res.render('register')
        });
// *   ================ ===== ↑↑ ==============================




//* router para los métodos del controller

/*=============================================================*/
router.post('/registrar', nologueado, multiupload, registrar);
/*=============================================================*/

module.exports = router
