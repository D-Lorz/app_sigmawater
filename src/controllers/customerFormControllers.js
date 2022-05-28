const {
  promisify
} = require("util");
const conexion = require("../database/db");



// todo --> formulario para crear un nuevo cliente
exports.registrarClientes = async (req, res) => {

    const nombre = req.body.nombre;
    const segundo_nombre = req.body.segundo_nombre;
    const apellido = req.body.apellido;
    const correo = req.body.correo;
    const telefono = req.body.telefono;
    const direccion = req.body.direccion;
    const direccion2 = req.body.direccion2;
    const ciudad = req.body.ciudad;
    const estado_ubicacion = req.body.estado_ubicacion;
    const codigo_postal = req.body.codigo_postal;

     const id_cliente = generateRandomNumber(6); // * Se almacena el ID del cliente codigo numerico
    const id_vendedor = req.user.id


    const nuevoRegistroClientes = {
      nombre,segundo_nombre,apellido,correo, telefono,direccion, direccion2,
       ciudad,estado_ubicacion,codigo_postal, id_cliente,id_vendedor
    }
    console.log(nuevoRegistroClientes)

    await conexion.query('INSERT INTO nuevos_cliente SET ?', [nuevoRegistroClientes], (err, result) => {
      if (err) throw err;
      console.log(" ========>> 1 Registro Cliente ");
      console.log(result)
      console.log(" ========>> 1 Registro Cliente ");
      res.redirect('/lista-clientes')
    })


}

