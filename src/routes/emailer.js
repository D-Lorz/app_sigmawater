
const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');
const { read } = require('fs');



router.get('/restablecer-clave', (req, res) => {
    res.render('restablecer-clave', { user: req.user })
});
router.get('/mensaje', (req, res) => {
    res.render('mensaje', { user: req.user })
});



// * ROUTER: para los métodos del controller
/*=============================================================*/
router.post('/send-email', async (req, res) => {
    const { correo } = req.body;
    console.log("-----------");
    console.log(correo);
    console.log("-----------");

    contentHTML = `
     <h1>ESTE CORREO ES PARA RESTABLECER LA CLAVE DE ACCESO A 3C Sigma Water System </h1>
        <ul> 
           <li>Este es su correo: ${correo}</li>
        </ul>
      ` ;

    const transporte = nodemailer.createTransport({
        host: 'mail.3csigmawater.com',
        post: 2079,
        secure: false,
        auth: {
            user: 'noreply@3csigmawater.com',
            pass: 'testdecorreo'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const informacion = await transporte.sendMail({
        from: "'3C SIGMA WATER SYSTEM <noreply@3csigmawater.com>'",
        to: correo,
        subject: 'Con esto puedo restablecer contraseña',
        html: contentHTML
    });

    console.log('Mensaje enviado', informacion.messageId);
    res.redirect('/mensaje')

});
/*=============================================================*/



module.exports = router
