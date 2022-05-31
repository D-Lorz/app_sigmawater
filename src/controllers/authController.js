const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const { promisify } = require('util')


// todo: REGISTRAR
exports.registrar = async (req, res) => {

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
    const codigo_afiliado = req.body.codigo_afiliado
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

    const id_vendedor = generateRandomString(6)
    

    const nuevoRegistro = {
        nombres, apellidos, fecha_nacimiento, telefono_movil, correo, seguro_social, ciudad, direccion,
        apt_suite_unidad, codigo_postal, codigo_afiliado, nombre_banco, numero_cuenta, ruta, beneficiario, 
        licencia_conduccion,id_vendedor
    }

    console.log(nuevoRegistro)

    await conexion.query('INSERT INTO registro_de_vendedores SET ?', [nuevoRegistro], (err, result) => {
        if (err) throw err;
        console.log("1 Registro insertado");
        console.log(result)
        res.redirect('https://3csigmawater.com')
    })
}



// todo: LOGIN
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
                 //inicio de sesión OK
                 const id = results[0].id_vendedorAceptado
                 const token = jwt.sign({ id: id }, 'super_secret_AppSigmaWater')
            
                 const cookiesOptions = {
                     expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                     httpOnly: true
                 }
                
                    res.cookie('jwt', token, cookiesOptions)
                    let options =  {
                        alert: true,
                        alertTitle: "¡Bienvenido!",
                        alertMessage: "",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 1200,
                        ruta: './'
                    } 
                    if(results[0].rol === "administrador"){
                        options.ruta = 'administrador'

                    }
                    res.render('login', options )
                       
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
            conexion.query('SELECT * FROM usuarios WHERE id_vendedorAceptado = ?', [decodificada.id], (error, results) => {
                if (!results) {
                    return next()
                }
               req.user = results[0]
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

// exports.isAdmin= async (req, res, next) => {
//     try {
//         if(!(req.user.rol ==="administrador")){
//             res.redirect('./')
//          }

//      } catch (error) {
//             console.log(error)
//             return next()
//      }
    
   
// }


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

// todo: MOSTRAR LISTA DE VENDEDORES AFILIADOS
exports.listarAfiliados= async (req, res) => {

    // Capturando el id del Vendedor actual
     const id_vendedorA = req.user.id_vendedor;
   
   // Consultando en DB los clientes que pertenecen al vendedor actual
     conexion.query('SELECT * FROM registro_de_vendedores WHERE codigo_afiliado = ?', [id_vendedorA], (err, result) => {
       if (err) throw err;
       res.render('afiliados', {user: req.user, result: result})
    //    console.log(result);
     })
       
}

 // todo: GENERADOR DE CODIGO DE VENDEDOR APHANUMERICO
const  generateRandomString = (num) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result1= '';
    const charactersLength = characters.length;
    for ( let i = 0; i < num; i++ ) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result1;


}