//------------------------------------------------
exports.getSolicitudCreditos = async (req, res) => {
  const id = req.params.id

  await conexion.query('SELECT * FROM nuevos_cliente WHERE id_cliente = ? LIMIT 1', [id], (err, result) => {
    if (err) throw err;
    res.render('solicitar-credito', { user: req.user, cliente: result[0] });

  })

}
exports.getAhorro = async (req, res) => {
  const id = req.params.id

  await conexion.query('SELECT * FROM nuevos_cliente WHERE id_cliente = ? LIMIT 1', [id], (err, result) => {
    if (err) throw err;
    res.render('calcular-ahorro', { user: req.user, ahorroCliente: result[0] });

  })

}
exports.getTestAgua = async (req, res) => {
  const id = req.params.id

  await conexion.query('SELECT * FROM nuevos_cliente WHERE id_cliente = ? LIMIT 1', [id], (err, result) => {
    if (err) throw err;
    res.render('test-de-agua', { user: req.user, testAgua: result[0] });

  })

}
exports.getAgendarinstalacion = async (req, res) => {
  const id = req.params.id

  await conexion.query('SELECT * FROM nuevos_cliente WHERE id_cliente = ? LIMIT 1', [id], (err, result) => {
    if (err) throw err;
    res.render('agendar-instalacion', { user: req.user, agendarInstalacion: result[0] });

  })

}
//------------------------------------------------
// todo -->  formulario para solicitar credito
exports.solicitarCredito = async (req, res) => {

  const monto_financiar_cliente = req.body.monto_financiar_cliente.replace(/[$ ]/g, '');
  console.log(">>>>>>>>:" + monto_financiar_cliente);
  const sistema = req.body.sistema
  const numero_licencia_cliente = req.body.numero_licencia_cliente;
  const estado_licencia_cliente = req.body.estado_licencia_cliente;
  const fecha_expedicion_licencia_cliente = req.body.fecha_expedicion_licencia_cliente;
  const fecha_vencimiento_licencia_cliente = req.body.fecha_vencimiento_licencia_cliente;
  const seguro_social_licencia = req.body.seguro_social_licencia;
  const tipo_de_seguro = req.body.tipo_de_seguro;
  const fecha_nacimiento_cliente = req.body.fecha_nacimiento_cliente;
  const telefono_secundario_cliente = req.body.telefono_secundario_cliente;
  const condicion_vivienda = req.body.condicion_vivienda;
  const compa_hipotecaria_cliente = req.body.compa_hipotecaria_cliente;
  const anio_residencia_cliente = req.body.anio_residencia_cliente;
  const meses_residencia_cliente = req.body.meses_residencia_cliente;
  const empleador_aplicante_cliente = req.body.empleador_aplicante_cliente;
  const anios_trabajando_ingresos = req.body.anios_trabajando_ingresos;
  const meses_trabajando_ingresos = req.body.meses_trabajando_ingresos;
  const salario_mensual_ingresos = req.body.salario_mensual_ingresos.replace(/[$ ]/g, '');
  console.log(">>>>>>>>:" + salario_mensual_ingresos);
  const bancarrota = req.body.bancarrota;
  const sacc_pendiente = req.body.sacc_pendiente;
  const ocupacion_ingresos = req.body.ocupacion_ingresos;
  const anio_bancarrota_ingresos = req.body.anio_bancarrota_ingresos;
  const telefono_trabajo_ingresos = req.body.telefono_trabajo_ingresos;
  const tipo_bancarrota_ingresos = req.body.tipo_bancarrota_ingresos;
  const empleador_anterior_ingresos = req.body.empleador_anterior_ingresos;
  const otros_ingresos_ingresos = req.body.otros_ingresos_ingresos;
  const ingresos_adicionales_ingresos = req.body.ingresos_adicionales_ingresos.replace(/[$ ]/g, '');
  console.log(">>>>>>>>:" + ingresos_adicionales_ingresos);
  const tipo_cuenta_bancaria = req.body.tipo_cuenta_bancaria;
  const numero_ruta_bancaria = req.body.numero_ruta_bancaria;
  const numero_cuenta_bancaria = req.body.numero_cuenta_bancaria;
  const licencia_co_solicitante = req.body.licencia_co_solicitante;
  const expedicion_licencia_co_solicitante = req.body.expedicion_licencia_co_solicitante;
  const vencimiento_licencia_co_solicitante = req.body.vencimiento_licencia_co_solicitante;
  const numero_se_social_co_solicitante = req.body.numero_se_social_co_solicitante;
  const tipo_seguro_co_solicitante = req.body.tipo_seguro_co_solicitante;
  const fecha_nacimiento_co_solicitante = req.body.fecha_nacimiento_co_solicitante;
  const nombre_co_solicitante = req.body.nombre_co_solicitante;
  const segundo_nombre_co_solicitante = req.body.segundo_nombre_co_solicitante;
  const apellido_co_solicitante = req.body.apellido_co_solicitante;
  const telefono_movil_co_solicitante = req.body.telefono_movil_co_solicitante;
  const tel_secundario_co_solicitante = req.body.tel_secundario_co_solicitante;
  const direccion_co_solicitante = req.body.direccion_co_solicitante;
  const relacion_parentesco_co_solicitante = req.body.relacion_parentesco_co_solicitante;
  const militar_active = req.body.militar_active;
  const empleador_co_solicitante = req.body.empleador_co_solicitante;
  const anios_trabajando_co_solicitante = req.body.anios_trabajando_co_solicitante;
  const meses_trabajando_co_solicitante = req.body.meses_trabajando_co_solicitante;
  const salario_mensual_co_solicitante = req.body.salario_mensual_co_solicitante.replace(/[$ ]/g, '');
  console.log(">>>>>>>>:" + salario_mensual_co_solicitante);
  const ocupacion_co_solicitante = req.body.ocupacion_co_solicitante;
  const telefono_trabajo_co_solicitante = req.body.telefono_trabajo_co_solicitante;
  const empleador_anterior_co_solicitante = req.body.empleador_anterior_co_solicitante;
  const ingresos_co_solicitante = req.body.ingresos_co_solicitante;
  const ingresos_adicionales_co_solicitante = req.body.ingresos_adicionales_co_solicitante.replace(/[$ ]/g, '');
  console.log(">>>>>>>>:" + ingresos_adicionales_co_solicitante);
  const nom_referencia1_co_solicitante = req.body.nom_referencia1_co_solicitante;
  const parentesco1_co_solicitante = req.body.parentesco1_co_solicitante;
  const tel_movil1_co_solicitante = req.body.tel_movil1_co_solicitante;
  const nom_referencia2_co_solicitante = req.body.nom_referencia2_co_solicitante;
  const parentesco2_co_solicitante = req.body.parentesco2_co_solicitante;
  const tel_movil2_co_solicitante = req.body.tel_movil2_co_solicitante;
  const nom_referencia3_co_solicitante = req.body.nom_referencia3_co_solicitante;
  const parentesco3_co_solicitante = req.body.parentesco3_co_solicitante;
  const tel_movil3_co_solicitante = req.body.tel_movil3_co_solicitante;

  console.log("FRONTAL:>>>  ", urlLicencias[0]);
  console.log("TRASERA:>>>  ", urlLicencias[1]);

  const frontal = '../licences_customers/' + urlLicencias[0]
  const trasera = '../licences_customers/' + urlLicencias[1]

  const licencia_cliente = JSON.stringify({
    'frontal': frontal,
    'trasera': trasera

  });

  const acuerdo_firmado = req.body.acuerdo_firmado
  const id_cliente = req.body.id_cliente

  const objeto_datos = {
    monto_financiar_cliente, sistema,numero_licencia_cliente, estado_licencia_cliente,
    fecha_expedicion_licencia_cliente, fecha_vencimiento_licencia_cliente, seguro_social_licencia,
    tipo_de_seguro,fecha_nacimiento_cliente,telefono_secundario_cliente, condicion_vivienda,
    compa_hipotecaria_cliente,anio_residencia_cliente, meses_residencia_cliente,
    empleador_aplicante_cliente,anios_trabajando_ingresos,meses_trabajando_ingresos,
    salario_mensual_ingresos, bancarrota, sacc_pendiente, ocupacion_ingresos,
    anio_bancarrota_ingresos,telefono_trabajo_ingresos,tipo_bancarrota_ingresos,
    empleador_anterior_ingresos, otros_ingresos_ingresos, ingresos_adicionales_ingresos,
    tipo_cuenta_bancaria,numero_ruta_bancaria, numero_cuenta_bancaria,
    licencia_co_solicitante,expedicion_licencia_co_solicitante, vencimiento_licencia_co_solicitante,
    numero_se_social_co_solicitante,tipo_seguro_co_solicitante, fecha_nacimiento_co_solicitante,
    nombre_co_solicitante, segundo_nombre_co_solicitante, apellido_co_solicitante,
    telefono_movil_co_solicitante,tel_secundario_co_solicitante, direccion_co_solicitante,
    relacion_parentesco_co_solicitante, militar_active, empleador_co_solicitante,
    anios_trabajando_co_solicitante, meses_trabajando_co_solicitante,salario_mensual_co_solicitante,
    ocupacion_co_solicitante,telefono_trabajo_co_solicitante, empleador_anterior_co_solicitante,
    ingresos_co_solicitante,ingresos_adicionales_co_solicitante, nom_referencia1_co_solicitante,
    parentesco1_co_solicitante,tel_movil1_co_solicitante,nom_referencia2_co_solicitante,
    parentesco2_co_solicitante, tel_movil2_co_solicitante, nom_referencia3_co_solicitante,
    parentesco3_co_solicitante, tel_movil3_co_solicitante, licencia_cliente, acuerdo_firmado, id_cliente

  }
  
  // * --> Actualizar datos personales del cliente
  const nombre = req.body.nombre;
  const segundo_nombre = req.body.segundo_nombre;
  const apellido = req.body.apellido;
  const correo = req.body.correo;
  const telefono = req.body.telefono;
  const direccion = req.body.direccion;
  const ciudad = req.body.ciudad;
  const estado_ubicacion = req.body.estado_ubicacion;
  const codigo_postal = req.body.codigo_postal;

  // --> Número aleatorio de cliente
  const numCliente = req.body.numCliente

  const actualizarCliente = { nombre, segundo_nombre, apellido, correo, telefono, direccion, ciudad, estado_ubicacion, codigo_postal }

  await conexion.query("UPDATE nuevos_cliente SET ? WHERE id = ?", [actualizarCliente, id_cliente])
  //  --> Insertar datos de la solicitud de crédito del cliente
  await conexion.query("INSERT INTO solicitar_credito SET ?", [objeto_datos], (err, result) => {
    if (err) throw err;
    if (result) { res.redirect('/perfil-clientes/'+numCliente) }
  })

}

