const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const { isAuthenticated, nologueado, registrar, login, logout,listarAfiliados } = require('../controllers/authController');
const { listarClientes, listarCantidadClientes,getSolicitudCreditos,registrarClientes, listarClientes_PerfilClientes,solicitarCredito} = require('../controllers/customerFormControllers');



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

// * SIRVE PARA UNIFICAR LOS 2 CAMPOS UPLOAD DEL FORMULARIO CLIENTE
const multiupload = cargar.fields([{ name: 'cliente_frontal' }, { name: 'cliente_trasera' }]);



 // * ========== Renderizado de vistas clientes ==========
//                           ↓↓
router.get('/nuevo-cliente', isAuthenticated, (req, res) => {
    res.render('nuevo-cliente', { user: req.user })
});

router.get('/lista-clientes', isAuthenticated, listarClientes)

router.get('/afiliados', isAuthenticated,listarAfiliados, (req, res) => {
    res.render('afiliados', { user: req.user })
});

router.get('/perfil-clientes/:id', isAuthenticated, listarClientes_PerfilClientes)

router.get('/solicitar-credito/:id', isAuthenticated ,getSolicitudCreditos)
// *   ================ ===== ↑↑ ==============================


//* router para los métodos del customerFormControllers

/*=============================================================*/
router.post('/registrarClientes', isAuthenticated, registrarClientes);
/*=============================================================*/
/*=============================================================*/
  router.post('/solicitarCredito', isAuthenticated, multiupload, solicitarCredito);
/*=============================================================*/

module.exports = router
