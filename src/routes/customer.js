const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const cron = require('node-cron');
const { isAuthenticated, listarAfiliados, ventasVendedor} = require('../controllers/authController');
const { listarClientes, getSolicitudCreditos, getAhorro, getTestAgua, getAgendarinstalacion,
        registrarClientes,ahorro, testAgua,  listarClientes_PerfilClientes, solicitarCredito,
        agendarInstalacionProducto,getRegistrarInstalacion,elegirSistema,historialClientes, historialVendedores } = require('../controllers/customerFormControllers');

const {servicioInstaladosx} = require("../controllers/adminControllers");  
  
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

// todo ===>> subir evidencia fotografica del servicio instalado
const rutaCarpeta = multer.diskStorage({

    destination: function (req, file, callback) {
        const rutaLicencia = path.join(__dirname, '../public/evidenciaServicio')
        callback(null, rutaLicencia);
    },

    filename: function (req, file, callback) {
        const fechaActual = Math.floor(Date.now() / 1000)
  
        if (file.fieldname == 'evidencia_fotografica') {
            urlLicencias[0] = "Evidencia_fotografica" + fechaActual + "_" + file.originalname;
        
            callback(null, urlLicencias[0])
        } 
        else {
            urlLicencias[1] = "xxxx" + fechaActual + "_" + file.originalname;
            callback(null, urlLicencias[1])
          
        } 
      
    }

});

const cargarEvidencia = multer({
    storage: rutaCarpeta,
});

const oneUpload = cargarEvidencia.fields([{ name: 'evidencia_fotografica' }, { name: 'xxx' }]);

// todo =========================================================

 // * ========== Renderizado de vistas clientes ==========
//                           ↓↓
router.get('/nuevo-cliente', isAuthenticated,(req, res) => {
    if(!(req.user.rol ==="vendedor")){res.redirect('./administrador') }
    res.render('nuevo-cliente', { user: req.user })
});
router.get('/lista-clientes', isAuthenticated, listarClientes)
router.get('/afiliados', isAuthenticated,listarAfiliados, (req, res) => {
    if(!(req.user.rol ==="vendedor")){res.redirect('./administrador') }
       res.render('afiliados', { user: req.user })
});
router.get('/ventas-vendedor',isAuthenticated, ventasVendedor)

cron.schedule('0 22 * * Sun',() => {
    console.log("Hola desde cron job")
    historialClientes();
});
cron.schedule('0 15 12 Jan-Dec *',() => {
    console.log("Hola desde cron job")
    historialVendedores();
});

router.get('/perfil-clientes/:id', isAuthenticated,listarClientes_PerfilClientes)
router.get('/solicitar-credito/:id', isAuthenticated ,getSolicitudCreditos)
router.get('/calcular-ahorro/:id', isAuthenticated, getAhorro)
router.get('/test-de-agua/:id', isAuthenticated, getTestAgua) 
router.get('/agendar-instalacion/:id', isAuthenticated,getAgendarinstalacion) 
router.get('/registro-instalacion/:id', isAuthenticated,getRegistrarInstalacion)
//   router.get('/temporal', isAuthenticated)
// *   ================ ===== ↑↑ ==============================

//* router para los métodos del customerFormControllers
/*=============================================================*/
  router.post('/registrarClientes', isAuthenticated, registrarClientes);
/*=============================================================*/
  router.post('/solicitarCredito', isAuthenticated, multiupload, solicitarCredito);
/*=============================================================*/
  router.post('/calcularAhorro', isAuthenticated, ahorro);
 /*=============================================================*/
  router.post('/testAgua', isAuthenticated, testAgua);
 /*=============================================================*/
  router.post('/agendarInstalacion', isAuthenticated,agendarInstalacionProducto);
 /*=============================================================*/
  router.post('/instalacion', isAuthenticated,oneUpload,servicioInstaladosx);
/*=============================================================*/
  router.post('/elegirSistema', isAuthenticated, elegirSistema);
/*=============================================================*/
//  router.post('/historialVendedores',historialVendedores);

module.exports = router