// todo -->  mostrar lista de clientes total por vendedor
exports.listarClientes = async (req, res) => {
  // Capturando el id del Vendedor actual
  const id_vendedor = req.user.id;

  // Consultando en DB los clientes que pertenecen al vendedor actual
  conexion.query('SELECT * FROM nuevos_cliente WHERE id_vendedor = ?', [id_vendedor], (err, result) => {
    if (err)
      throw err;
    res.render('lista-clientes', { user: req.user,clientes: result })
  })

}


// todo -->  tarjetas en la vista perfil clientes
exports.listarClientes_PerfilClientes = async (req, res) => {
// ? ===============================
  const id_cliente = req.params.id
  let clientes2 = await conexion.query('SELECT * FROM nuevos_cliente WHERE id_cliente = ? LIMIT 1', [id_cliente])
   clientes2 = clientes2[0]
// ? ===============================
// ? ===============================>>> Estado del solicitar credito
  let credito = await conexion.query('SELECT * FROM solicitar_credito WHERE id_cliente = ? LIMIT 1', [clientes2.id])
  let estado = []
  estado.txt = "No solicitado";
  estado.color = 'badge-soft-dark'
  estado.verBtn = true;

  if (credito.length > 0) {
    credito = credito[0]
    if (credito.estado_del_credito === '0') {
      estado.txt = "En revisión";
      estado.color = 'badge-soft-warning'
      estado.verBtn = false;
    } else if (credito.estado_del_credito == 1) {
      estado.txt = "Aprobado";
      estado.color = 'badge-soft-success'
      estado.verBtn = false;
    } else if (credito.estado_del_credito == 2) {
      estado.txt = "Rechazado";
      estado.color = 'badge-soft-danger'
      estado.verBtn = false;
    } else if (credito.estado_del_credito == 3) {
      estado.txt = "Pagado";
      estado.color = 'badge-soft-info'
      estado.verBtn = false;
    }
  }
  // ? ===============================
  // ? ===============================>> mostrar información del test de agua del cliente
    let vartestAgua = await conexion.query('SELECT * FROM test_agua WHERE id_cliente = ?  ', [clientes2.id])
  
      // * -->> Estados del testeo (visita al cliente)
      let consultaEstados = await conexion.query('SELECT * FROM test_agua WHERE id_cliente = ?  ORDER BY id DESC LIMIT 1', [clientes2.id])
        let estadoServicio = []
        estadoServicio.txt = "A la fecha el cliente aun no ha sido visitado";
        estadoServicio.color = '';
        estadoServicio.background = 'noVisitado';
        
      if (consultaEstados.length > 0) {
          consultaEstados = consultaEstados[0]

      if (consultaEstados.estado_visita_test === '0') {
          estadoServicio.txt= "Se realizó un test de agua el";
          estadoServicio.background= 'visitado';
          
        } else if (consultaEstados.estado_visita_test == 1) {
          estadoServicio.txt = "Instalado";
          estadoServicio.color = 'badge-soft-info'
          } 
        
      }

   let consultaUltimoTest = await conexion.query('SELECT * FROM test_agua WHERE estado_visita_test = 0 ORDER BY id DESC LIMIT 1; ', [clientes2.id])
   
   if(consultaUltimoTest.length > 0 ){
    consultaUltimoTest = consultaUltimoTest[0]
  }

     console.log(">>>>>>>>ULTIMO TESTEO>>>>");

      console.log(consultaUltimoTest);
  // ? ===============================


  // * -->> mostrar información del ahorro del cliente
  let varAhorro = await conexion.query('SELECT * FROM ahorro WHERE id_cliente = ?  ORDER BY id DESC LIMIT 1', [clientes2.id])
   if(varAhorro.length > 0 ){
    varAhorro = varAhorro[0]
  }
 
// ? ===============================>> Estados de la agenda para instalar el producto
    let consultaEstado_instalacion = await conexion.query('SELECT * FROM agendar_instalacion WHERE id_cliente = ? LIMIT 1 ', [clientes2.id])

        let estado_intalacion = []
        estado_intalacion.txt = "La instalación del producto no ha sido agendada";
        estado_intalacion.background = 'noVisitado';
        
        if (consultaEstado_instalacion.length > 0) {
          consultaEstado_instalacion = consultaEstado_instalacion[0]

        if (consultaEstado_instalacion.estado_agenda === '0') {
          estado_intalacion.txt= "Listo para instalar";
          estado_intalacion.background= 'visitado';
          
        } else if (consultaEstado_instalacion.estado_agenda == 1) {
          estado_intalacion.txt= "Instalado";
          estado_intalacion.background= 'producto_instalado';
        
          } 
        }

        const grafica = JSON.stringify(varAhorro);


 // ? ===============================     
  res.render('perfil-clientes', { user: req.user, clientes2, estado,vartestAgua,varAhorro,grafica,estadoServicio,estado_intalacion,
    consultaUltimoTest
   })


}

