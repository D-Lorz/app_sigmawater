
const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');
const conexion = require("../database/db");

const { } = require('../controllers/customerFormControllers');
const { log } = require('console');

router.get('/restablecer-clave', (req, res) => {
    res.render('restablecer-clave', { user: req.user })
});
router.get('/mensaje', (req, res) => {
    res.render('mensaje', { user: req.user })
});



// * ROUTER: para los métodos del controller
/*=============================================================*/
router.post('/send-email', async (req, res) => {


    let { correo } = req.body;
    let capturarCorreo = await conexion.query("SELECT * FROM `usuarios`")

    console.log("-----------");
    console.log(" ↓↓ ↓↓ ↓↓ ↓↓");
    capturarCorreo.forEach((cc) => {

        console.log(cc.correo);

        if (cc.correo == correo) {
            console.log("Siiiii");

            contentHTML = `
    <h1>ESTE CORREO ES PARA RESTABLECER LA CLAVE DE ACCESO A 3C Sigma Water System </h1>
       <ul> 
          <li>Este es su correo: ${correo}</li>
       </ul>
     ` ;

            let transporte = nodemailer.createTransport({
                host: 'mail.3csigmawater.com',
                post: 2079, //cambiar el puerto a 465 cuando antes de subir al server el proyecto
                secure: false,
                auth: {
                    user: 'noreply@3csigmawater.com',
                    pass: 'testdecorreo'
                },
                //Quitar el tls antes de subir al server
                tls: {
                    rejectUnauthorized: false
                }
            });

            let informacion = transporte.sendMail({
                from: "'3C SIGMA WATER SYSTEM <noreply@3csigmawater.com>'",
                to: correo,
                subject: 'Con esto puedo restablecer contraseña',
                html: contentHTML
            });

            // console.log('Mensaje enviado', informacion.messageId);
            // res.redirect('/mensaje');

            res.render('login', {
                alert: true,
                alertTitle: "Informacion",
                alertMessage: "Revise su correo",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            });
        } else {
            console.log("nooo");
            
        }


    });
    // console.log("-----------");


    //     console.log("-----------");
    //   console.log("Correo del input ===>>>", correo);
    //     console.log("-----------");





});




/*=============================================================*/



module.exports = router
