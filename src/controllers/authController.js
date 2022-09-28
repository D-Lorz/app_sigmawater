const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db.js');
const bcrypt = require('bcrypt');
const { promisify } = require('util')
const randtoken = require('rand-token');
const { recuperarClaveHTML, sendEmail } = require('../lib/correo')


// todo: LOGIN
exports.login = async (req, res) => {
    try {
        const correo = req.body.correo
        const pass = req.body.pass

        if (!correo || !pass) {
            res.render('login', {
                alert: true,
                alertTitle: "Oops",
                alertMessage: "Ingrese un usuario y contraseña",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        } else {
            await conexion.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (error, results) => {
                if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {

                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Contraseñas incorrectas",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    })
                } else {
                    if (results[0].estado_de_la_cuenta === "pendiente") {

                        let options = {
                            alert: true,
                            alertTitle: "Oops",
                            alertMessage: "Tu cuenta aun no ha sido aprobada",
                            alertIcon: 'info',
                            showConfirmButton: true,
                            timer: false,
                            ruta: 'login'
                        }
                        res.render('login', options)


                    } else if (results[0].estado_de_la_cuenta === "bloqueado") {

                        let options = {
                            alert: true,
                            alertTitle: "Atencion",
                            alertMessage: "Tu cuenta se encuentra bloqueada",
                            alertIcon: 'warning',
                            showConfirmButton: true,
                            timer: false,
                            ruta: 'login'
                        }
                        res.render('login', options)
                    } else {

                        //inicio de sesión OK
                        const id = results[0].id_consecutivo
                        const token = jwt.sign({ id: id }, 'super_secret_AppSigmaWater')

                        const cookiesOptions = {
                            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                            httpOnly: true
                        }
                        res.cookie('jwt', token, cookiesOptions)

                        let options = {
                            alert: true,
                            alertTitle: "¡Bienvenido!",
                            alertMessage: "",
                            alertIcon: 'success',
                            showConfirmButton: false,
                            timer: 1200,
                            ruta: './'
                        }

                        if (results[0].rol === "administrador") {
                            options.ruta = 'administrador'
                        }
                        res.render('login', options)
                    }


                }
            })

        }

    } catch (error) {
        console.log(error)
    }
}
// todo: AUTENTICACION
exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, 'super_secret_AppSigmaWater');
            conexion.query('SELECT u.*, r.total_ventas, r.nombres, r.apellidos FROM usuarios u LEFT JOIN registro_de_vendedores r ON r.id = u.id_consecutivo WHERE u.id_consecutivo = ?', [decodificada.id], (error, results) => {
                if (!results) { return next() }
                req.user = results[0]
                if (results[0].foto) {
                    req.user.foto = results[0].foto
                } else {
                    req.user.foto = "../directorio_dash/images/users/userDefault.gif"
                }

                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        res.redirect('/login')
    }
}

// todo: LOGOUT
exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/')
}

// todo: VALIDACION CUANDO YA INICIA SESION
exports.nologueado = async (req, res, next) => {
    if (!req.cookies.jwt) {
        return next()
    } else {
        res.redirect('/')
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        if (!(req.user.rol === "administrador")) {
            res.redirect("/login");
        }
    } catch (error) {
        console.log(error);
        return next();
    }
};

exports.isSeller = async (req, res, next) => {
    try {
        if (!(req.user.rol === "vendedor")) {
            res.redirect("/login");
        }
    } catch (error) {
        console.log(error);
        return next();
    }
};

/**************************************************************************************************************** */
// --------------------------------------- RESTABLECER CONTRASEÑA ----------------------------------------------
exports.resetPassword = async (req, res, next) => {
    const { correo } = req.body;

    conexion.query("SELECT * FROM usuarios WHERE correo = ?", [correo], (err, result) => {
        if (err) throw err;
        let type = ''
        let msg = ''
        if (result.length > 0) {
            const token = randtoken.generate(20);
             // ! ************* PROCESO DEL EMAIL PARA VENDEDOR ************
            const email = correo
            const asunto = "Bienvenido a 3C Sigma Water System"
            const plantilla = recuperarClaveHTML(token)
            // Enviar email
            const resultEmail = sendEmail(email, asunto, plantilla)
            
            if (!resultEmail) {
                type = 'error';
                msg = 'Something goes to wrong. Please try again';
                // res.json("Ocurrio un error inesperado al enviar el email al vendedor")
            } else {
                const data = {
                    token: token
                }
                conexion.query("UPDATE usuarios SET ? WHERE correo = ?", [data, correo], (err, result) => {
                    if (err) throw err
                })
                type = 'success';
                msg = 'Revisa tu bandeja de entrada';
            }
            // ! **************************************************************
        } else {
            console.log('2');
            type = 'error';
            msg = 'Este correo no está registrado';
        }
        req.flash(type, msg);
        res.redirect('/restablecer-clave');
    });
}

exports.updatePassword = async (req, res, next) => {
    const { token, pass } = req.body;
    conexion.query('SELECT * FROM usuarios WHERE token = ?', [token], (err, result) => {
        if (err) throw err;
        let type
        let msg
        if (result.length > 0) {
            const correo = result[0].correo
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err) throw err;
                bcrypt.hash(pass, salt, (err, hash) => {
                    if (err) throw err;
                    const data = { pass: hash}
                    conexion.query('UPDATE usuarios SET ? WHERE correo = ?', [data, correo], (err, result) => {
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
}