// todo --> Formulario Test de agua
exports.testAgua = async (req, res) => {

  const event = new Date();
  var fecha_test= event.toLocaleString({ timeZone: 'UTC' });
  console.log("FECHA >>>>>>>>");
  console.log(fecha_test);
 
  const dureza_gmXgalon = req.body.dureza_gmXgalon;
  const hierro = req.body.hierro;
  const totalDureza_compensada =  (parseFloat(dureza_gmXgalon)*4)+parseFloat(hierro);
  console.log("SUMA >>>>>>>>>>");
  console.log(totalDureza_compensada);
  const tsd = req.body.tsd;
  const cloro = req.body.cloro;
  const ph = req.body.ph;
  const azufre = req.body.azufre;
  const tanino = req.body.tanino;
  const nitrato = req.body.nitrato;
  const alcalinidad = req.body.alcalinidad;
  const otro1 = req.body.otro1[0];
  const concentracion1 = req.body.concentracion1[0]
  const otro2 = req.body.otro1[1];
  const concentracion2 = req.body.concentracion1[1]
  const otro3 = req.body.otro1[2];
  const concentracion3 = req.body.concentracion1[2]
  const nota = req.body.nota;
  
   
  const id_cliente = req.body.id_cliente
  const codigo_cliente = req.body.codigo_cliente

 const Datos_testAgua = {
  fecha_test, dureza_gmXgalon, hierro,totalDureza_compensada, tsd,cloro,ph,azufre, tanino, nitrato,alcalinidad,
   otro1,concentracion1,
   otro2,concentracion2,
   otro3,concentracion3,
   nota,
   id_cliente
  }

await conexion.query('INSERT INTO test_agua SET ?', [Datos_testAgua], (err, result) => {
  if (err) throw err;
  if (result) { res.redirect('/perfil-clientes/'+codigo_cliente) }
    
   })

}

