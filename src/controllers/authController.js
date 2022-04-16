const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const {
    promisify
} = require('util')

//procedimiento para registrarnos



// exports.register = async (req, res)=>{    
//     try {
//         const name = req.body.name
//         const user = req.body.user
//         const pass = req.body.pass
//         let passHash = await bcryptjs.hash(pass, 8)    
//         //console.log(passHash)   
//         conexion.query('INSERT INTO users SET ?', {user:user, name: name, pass:passHash}, (error, results)=>{
//             if(error){console.log(error)}
//             res.redirect('/')
//         })
//     } catch (error) {
//         console.log(error)
//     }       
// }




//FIXME: REGISTER


exports.enviar = async (req, res) => {
    const nombres = req.body.nombres
    const apellidos = req.body.apellidosform
    const fecha_nacimiento = req.body.fechaform
    const numero_telefono = req.body.telefonoform
    const correo = req.body.correo
    const seguro_social = req.body.seguro
    const ciudad_donde_vive = req.body.ciudad
    const direccion = req.body.direccion
    const apt_suite_unidad = req.body.direccion2
    const codigo_postal = req.body.postal
    const numero_referido = req.body.referido
    const nombre_banco = req.body.banco
    const numero_de_cuenta = req.body.cuenta
    const numero_de_ruta = req.body.ruta
    const nombre_beneficiario = req.body.beneficiario
    // const frontal = '/imglicencias/sigmaWater_' + req.body.licencia
    // const trasera = '/imglicencias/sigmaWater_' + req.body.licencia_trasera
    // const licencia_conduccion = JSON.stringify({'frontal':frontal,'trasera':trasera});
    console.log("FRONTAL:>>>  ", req.nomArchivo[0]);
    console.log("TRASERA:>>>  ", req.nomArchivo[1]);
    const frontal = '../imglicencias/sigmaWater_' + req.nomArchivo[0]
    const trasera = '../imglicencias/sigmaWater_' + req.nomArchivo[1]
    const licencia_conduccion = JSON.stringify({
        'frontal': frontal,
        'trasera': trasera
    });

    const nuevoRegistro = {
        nombres,
        apellidos,
        fecha_nacimiento,
        numero_telefono,
        correo,
        seguro_social,
        ciudad_donde_vive,
        direccion,
        apt_suite_unidad,
        codigo_postal,
        numero_referido,
        nombre_banco,
        numero_de_cuenta,
        numero_de_ruta,
        nombre_beneficiario,
        licencia_conduccion,
    }

    console.log("Licencia Front-Back >>> ", licencia_conduccion);
    await conexion.query('INSERT INTO tblformulario_registro SET ?', [nuevoRegistro],

        (error, resultados) => {
            if (error) {
                res.json(error)
                console.log(error);
            } else {
                // req.flash = ("success", "Tu registro ha sido recibido Muchas gracias!");
                // res.redirect('/mensaje');
            }
        }
    );
}



//TODO: LOGIN
exports.login = async (req, res) => {
    try {
        const correo = req.body.correo
        const pass = req.body.pass

        if (!correo || !pass) {
            res.render('login', {
                alert: true,
                alertTitle: "Opss",
                alertMessage: "Ingrese un usuario y contraseña",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        } else {
           await conexion.query('SELECT * FROM tblformulario_registro WHERE correo = ?', [correo], async (error, results) => {
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
                    //inicio de sesión OK
                    const id = results[0].id
                    const token = jwt.sign({id: id}, process.env.JWT_SECRETO, {expiresIn: process.env.JWT_TIEMPO_EXPIRA})
                    //generamos el token SIN fecha de expiracion
                    //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
                    console.log("TOKEN: " + token + " para el USUARIO : " + correo)

                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)
                    res.render('login', {
                        alert: true,
                        alertTitle: "¡Bienvenido!",
                        alertMessage: "",
                        alertIcon: 'success',
                         showConfirmButton: false,
                        timer: 1200,
                        ruta: './dashboard'
                    })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

//TODO: AUTENTICACION

exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM tblformulario_registro WHERE id = ?', [decodificada.id], (error, results) => {
                if (!results) {
                    return next()
                }
                req.correo = results[0]
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

exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/dashboard')
}


//TODO: VALIDACION CUNADO YA INICIA SESION


// exports.nologueado = async (req, res, next) => {
//     if (!req.cookies.jwt) {
//         return next()
//          } else {

//         res.redirect('/dashboard')
//     }
// }
