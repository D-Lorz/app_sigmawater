var express = require('express');
var router = express.Router();
var connection = require('../database/db.js');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');
var randtoken = require('rand-token');
//send correo
function sendEmail(correo, token) {
    var correo = correo;
    var token = token;
    console.log("Este es el token");
    console.log(token);
    var mail = nodemailer.createTransport({
        host: 'mail.3csigmawater.com',
        port: 465, 
        auth: {
            user: 'noreplys@3csigmawater.com', // Your correo id
            pass: 'hola123321123.' // Your pass
        }
    });
    let link = "http://localhost:3000/reset-password?token=' + token + '"
    var mailOptions = {
        from: "'3C Sigma Water System <noreplys@3csigmawater.com>'",
        to: correo,
        subject: 'Restablece tu cuenta en 3C Sigma Water',
        html: '<body style="background-color: transparent; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">' +
            '<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent;" width="100%">' +
            '<tbody>' +
            '<tr>' +
            '<td>' +
            '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' +
            '<tbody>' +
            '<tr>' +
            '<td>' +
            '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; color: #000000; width: 600px;" width="600">' +
            '<tbody>' +
            '<tr>' +
            '<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 30px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">' +
            '<table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' +
            '<tbody><tr>' +
            '<td style="width:100%;padding-right:0px;padding-left:0px;">' +
            '<div align="center" style="line-height:10px"><img src="https://app.3csigmawater.com/imgcorreo/logo1.png" style="display: block; height: auto; border: 0; width: 180px; max-width: 100%;" width="180"></div>' +
            '</td>' +
            '</tr>' +
            '</tbody></table>' +
            '<table border="0" cellpadding="0" cellspacing="0" class="heading_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' +
            '<tbody><tr>' +
            '<td style="width:100%;text-align:center;padding-top:60px;">' +
            '<h3 style="margin: 0; color: #000000; font-size: 18px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 120%; text-align: center; direction: ltr; font-weight: 400; letter-spacing: normal; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">¿Olvidaste tu contraseña?</span></h3>' +
            '</td>' +
            '</tr>' +
            '</tbody></table>' +
            '<table border="0" cellpadding="0" cellspacing="0" class="heading_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' +
            '<tbody><tr>' +
            '<td style="width:100%;text-align:center;padding-top:10px;padding-right:25px;padding-bottom:10px;padding-left:25px;">' +
            '<h1 style="margin: 0; color: #000000; font-size: 24px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; line-height: 120%; text-align: center; direction: ltr; font-weight: 700; letter-spacing: normal; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Haz clic en el botón de abajo para restablecer tu contraseña</span></h1>' +
            '</td>' +
            '</tr>' +
            '</tbody></table>' +
            '<table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' +
            '<tbody><tr>' +
            '<td style="width:100%;padding-right:0px;padding-left:0px;">' +
            '<div align="center" style="line-height:10px"><img src="https://app.3csigmawater.com/imgcorreo/candado.png" style="display: block; height: auto; border: 0; width: 106px; max-width: 100%;" width="106"></div>' +
            '</td>' +
            '</tr>' +
            '</tbody></table>' +
            '<table border="0" cellpadding="0" cellspacing="0" class="button_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' +
            '<tbody><tr>' +
            '<td style="text-align:center;padding-top:45px;">' +
            '<div align="center">' +
            '<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:42px;width:480px;v-text-anchor:middle;" arcsize="15%" stroke="false" fillcolor="#fed061"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#000000; font-family:Arial, sans-serif; font-size:16px"><![endif]-->' +

            '<a href="http://localhost:3000/reset-password?token=' + token + '">'+
            '<div style="text-decoration:none;display:block;color:#000000;background-color:#fed061;border-radius:6px;width:80%; width:calc(80% - 2px);border-top:1px solid #fed061;font-weight:400;border-right:1px solid #fed061;border-bottom:1px solid #fed061;border-left:1px solid #fed061;padding-top:5px;padding-bottom:5px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">Restablecer</span></span></div>' +
            '</a>' +


            '<!--[if mso]></center></v:textbox></v:roundrect><![endif]-->' +
            '</div>' +
            '</td>' +
            '</tr>' +
            '</tbody></table>' +
            '<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">' +
            '<tbody><tr>' +
            '<td style="padding-bottom:35px;">' +
            '<div style="color:#101112;font-size:12px;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-weight:400;line-height:200%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:24px;">' +
            '<p style="margin: 0;">Serás redirigido para crear una nueva contraseña</p>' +
            '</div>' +
            '</td>' +
            '</tr>' +
            '</tbody></table>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' +
            '<tbody>' +
            '<tr>' +
            '<td>' +
            '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;" width="600">' +
            '<tbody>' +
            '<tr>' +
            '<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 25px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">' +
            '<table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' +
            '<tbody><tr>' +
            '<td style="width:100%;padding-right:10px;padding-left:0px;">' +
            '<div align="center" style="line-height:10px"><img src="https://app.3csigmawater.com/imgcorreo/logo1.png" style="display: block; height: auto; border: 0; width: 120px; max-width: 100%;" width="120"></div>' +
            '</td>' +
            '</tr>' +
            '</tbody></table>' +
            '<div class="spacer_block mobile_hide" style="height:25px;line-height:25px;font-size:1px;">&hairsp;</div>' +
            '<div class="spacer_block" style="height:5px;line-height:5px;font-size:1px;">&hairsp;</div>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' +
            '<tbody>' +
            '<tr>' +
            '<td>' +
            '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;" width="600">' +
            '<tbody>' +
            '<tr>' +
            '<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">' +
            '<table border="0" cellpadding="0" cellspacing="0" class="heading_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' +
            '<tbody><tr>' +
            '<td style="width:100%;text-align:center;padding-top:30px;">' +
            '<h3 style="margin: 0; color: #000000; font-size: 17px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; line-height: 120%; text-align: center; direction: ltr; font-weight: 700; letter-spacing: normal; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">¿Tienes dudas?</span></h3>' +
            '</td>' +
            '</tr>' +
            '</tbody></table>' +
            '<table border="0" cellpadding="0" cellspacing="0" class="icons_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' +
            '<tbody><tr>' +
            '<td style="vertical-align: middle; color: #000000; text-align: center; padding-right: 20px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 14px;">' +
            '<table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' +
            ' <tbody><tr>' +
            '<td style="vertical-align: middle; text-align: center;">' +
            '<!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->' +
            '<!--[if !vml]><!-->' +
            ' <table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">' +
            '<!--<![endif]-->' +
            '<tbody><tr>' +
            '<td style="vertical-align: middle; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-left: 10px; padding-right: 10px;"><a href="tel:7862387004" style="text-decoration: none;" target="_self"><img align="center" alt="" class="icon" height="16" src="https://app.3csigmawater.com/imgcorreo/phone.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="16"></a></td>' +
            ' <td style="font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 14px; color: #000000; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="tel:7862387004" style="color: #000000; text-decoration: none;" target="_self">Llámanos</a></td>' +
            ' </tr>' +
            ' </tbody></table>' +
            ' <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->' +
            '<!--[if !vml]><!-->' +
            '<table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">' +
            '<!--<![endif]-->' +
            '<tbody><tr>' +
            '<td style="vertical-align: middle; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-left: 10px; padding-right: 10px;"><a href="mailto:sales@3csigmawater.com" style="text-decoration: none;" target="_self"><img align="center" alt="" class="icon" height="16" src="https://app.3csigmawater.com/imgcorreo/email.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="16"></a></td>' +
            '<td style="font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 14px; color: #000000; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="mailto:sales@3csigmawater.com" style="color: #000000; text-decoration: none;" target="_self">Escríbenos</a></td>' +
            '</tr>' +
            '</tbody></table>' +
            '</td>' +
            '</tr>' +
            '</tbody></table>' +
            '</td>' +
            '</tr>' +
            '</tbody></table>' +
            '<table border="0" cellpadding="0" cellspacing="0" class="social_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' +
            '<tbody><tr>' +
            '<td style="text-align:center;padding-left:10px;padding-right:0px;">' +
            '<table align="center" border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="72px">' +
            '<tbody><tr>' +
            '<td style="padding:0 2px 0 2px;"><a href="https://www.facebook.com/3csigmawater" target="_blank"><img alt="Facebook" height="32" src="https://app.3csigmawater.com/imgcorreo/facebook2x.png" style="display: block; height: auto; border: 0;" title="facebook" width="32"></a></td>' +
            '<td style="padding:0 2px 0 2px;"><a href="https://www.instagram.com/3csigmawater/" target="_blank"><img alt="Instagram" height="32" src="https://app.3csigmawater.com/imgcorreo/instagram2x.png" style="display: block; height: auto; border: 0;" title="instagram" width="32"></a></td>' +
            ' </tr>' +
            ' </tbody></table>' +
            ' </td>' +
            ' </tr>' +
            ' </tbody></table>' +
            ' </td>' +
            ' </tr>' +
            '</tbody>' +
            '</table>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' +
            '<tbody>' +
            '<tr>' +
            '<td>' +
            '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;" width="600">' +
            '<tbody>' +
            '<tr>' +
            '<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">' +
            '<div class="spacer_block" style="height:30px;line-height:30px;font-size:1px;">&hairsp;</div>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' +
            ' <tbody>' +
            ' <tr>' +
            '<td>' +
            '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">' +
            '<tbody>' +
            '<tr>' +
            '<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">' +
            '<table border="0" cellpadding="0" cellspacing="0" class="icons_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' +
            '<tbody><tr>' +
            '<td style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">' +
            '<table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">' +
            '<tbody><tr>' +
            '<td style="vertical-align: middle; text-align: center;">' +
            ' <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->' +
            '<!--[if !vml]><!-->' +
            ' <table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">' +
            '<!--<![endif]-->' +
            '<tbody><tr>' +
            '</tr>' +
            '</tbody></table>' +
            '</td>' +
            '</tr>' +
            '</tbody></table>' +
            '</td>' +
            '</tr>' +
            '</tbody></table>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table><!-- End -->' +

            '</body>'


    };
    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(1)
        } else {
            console.log(0)
        }
    });
}
/* home page */
router.get('/restablecer-clave', function (req, res, next) {
    res.render('restablecer-clave', {
        title: 'Forget pass Page'
    });
});
/* send reset pass link in correo */
router.post('/reset-password-correo', function (req, res, next) {
    var correo = req.body.correo;
    //console.log(sendEmail(correo, fullUrl));
    connection.query('SELECT * FROM usuarios WHERE correo ="' + correo + '"', function (err, result) {
        if (err) throw err;
        var type = ''
        var msg = ''
        console.log(result[0]);
        if (result.length > 0) {
            var token = randtoken.generate(20);
            var sent = sendEmail(correo, token);
            if (sent != '0') {
                var data = {
                    token: token
                }
                connection.query('UPDATE usuarios SET ? WHERE correo ="' + correo + '"', data, function (err, result) {
                    if (err) throw err
                })
                type = 'success';
                msg = 'Revisa tu bandeja de entrada';
            } else {
                type = 'error';
                msg = 'Something goes to wrong. Please try again';
            }
        } else {
            console.log('2');
            type = 'error';
            msg = 'Este correo no está registrado';
        }
        req.flash(type, msg);
        res.redirect('/restablecer-clave');
    });
})
/* reset page */
router.get('/reset-password', function (req, res, next) {
    res.render('reset-password', {
        title: 'Reset Password Page',
        token: req.query.token
    });
});
/* update pass to database */
router.post('/update-password', function (req, res, next) {
    var token = req.body.token;
    var pass = req.body.pass;
    connection.query('SELECT * FROM usuarios WHERE token ="' + token + '"', function (err, result) {
        if (err) throw err;
        var type
        var msg
        if (result.length > 0) {
            var saltRounds = 10;
            // var hash = bcrypt.hash(pass, saltRounds);
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(pass, salt, function (err, hash) {
                    var data = {
                        pass: hash
                    }
                    connection.query('UPDATE usuarios SET ? WHERE correo ="' + result[0].correo + '"', data, function (err, result) {
                        if (err) throw err
                    });
                });
            });
            type = 'success';
            msg = 'Contraseña actualizada correctamente';
          } else {
            console.log('2');
            type = 'error';
            msg = 'Invalid link; please try again';
        }
        req.flash(type, msg);
        res.render('login', {
            alert: true,
            alertTitle: "Cambio exitoso",
            alertMessage: "Tu contraseña ha sido actualizada",
            alertIcon: 'success',
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        });
    });
})
module.exports = router;