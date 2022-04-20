const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const { promisify } = require('util')

//procedimiento para registrarnos

exports.registrar = async (req, res) => {
    //3dsd
    const nombres = req.body.nombres
    const apellidos = req.body.apellidos
    const fecha_nacimiento = req.body.fecha_nacimiento
    const telefono_movil = req.body.telefono_movil
    const correo = req.body.correo
    const seguro_social = req.body.seguro_social
    const ciudad = req.body.ciudad
    const direccion = req.body.direccion
    const apt_suite_unidad = req.body.apt_suite_unidad
    const codigo_postal = req.body.codigo_postal
    const codigo_referido = req.body.codigo_referido
    const nombre_banco = req.body.nombre_banco
    const numero_cuenta = req.body.numero_cuenta
    const ruta = req.body.ruta
    const beneficiario = req.body.beneficiario

    console.log("FRONTAL:>>>  ", urlLicencias[0]);
    console.log("TRASERA:>>>  ", urlLicencias[1]);

    const frontal = '../licences/' + urlLicencias[0]
    const trasera = '../licences/' + urlLicencias[1]
    const licencia_conduccion = JSON.stringify({
        'frontal': frontal,
        'trasera': trasera
    });

    const nuevoRegistro = {
        nombres, apellidos, fecha_nacimiento, telefono_movil, correo, seguro_social, ciudad, direccion,
        apt_suite_unidad, codigo_postal, codigo_referido, nombre_banco, numero_cuenta, ruta, beneficiario, licencia_conduccion
    }

    console.log(nuevoRegistro)

    await conexion.query('INSERT INTO formulario_registro_vendedor SET ?', [nuevoRegistro], (err, result) => {
        if (err) throw err;
        console.log("1 Registro insertado");
        console.log(result)
        res.redirect('https://3csigmawater.com')
    })

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
            await conexion.query('SELECT * FROM formulario_registro_vendedor WHERE correo = ?', [correo], async (error, results) => {
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
                 const token = jwt.sign({ id: id },  'super_secret_AppSigmaWater', { expiresIn: 3600 })
                 //generamos el token SIN fecha de expiracion
                 //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
                 console.log("TOKEN: " + token + " para el USUARIO : " + correo)

                 const cookiesOptions = {
                     expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
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
                        ruta: './'
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
            conexion.query('SELECT * FROM formulario_registro_vendedor WHERE id = ?', [decodificada.id], (error, results) => {
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
//TODO: LOGOUT
exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/')
}
//TODO: VALIDACION CUNADO YA INICIA SESION
exports.nologueado = async (req, res, next) => {
    if (!req.cookies.jwt) {
        return next()
    } else {

        res.redirect('/')
    }
}
