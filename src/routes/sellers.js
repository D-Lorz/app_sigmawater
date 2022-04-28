const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const path = require('path');
const multer = require('multer');
const formularioControllers = require('../controllers/formularioControllers')

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
        }
      
    }

});

const cargar = multer({
    storage: rutaAlmacen,
});

//TODO: SIRVE PARA UNIFICAR LOS 2 CAMPOS UPLOAD DEL FORMULARIO REGISTER
const multiupload = cargar.fields([{ name: 'cliente_frontal' }, { name: 'cliente_trasera' }]);


router.get('/hola', authController.isAuthenticated, (req, res) => {
    res.render('hola', { correo: req.correo })
});
router.get('/documento', authController.isAuthenticated, (req, res) => {
    res.render('documento', { correo: req.correo })
});


/*==================RUTAS =====================*/

//TODO: router para los métodos del controller

/*=============================================================*/
router.post('/registrarclientela',authController.isAuthenticated,multiupload, formularioControllers.registrarclientela);
/*=============================================================*/

module.exports = router