// todo --> Formulario de calcular ahorro
exports.ahorro = async (req, res) => {

  const agua_embotellada = req.body.agua_embotellada.replace(/[$ ]/g, '');
  const ahorroMensual_aguaEmbotellada =  agua_embotellada * 1
  const ahorroAnual_aguaEmbotellada = ahorroMensual_aguaEmbotellada * 12 

  const jabones = req.body.jabones.replace(/[$ ]/g, '');
  const ahorroMensual_jabon =  jabones * 0.75
  const ahorroAnual_jabon = ahorroMensual_jabon * 12 

  const productos_limpieza = req.body.productos_limpieza.replace(/[$ ]/g, '');
  const ahorroMensual_productos_limpieza =  productos_limpieza * 0.75
  const ahorroAnual_productos_limpieza = ahorroMensual_productos_limpieza * 12 
 

  const agua_caliente = req.body.agua_caliente.replace(/[$ ]/g, '');
  const ahorroMensual_agua_caliente =  agua_caliente * 0.2
  const ahorroAnual_agua_caliente = ahorroMensual_agua_caliente * 12 
 
  const plomeria_electrodomesticos = req.body.plomeria_electrodomesticos.replace(/[$ ]/g, '');
  const ahorroMensual_plomeria_electrodomesticos =  plomeria_electrodomesticos * 0.75
  const ahorroAnual_plomeria_electrodomesticos = ahorroMensual_plomeria_electrodomesticos * 12 
 
  const ropa_lenceria = req.body.ropa_lenceria.replace(/[$ ]/g, '');
  const ahorroMensual_ropa_lenceria =  ropa_lenceria * 0.3
  const ahorroAnual_ropa_lenceria = ahorroMensual_ropa_lenceria * 12 
 

   const id_cliente = req.body.id_cliente
   const codigo_cliente = req.body.codigo_cliente

  const datos_calcular_ahorros = {
      agua_embotellada, jabones, productos_limpieza, agua_caliente,
      plomeria_electrodomesticos, ropa_lenceria,
      ahorroMensual_aguaEmbotellada,ahorroAnual_aguaEmbotellada,
      ahorroMensual_jabon, ahorroAnual_jabon,
      ahorroMensual_productos_limpieza, ahorroAnual_productos_limpieza,
      ahorroMensual_agua_caliente, ahorroAnual_agua_caliente,
      ahorroMensual_plomeria_electrodomesticos, ahorroAnual_plomeria_electrodomesticos,
      ahorroMensual_ropa_lenceria, ahorroAnual_ropa_lenceria, id_cliente  
    
    }

 await conexion.query('INSERT INTO ahorro SET ?', [datos_calcular_ahorros], (err, result) => {
      if (err) throw err;
      if (result) { res.redirect('/perfil-clientes/'+codigo_cliente) }
     
    })


}
// todo --> Formulario agendar instalacion
exports.agendarInstalacionProducto = async (req, res) => {

 const lunes = req.body.lunes
 const martes = req.body.martes
 const miercoles = req.body.miercoles
 const jueves = req.body.jueves
 const viernes = req.body.viernes
 const sabado = req.body.sabado
 const domingo = req.body.domingo
 const fechaInicial = req.body.fechaInicial
 const fechaFinal = req.body.fechaFinal
 const nota_solicitud  = req.body.nota_solicitud
 
//  const horaInstalacion =  req.body.horaInstalacion
 
const id_cliente = req.body.id_cliente
const codigo_cliente = req.body.codigo_cliente

 const Datos_agendarSolicitud = {lunes,martes,miercoles,jueves,viernes,sabado,domingo,fechaInicial,fechaFinal,nota_solicitud,id_cliente}

await conexion.query('INSERT INTO agendar_instalacion SET ?', [Datos_agendarSolicitud], (err, result) => {
  if (err) throw err;
  if (result) { res.redirect('/perfil-clientes/'+codigo_cliente) }
    
   })

}

