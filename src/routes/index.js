//send correo
const express = require('express')
const router = express.Router()

function sendEmail(correo, token) {
 
    var correo = correo;
    var token = token;
 
    var mail = nodemailer.createTransport({
        host: 'mail.3csigmawater.com',
        port: 465, //cambiar el puerto a 465 cuando antes de subir al server el proyecto
        auth: {
            user: 'noreplys@3csigmawater.com', // Your correo id
            pass: 'hola123321123.' // Your pass
        }
    });
 
    var mailOptions = {
        from: "'3C Sigma Water System <noreplys@3csigmawater.com>'",
        to: correo,
        subject: 'Reset pass Link - Tutsmake.com',
        html: '<p>You requested for reset pass, kindly use this <a href="http://localhost:3000/reset-password?token=' + token + '">link</a> to reset your pass</p>'
 
    };
 
    mail.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(1)
        } else {
            console.log(0)
        }
    });
}

/* send reset pass link in correo */
router.post('/reset-password-correo', function(req, res, next) {
 
    var correo = req.body.correo;
 
    //console.log(sendEmail(correo, fullUrl));
 
    connection.query('SELECT * FROM usuarios WHERE correo ="' + correo + '"', function(err, result) {
        if (err) throw err;
         
        var type = ''
        var msg = ''
   
        console.log(result[0]);
     
        if (result[0].correo.length > 0) {
 
           var token = randtoken.generate(20);
 
           var sent = sendEmail(correo, token);
 
             if (sent != '0') {
 
                var data = {
                    token: token
                }
 
                connection.query('UPDATE usuarios SET ? WHERE correo ="' + correo + '"', data, function(err, result) {
                    if(err) throw err
         
                })
 
                type = 'success';
                msg = 'The reset pass link has been sent to your correo address';
 
            } else {
                type = 'error';
                msg = 'Something goes to wrong. Please try again';
            }
 
        } else {
            console.log('2');
            type = 'error';
            msg = 'The correo is not registered with us';
 
        }
    
        req.flash(type, msg);
        res.redirect('/restablecer-clave');
    });
})
/* update pass to database */
router.post('/update-password', function(req, res, next) {
 
    var token = req.body.token;
    var pass = req.body.pass;
 
   connection.query('SELECT * FROM usuarios WHERE token ="' + token + '"', function(err, result) {
        if (err) throw err;
 
        var type
        var msg
 
        if (result.length > 0) {
                
              var saltRounds = 10;
 
             // var hash = bcrypt.hash(pass, saltRounds);
 
            bcrypt.genSalt(saltRounds, function(err, salt) {
                  bcrypt.hash(pass, salt, function(err, hash) {
 
                   var data = {
                        pass: hash
                    }
 
                    connection.query('UPDATE usuarios SET ? WHERE correo ="' + result[0].correo + '"', data, function(err, result) {
                        if(err) throw err
                   
                    });
 
                  });
              });
 
            type = 'success';
            msg = 'Your pass has been updated successfully';
              
        } else {
 
            console.log('2');
            type = 'success';
            msg = 'Invalid link; please try again';
 
            }
 
        req.flash(type, msg);
        res.redirect('/restablecer-clave');
    });
})