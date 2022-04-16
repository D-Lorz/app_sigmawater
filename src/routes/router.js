const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const conexion = require('../database/db')
const path = require('path');
const multer = require('multer');




let myArray = [];
 
const rutaAlmacen = multer.diskStorage({
    destination: function (req, file, callback) {
        const rutaLicencia = path.join(__dirname, '../public/imglicencias')
        callback(null, rutaLicencia);
    },
      
    filename: function (req, file, callback) {
        console.log(myArray)
        const nomFile = "_licencia_sigmaWater_" + file.originalname;
        // const nomFile = req.body.nombres+"_" + req.body.apellidosform +"_licencia_sigmaWater_" + file.originalname;
        myArray.push(nomFile);
        req.nomArchivo = myArray
        // console.log("HOLA Xd", req.nomArchivo)
        callback(null,  nomFile);
    }

});



const cargar = multer ({
    storage: rutaAlmacen,
});

//TODO: SIRVE PARA UNIFICAR LOS 2 CAMPOS UPLOAD DEL FORMULARIO REGISTER
const multiupload = cargar.fields([{ name:'licencia' }, {name:'licencia_trasera' }]);



//TODO: VISTAS
/*================== RUTAS PARA LAS VISTAS =====================*/

// router.get('/', (req, res) => {
    // res.redirect('/login') // Local=> localhost:3000 || Server=>app.3csigmawater.com/login
//     res.render('index')
// });

router.get('/register',authController.nologueado, (req, res)=>{
    res.render('register')
});

router.get('/login', authController.nologueado, (req, res)=>{
    res.render('login', {alert:false})
});

router.get('/', authController.isAuthenticated, (req, res)=>{    
    res.render('dashboard', {correo:req.correo})
});

router.get('/lista_facturas',authController.isAuthenticated, (req, res)=>{
    res.render('lista_facturas' , {correo:req.correo})
});


router.get('/detalle_facturas',authController.isAuthenticated, (req, res)=>{
    res.render('detalle_facturas' , {correo:req.correo})
});

router.get('/lista-clientes',authController.isAuthenticated, (req, res)=>{
    res.render('lista-clientes' , {correo:req.correo})
});


router.get('/nuevo-cliente',authController.isAuthenticated, (req, res)=>{
    res.render('nuevo-cliente' , {correo:req.correo})
});

router.get('/referidos',authController.isAuthenticated, (req, res)=>{
    res.render('referidos' , {correo:req.correo})
});


/*==================RUTAS =====================*/


//TODO: router para los métodos del controller

/*=============================================================*/
router.post('/registrar',authController.nologueado, multiupload, authController.registrar);
/*=============================================================*/
router.post('/login',authController.nologueado, authController.login)
/*=============================================================*/
router.get('/logout', authController.logout)
/*=============================================================*/



module.exports = router