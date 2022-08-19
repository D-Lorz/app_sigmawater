const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const { promisify } = require('util')



// todo: REGISTRAR
exports.registrar = async (req, res) => {
//  ? NOTA: ==>> Esta es la forma para obtener el año actual <<<<<
   const year = new Date().getFullYear();
//  ? NOTA: ==>> Esta es la forma para obtener el año actual <<<<<
    let mes = new Date().getMonth()
    mes == 0 ? mes = 12 : mes = mes+1
//  ? NOTA: ==>> Esta es la forma para obtener el numero de la semana actual del año entero <<<<<
   currentdate = new Date();
   const oneJan = new Date(currentdate.getFullYear(),0,1);
   const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
   const semana = Math.ceil(( currentdate.getDay() + numberOfDays ) / 7) - 1;
   console.log("ESTA ES LA SEMANA ACTUAL ==>> " ,semana);
//  ? NOTA: ==>> Esta es la forma para obtener la fecha actual <<<<<
   const dia = new Date().getDate();

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
    const frontal = '../licences/' + urlLicencias[0]
    const trasera = '../licences/' + urlLicencias[1]
    const licencia_conduccion = JSON.stringify({ 'frontal': frontal, 'trasera': trasera});
    const id_vendedor = generateRandomString(6)
    const pass = generarPass_vendedor(8)
  
    const nuevoRegistro = {year,mes,semana,dia, nombres, apellidos, fecha_nacimiento, telefono_movil, 
         correo, seguro_social, ciudad, direccion, apt_suite_unidad, codigo_postal, codigo_afiliado,
         nombre_banco, numero_cuenta, ruta, beneficiario, licencia_conduccion,id_vendedor }
    const usuarios = {correo, pass, id_vendedor, codigo_afiliado }

     await conexion.query('INSERT INTO usuarios SET ?', [usuarios])
     await conexion.query('INSERT INTO registro_de_vendedores SET ?', [nuevoRegistro])
     let idConsecutivo = await conexion.query('SELECT id FROM registro_de_vendedores WHERE id_vendedor = ?', [id_vendedor])
     
     let fecha = new Date().toLocaleDateString("en-CA");
     const numClientes = 00
     const idVendedor = idConsecutivo[0].id
     console.log("*************");
     console.log("FECHA ==XXX", fecha);
     console.log("numClientes ==XXX", numClientes);
     console.log("idVendedor ==XXX", idVendedor);
     console.log("*************");
     const datos_PorDefectosCl = {fecha, numClientes, idVendedor }
     console.log("DATOS XXXXX" , datos_PorDefectosCl);
     await conexion.query('INSERT INTO historialnuevosclientes SET ?', [datos_PorDefectosCl])

     let codeAfiliado = await conexion.query('SELECT codigo_afiliado, id_vendedor FROM registro_de_vendedores WHERE id_vendedor = ?', [id_vendedor])
     let fechas = new Date().toLocaleDateString("en-CA");
     const numAfiliados = 00
     const datos_PorDefectosAfl = {fecha:fechas, numAfiliados:numAfiliados, idVendedor: codeAfiliado[0].id_vendedor }
     console.log("DATOS XXXXX" , datos_PorDefectosAfl);

   await conexion.query('INSERT INTO historialvendedores SET ?', [datos_PorDefectosAfl])
   res.redirect('https://3csigmawater.com')
}


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
exports.ventasVendedor = async (req, res) => {
   const id_vendedorA = req.user.id_vendedor;
// Consultando en DB los clientes que pertenecen al vendedor actual

const facturacion = await conexion.query('SELECT f.id_factura, f.fecha_instalacion, nc.nombre, nc.apellido, f.producto_instalado, sc.monto_aprobado, f.comision_total, nc.id as idClientenc, f.id_cliente as idClientef, f.estadoFactura as estadoFacturaf  FROM nuevos_cliente nc JOIN factura f ON nc.id = f.id_cliente JOIN solicitar_credito sc ON nc.id = sc.id_cliente WHERE nc.codigo_id_vendedor = ? ;', [id_vendedorA])
   facturacion.forEach(cl => {
    cl.factura = {}
        if(cl.idClientenc = cl.idClientef){
            if(cl.estadoFacturaf == 0){cl.factura.text = "Pendiente"; cl.factura.color = "badge-soft-warning";}
            if(cl.estadoFacturaf == 1){ cl.factura.text = "Pagado"; cl.factura.color = "badge-soft-success"; }
        }
     });
       res.render('ventas-vendedor', {user: req.user, facturacion})
}

// // todo: MOSTRAR TABS DE VENTAS AFILIADOS
// exports.ventasVendedor = async (req, res) => {
//     const id_vendedorA = req.user.id_vendedor;
//  // Consultando en DB los clientes que pertenecen al vendedor actual
 
//  const facturacion = await conexion.query('SELECT f.id_factura, f.fecha_instalacion, nc.nombre, nc.apellido, f.producto_instalado, sc.monto_aprobado, f.comision_total, nc.id as idClientenc, f.id_cliente as idClientef, f.estadoFactura as estadoFacturaf  FROM nuevos_cliente nc JOIN factura f ON nc.id = f.id_cliente JOIN solicitar_credito sc ON nc.id = sc.id_cliente WHERE nc.codigo_afiliado = ? ;', [id_vendedorA])
 
//     facturacion.forEach(cl => {
//      cl.factura = {}
//          if(cl.idClientenc = cl.idClientef){
//              if(cl.estadoFacturaf == 0){cl.factura.text = "Pendiente"; cl.factura.color = "badge-soft-warning";}
//              if(cl.estadoFacturaf == 1){ cl.factura.text = "Pagado"; cl.factura.color = "badge-soft-success"; }
//          }
//       });
//         res.render('ventas-vendedor', {user: req.user, facturacion})
//  }


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
// todo ===========>>> Generar codigo numero aleatorio del cliente
const generarPass_vendedor = (num) => {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result1 = "";
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result1;
  }