const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const cron = require('node-cron');
const { isAuthenticated} = require('../controllers/authController');
const { listarClientes, getSolicitudCreditos, getAhorro, getTestAgua, getAgendarinstalacion,
        registrarClientes,ahorro, testAgua,  listarClientes_PerfilClientes, solicitarCredito,
        agendarInstalacionProducto, getRegistrarInstalacion, elegirSistema, historialClientes, historialVendedores, historial_numVentas,
        historial_ganancias_vendedores } = require('../controllers/customerFormControllers');
const {servicioInstaladosx} = require("../controllers/adminControllers");  
  
const rutaAlmacen = multer.diskStorage({
    destination: function (req, file, callback) {
        const rutaLicencia = path.join(__dirname, '../public/licences_customers')
        callback(null, rutaLicencia);
    },

    filename: function (req, file, callback) {
        const fechaActual = Math.floor(Date.now() / 1000)
  
        if (file.fieldname == 'cliente_frontal') {
            urlLicencias[0] = "Licencia_Cliente_Frontal" + "_" + fechaActual + "_" + file.originalname;
        
            callback(null, urlLicencias[0])
        } else {
            urlLicencias[1] = "Licencia_Cliente_Trasera" + "_" + fechaActual + "_" + file.originalname;
            callback(null, urlLicencias[1])
          
        } 
      
    }
});

const cargar = multer({storage: rutaAlmacen});

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
            urlEvidencia = "Evidencia_fotografica" + "_" + fechaActual + "_" + file.originalname;
            callback(null, urlEvidencia)

            if(!file.originalname){
                urlEvidencia = ''
            }
    }
});
const cargarEvidencia = multer({storage: rutaCarpeta});

// * ========== Renderizado de vistas clientes ==========
//                           ↓↓
router.get('/nuevo-cliente', isAuthenticated,(req, res) => {
    if(!(req.user.rol ==="vendedor")){res.redirect('./administrador') }
    res.render('nuevo-cliente', { user: req.user })
});
router.get('/lista-clientes', isAuthenticated, listarClientes)

// Ejecución Semanal (Domingo 10pm)
cron.schedule('0 22 * * Sun',() => {
    historialClientes();
    historial_numVentas();
});

// Ejecución Mensual
cron.schedule('0 15 12 Jan-Dec *',() => {
    historialVendedores();
});

// Ejecución Mensual
cron.schedule('0 1 1 * *',() => {
    historial_ganancias_vendedores();
});

router.get('/perfil-clientes/:id', isAuthenticated,listarClientes_PerfilClientes)
router.get('/solicitar-credito/:id', isAuthenticated ,getSolicitudCreditos)
router.get('/calcular-ahorro/:id', isAuthenticated, getAhorro)
router.get('/test-de-agua/:id', isAuthenticated, getTestAgua) 
router.get('/agendar-instalacion/:id', isAuthenticated,getAgendarinstalacion) 
router.get('/registro-instalacion/:id', isAuthenticated,getRegistrarInstalacion)
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
  router.post('/instalacion', isAuthenticated, cargarEvidencia.single('evidencia_fotografica'), servicioInstaladosx);
/*=============================================================*/
  router.post('/elegirSistema', isAuthenticated, elegirSistema); 
/*=============================================================*/

module.exports = router