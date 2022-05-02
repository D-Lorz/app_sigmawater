const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const { isAuthenticated, nologueado, registrar, login, logout } = require('../controllers/authController');
const {registrarclientela} = require('../controllers/formularioControllers')

const rutaAlmacen = multer.diskStorage({

    destination: function (req, file, callback) {
        const rutaLicencia = path.join(__dirname, '../public/licences_customers')
        callback(null, rutaLicencia);
    },

    filename: function (req, file, callback) {
        const fechaActual = Math.floor(Date.now() / 1000)
  
        if (file.fieldname == 'cliente_frontal') {
            urlLicencias[0] = "Licencia_Cliente_Frontal_" + fechaActual + "_" + file.originalname;
        
            callback(null, urlLicencias[0])
        } else {
            urlLicencias[1] = "Licencia_Cliente_Trasera_" + fechaActual + "_" + file.originalname;
            callback(null, urlLicencias[1])
          
        } if (file.fieldname == 'acuerdo_firmado') {
            urlLicencias[2] = "Acuerdo_Firmado" + fechaActual + "_" + file.originalname;
            callback(null, urlLicencias[2])
        }
      
    }

});

const cargar = multer({
    storage: rutaAlmacen,
});

//TODO: SIRVE PARA UNIFICAR LOS 3 CAMPOS UPLOAD DEL FORMULARIO CLIENTE
const multiupload = cargar.fields([{ name: 'cliente_frontal' }, { name: 'cliente_trasera' }, { name: 'acuerdo_firmado' }]);


router.get('/hola', (req, res) => {
    res.render('hola')
});
router.get('/documento', (req, res) => {
    res.render('documento', { user: req.user })
});


/*==================RUTAS =====================*/

//TODO: router para los métodos del controller

/*=============================================================*/
router.post('/registrarclientela', isAuthenticated, multiupload, registrarclientela);
/*=============================================================*/

module.exports = router