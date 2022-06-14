const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const { isAuthenticated,isAdmin } = require('../controllers/authController');
const { listarVendedores,instalacion,
       listarVendedores_PerfilVendedores,
       listarClientes_PerfilClientes,
      listarClientes,
      ActualizarNivel,ActualizarEstado,
      getRegistrarInstalacion } = require('../controllers/adminControllers');



// todo ===>> subir evidencia fotografica del servicio instalado
const rutaCarpeta = multer.diskStorage({

    destination: function (req, file, callback) {
        const rutaLicencia = path.join(__dirname, '../public/evidenciaServicio')
        callback(null, rutaLicencia);
    },

    filename: function (req, file, callback) {
        const fechaActual = Math.floor(Date.now() / 1000)
  
        if (file.fieldname == 'evidenciaInstalacion') {
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

const oneUpload = cargarEvidencia.fields([{ name: 'evidenciaInstalacion' }, { name: 'xxx' }]);


 // * ========== Renderizado de vistas clientes ==========
//                           ↓↓
router.get('/vendedores', isAuthenticated, listarVendedores )
router.get('/perfil-vendedores/:id', isAuthenticated,listarVendedores_PerfilVendedores)


router.get('/listar-clientes', isAuthenticated,listarClientes)
router.get('/perfil-cliente/:id', isAuthenticated,listarClientes_PerfilClientes)

// router.get('/registrar-instalacion/:id', isAuthenticated, getRegistrarInstalacion)

 router.get('/probando/:id', isAuthenticated,getRegistrarInstalacion)


// router.get('/prueba', isAuthenticated,(req, res) => {
//        res.render('./1-admin/clientes', { user: req.user })
// });
// *   ================ ===== ↑↑ ==============================

           
// * ROUTER: para los métodos del controller
 /*=============================================================*/  
router.post('/aprobarVendedor', isAuthenticated,ActualizarEstado);
 /*=============================================================*/
router.post('/ActualizarNivel', isAuthenticated,ActualizarNivel);
/*=============================================================*/
 router.post('/instalacion', isAuthenticated,instalacion,oneUpload);
/*=============================================================*/

module.exports = router
