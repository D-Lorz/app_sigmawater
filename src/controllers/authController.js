const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const { promisify } = require('util')
const { log } = require('console')

// todo: LOGIN
exports.login = async (req, res) => {
    try {
        const correo = req.body.correo
        const pass = req.body.pass
    
        if (!correo || !pass ) {
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
                    if(results[0].estado_de_la_cuenta === "pendiente"){

                        let options =  {
                            alert: true,
                            alertTitle: "Oops",
                            alertMessage: "Tu cuenta aun no ha sido aprobada",
                            alertIcon: 'info',
                            showConfirmButton: true,
                            timer: false,
                            ruta: 'login'
                        } 
                        res.render('login', options )


                     } else  if(results[0].estado_de_la_cuenta === "bloqueado"){
                     
                        let options =  {
                            alert: true,
                            alertTitle: "Atencion",
                            alertMessage: "Tu cuenta se encuentra bloqueada",
                            alertIcon: 'warning',
                            showConfirmButton: true,
                            timer: false,
                            ruta: 'login'
                        } 
                        res.render('login', options )
                    }else {

                 //inicio de sesión OK
                 const id = results[0].id_consecutivo
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
// todo: MOSTRAR TABS DE VENTAS PROPIAS
exports.facturacion = async (req, res) => {
    const id_vendedorA = req.user.id_vendedor;
    // Consultando en DB los clientes que pertenecen al vendedor actual
    conexion.query('SELECT * FROM registro_de_vendedores WHERE codigo_afiliado = ?', [id_vendedorA])

    const facturacionPropia = await conexion.query('SELECT f.id_factura, f.fecha_instalacion, nc.nombre, nc.apellido, f.producto_instalado, sc.monto_aprobado, f.comision_total, nc.id as idClientenc, f.id_cliente as idClientef, f.estadoFactura as estadoFacturaf  FROM nuevos_cliente nc JOIN factura f ON nc.id = f.id_cliente JOIN solicitar_credito sc ON nc.id = sc.id_cliente WHERE nc.codigo_id_vendedor = ? ;', [id_vendedorA])
    facturacionPropia.forEach(cl => {
        cl.factura = {}
        if (cl.idClientenc = cl.idClientef) {
            if (cl.estadoFacturaf == 0) { cl.factura.text = "Pendiente"; cl.factura.color = "badge-soft-warning"; }
            if (cl.estadoFacturaf == 1) { cl.factura.text = "Pagado"; cl.factura.color = "badge-soft-success"; }
        }
    });

    const facturacionAfiliado = await conexion.query('SELECT nc.id as idClientenc, f.id_cliente as idClientef, rv.id_vendedor, rv.nombres, nc.nombre, nc.apellido, f.id_factura, f.fecha_instalacion, f.producto_instalado, f.comision_total, f.estadoFactura as estadoFacturaf, sc.monto_aprobado FROM registro_de_vendedores rv JOIN nuevos_cliente nc ON rv.id_vendedor = nc.codigo_id_vendedor JOIN factura f ON f.id_cliente = nc.id JOIN solicitar_credito sc ON sc.id_cliente = nc.id WHERE codigo_afiliado = ? ;', [id_vendedorA])
    facturacionAfiliado.forEach(afl => {
        afl.facturaAfl = {}
        if (afl.idClientenc = afl.idClientef) {
            if (afl.estadoFacturaf == 0) { afl.facturaAfl.text = "Pendiente"; afl.facturaAfl.color = "badge-soft-warning"; }
            if (afl.estadoFacturaf == 1) { afl.facturaAfl.text = "Pagado"; afl.facturaAfl.color = "badge-soft-success"; }
        }
    });

    console.log("\nFACTURA PROPIA >> ", facturacionPropia)
    console.log("\nFACTURA AFILIADOS >> ", facturacionAfiliado)

    res.render('ventas-vendedor', { user: req.user, facturacionPropia, facturacionAfiliado })

}