// todo --> Generar codigo numero aleatorio del cliente
const generateRandomNumber = (num) => {
  const characters = '0123456789';
  let result1 = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result1;
}



// todo --> Formulario servicio instalado
// exports.servicioInstaladosx = async (req, res) => {

//   const fecha_instalacion = req.body.fecha_instalacion;
//   const producto_instalado = req.body.producto_instalado;
//   const instalador = req.body.instalador;
//   const evidencia = '../evidenciaServicio/' + urlLicencias[0]
//   const evidencia_fotografica = JSON.stringify({'evidencia': evidencia,});
//   const nota = req.body.nota;

//    const id_cliente = req.body.id_cliente
//    const codigo_cliente = req.body.codigo_cliente

//  const Datos_servicio = {fecha_instalacion, producto_instalado, instalador,evidencia_fotografica,nota,id_cliente }

// await conexion.query('INSERT INTO servicios_de_instalacion SET ?', [Datos_servicio], (err, result) => {
//   if (err) throw err;
//   if (result) { res.redirect('/perfil-clientes/'+codigo_cliente) }
    
//    })

// }


















// todo --> actualizar datos del cliente
// exports.ActualizarDatos = async (req, res) => {

//   const apellido = req.body.apellido;

//   console.log(actualiazarDatos)

//   await conexion.query('UPDATE nuevos_cliente SET apellido WHERE id_clientes = ?', [{apellido:apellido}], (err, result) => {
//     if (err) throw err;
//     console.log(" ========>> 1 Registro Cliente ");
//     console.log(result)
//     console.log(" ========>> 1 Registro Cliente ");
//     res.redirect('/lista-clientes')
// })


//   }

// // todo: MOSTRAR CANTIDAD DE CLIENTES
// exports.listarCantidadClientes = async (req, res) => {
// Capturando el id del Vendedor actual
// const id_vendedor = req.user.id_vendedor;
// Consultando en DB los clientes que pertenecen al vendedor actual
// conexion.query('SELECT COUNT(*) AS total_afiliados FROM solicitar_credito  WHERE codigo_afiliado = ? ', [id_vendedor], (err, result) => {
// if (err) throw err;

//   console.log("// ------------------------------");
//   console.log(result);
//   console.log("// ------------------------------");

//   res.render('dashboard', {user: req.user,  result: result})


// })

// }

// todo GENERAR CODIGO NUMERICO PARA CLIENTE
