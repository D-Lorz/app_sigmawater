const { log, count } = require("console");
const { promisify} = require("util");
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
    const id_vendedor = req.user.id_consecutivo //del admin saca el id consecutivo del vendedor aprobado 
    const codigo_id_vendedor = req.user.id_vendedor//del admin saca el id alfanumero del vendedor aprobado


    const nuevoRegistroClientes = {
      nombre,segundo_nombre,apellido,correo, telefono,direccion, direccion2,
       ciudad,estado_ubicacion,codigo_postal, id_cliente,id_vendedor,codigo_id_vendedor }
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
// todo -->  Formulario para solicitar credito
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

// todo -->  Mostrar lista de clientes total por vendedor
exports.listarClientes = async (req, res) => {
  // Capturando el id del Vendedor actual
  const id_vendedor = req.user.id_consecutivo;

  // Consultando en DB los clientes que pertenecen al vendedor actual
  conexion.query('SELECT * FROM nuevos_cliente WHERE id_vendedor = ?', [id_vendedor], (err, result) => {
    if (err) throw err;


// todo ===============================>>> Estado del solicitar credito
let credito =  conexion.query('SELECT * FROM solicitar_credito WHERE id_cliente = ? LIMIT 1', [id_vendedor.id])
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
// todo =========================>> Estados de la agenda para instalar el producto
let consultaEstado_instalacion =  conexion.query('SELECT * FROM agendar_instalacion WHERE id_cliente = ? LIMIT 1 ', [id_vendedor.id])

let estado_intalacion = []
estado_intalacion.txt = "No solicitado";
estado_intalacion.background = 'badge-soft-dark'

if (consultaEstado_instalacion.length > 0) {
  consultaEstado_instalacion = consultaEstado_instalacion[0]

if (consultaEstado_instalacion.estado_agenda === '0') {
  estado_intalacion.txt= "Listo para instalar";
  estado_intalacion.background = 'badge-soft-warning'
  
} else if (consultaEstado_instalacion.estado_agenda == 1) {
  estado_intalacion.txt= "Instalado";
  estado_intalacion.background= 'visitado';

  } 
}

    res.render('lista-clientes', { user: req.user,clientes: result,estado,estado_intalacion})
  })

}

// ! >>>>>>>>>  Tarjetas en la vista perfil clientes <<<<<<<<<<<
exports.listarClientes_PerfilClientes = async (req, res) => {

   const id_cliente = req.params.id
   let clientes2 = await conexion.query('SELECT * FROM nuevos_cliente WHERE id_cliente = ? LIMIT 1', [id_cliente])
   clientes2 = clientes2[0]


// todo ===============================>>> Estado del solicitar credito
  let creditoVista_interna = await conexion.query('SELECT * FROM solicitar_credito WHERE id_cliente = ? LIMIT 1', [clientes2.id])

      let estado = []
      estado.txt = "No solicitado";
      estado.color = 'badge-soft-dark'
      estado.verBtn = true;
    
      if (creditoVista_interna.length > 0) {
        creditoVista_interna = creditoVista_interna[0]
        if (creditoVista_interna.estado_del_credito === '0') {
          estado.txt = "En revisión";
          estado.color = 'badge-soft-warning'
          estado.verBtn = false;
        } else if (creditoVista_interna.estado_del_credito == 1) {
          estado.txt = "Aprobado";
          estado.color = 'badge-soft-success'
          estado.verBtn = false;
        } else if (creditoVista_interna.estado_del_credito == 2) {
          estado.txt = "Rechazado";
          estado.color = 'badge-soft-danger'
          estado.verBtn = false;
        } else if (creditoVista_interna.estado_del_credito == 3) {
          estado.txt = "Pagado (cash)";
          estado.color = 'badge-soft-info'
          estado.verBtn = false;
        }
      }
// todo =========>>>>> Activar o Desactivar btn: Agendar Instalación - ubicado en Perfil-clientes
  let validarBtnInstalacion = await conexion.query('SELECT * FROM solicitar_credito WHERE id_cliente = ? LIMIT 1', [clientes2.id])
  let estadoBtn = []
  estadoBtn.txt = "Solicitar instalación";
  estadoBtn.btnAgenda = false;

      if (validarBtnInstalacion.length > 0) {
        validarBtnInstalacion = validarBtnInstalacion[0]

       if (validarBtnInstalacion.estado_del_credito == 0) {
          estadoBtn.btnAgenda = false;

        } else if (validarBtnInstalacion.estado_del_credito == 1) {
          estadoBtn.btnAgenda = true;
          estadoBtn.txt = "Solicitar instalación";

        } else if (validarBtnInstalacion.estado_del_credito == 2) {
          estadoBtn.btnAgenda = false;

        } else if (validarBtnInstalacion.estado_del_credito == 3) {
           estadoBtn.btnAgenda = true;
           estadoBtn.txt = "Solicitar instalación";
        }
      } else if(!validarBtnInstalacion) {
      
        estadoBtn.btnAgenda = false;
      }
    // todo ===========>>> Desactivar btn: Solicitar instalación cuando el admin ya subío la evidencia 
      let validarBtnAgenda= await conexion.query('SELECT * FROM agendar_instalacion WHERE id_cliente = ? LIMIT 1', [clientes2.id])
      estadoBtn.txt = "Solicitar instalación";
      
    
          if (validarBtnAgenda.length > 0) {
            validarBtnAgenda = validarBtnAgenda[0]
    
           if (validarBtnAgenda.estado_agenda == 1) {
              estadoBtn.btnAgenda = false;
              estadoBtn.txt = "Solicitar instalación";
    
            } 
          }
  // todo ===========>>> Formatear mascara de campos /pendientes los demas campos numericos el formulario credito/
      let mostrarProducto = await conexion.query('SELECT * FROM solicitar_credito WHERE id_cliente = ? LIMIT 1', [clientes2.id])
      mostrarProducto = mostrarProducto[0]

       if(mostrarProducto ) {
          mostrarProducto.monto_aprobado = formatear.format(mostrarProducto.monto_aprobado )
         }
       

// todo =========================>> Mostrar información del test de agua del cliente
    let informacionTestAgua = await conexion.query('SELECT * FROM test_agua WHERE id_cliente = ?  ', [clientes2.id])
  
      // * >>> Estados del testeo (visita al cliente)
      let consultaEstado_testAgua = await conexion.query('SELECT * FROM test_agua WHERE id_cliente = ?  ORDER BY id DESC LIMIT 1', [clientes2.id])
       
       let estadoVisita_testAgua = []
        estadoVisita_testAgua.txt = "A la fecha el cliente aun no ha sido visitado";
        estadoVisita_testAgua.color = '';
        estadoVisita_testAgua.background = 'noVisitado';
        
      if (consultaEstado_testAgua.length > 0) {
        consultaEstado_testAgua = consultaEstado_testAgua[0]

      if (consultaEstado_testAgua.estado_visita_test === '0') {
          estadoVisita_testAgua.txt= "Se realizó un test de agua el";
          estadoVisita_testAgua.background= 'visitado';
         
        } 
        
      }
      
// todo =========================>> Consulta del PRIMER test de agua para la fecha y grafica
  let consulta_PrimerTestAgua = await conexion.query('SELECT * FROM test_agua ORDER BY id DESC LIMIT 1, 1', [clientes2.id])
   
  if(consulta_PrimerTestAgua.length > 0 ){
    consulta_PrimerTestAgua = consulta_PrimerTestAgua[0]
  }
  const datosJson_PrimerTestagua = JSON.stringify(consulta_PrimerTestAgua);

// todo =========================>> Consulta del ULTIMO test de agua para la fecha y grafica
   let consulta_UltimoTestAgua = await conexion.query('SELECT * FROM test_agua WHERE estado_visita_test = 0 ORDER BY id DESC LIMIT 1; ', [clientes2.id])
 
      if(consulta_UltimoTestAgua.length > 0 ){
         consulta_UltimoTestAgua = consulta_UltimoTestAgua[0]
       }
      const datosJson_UltimoTestagua = JSON.stringify(consulta_UltimoTestAgua);

// todo =========================>> Mostrar información del ahorro del cliente
  let ahorroCalculado = await conexion.query('SELECT * FROM ahorro WHERE id_cliente = ?  ORDER BY id DESC LIMIT 1', [clientes2.id])
        if(ahorroCalculado.length > 0 ){
          ahorroCalculado = ahorroCalculado[0]

        }
      var datosJson_ahorroCalculado = JSON.stringify(ahorroCalculado);

// todo =========================>> Estados de la agenda para instalar el producto
    let consultaEstado_instalacion = await conexion.query('SELECT * FROM agendar_instalacion WHERE id_cliente = ? LIMIT 1 ', [clientes2.id])

        let estado_intalacion = []
        estado_intalacion.txt = "La instalación del producto no ha sido agendada";
        estado_intalacion.txtt  = "Aun no se ha solicitado la instalación";
        estado_intalacion.background = 'noVisitado';
   
        
        if (consultaEstado_instalacion.length > 0) {
          consultaEstado_instalacion = consultaEstado_instalacion[0]

        if (consultaEstado_instalacion.estado_agenda === '0') {
          estado_intalacion.txt= "Listo para instalar";
          estado_intalacion.background= 'producto_instalado';
          estado_intalacion.txtt  = "Instalación solicitada";
          estadoBtn.btnAgenda = false;

        } else if (consultaEstado_instalacion.estado_agenda == 1) {
          estado_intalacion.txt= "Instalado";
          estado_intalacion.background= 'visitado';
        
          } 
        }

// todo ===============================>>> Desactivar boton de registro de instalacion
let clRegistro_instalacion = await conexion.query('SELECT * FROM servicios_de_instalacion WHERE id_cliente = ? LIMIT 1', [clientes2.id])

if (clRegistro_instalacion.length > 0) {
  clRegistro_instalacion = clRegistro_instalacion[0]
  
  var evidenciaF= JSON.parse(clRegistro_instalacion.evidencia_fotografica);
}

// * >>> Renderizado <<<<<
  res.render('perfil-clientes', { user: req.user, clientes2, estado,estadoBtn,
    informacionTestAgua, estadoVisita_testAgua, consulta_PrimerTestAgua,
    datosJson_PrimerTestagua, consulta_UltimoTestAgua, datosJson_UltimoTestagua,
    ahorroCalculado, datosJson_ahorroCalculado, estado_intalacion, mostrarProducto,
    evidenciaF, clRegistro_instalacion
   })
}

// todo --> Formulario Test de agua
exports.testAgua = async (req, res) => {

  const event = new Date();
  var fecha_test= event.toLocaleDateString("en-US");
  console.log("FECHA >>>>>>>>");
  console.log(fecha_test);
 
  const dureza_gmXgalon = req.body.dureza_gmXgalon;
  const hierro = req.body.hierro;
  const totalDureza_compensada =  (parseFloat(dureza_gmXgalon)*4)+parseFloat(hierro);
  console.log("SUMA >>>>>>>>>>");
  console.log(totalDureza_compensada);
  const tsd = req.body.tsd;
  const cloro = req.body.cloros;
  const ph = req.body.ph;
  const azufre = req.body.azufre;
  const tanino = req.body.tanino;
  const nitrato = req.body.nitrato;
  const alcalinidad = req.body.alcalinidads;
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
   otro1,concentracion1,otro2,concentracion2,otro3,concentracion3,nota,id_cliente}

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
 
  const sumaGastoMensual = parseFloat(agua_embotellada) + parseFloat(jabones) + parseFloat(productos_limpieza) +
  parseFloat(agua_caliente)+parseFloat(plomeria_electrodomesticos) + parseFloat(ropa_lenceria)
// console.log(">>>>*SUMATORIA DE GASTO MENSUAL*<<<<");
// console.log(sumaGastoMensual);
// console.log(">>>>*------------------------*<<<<");
const sumaAhorroMensual = parseFloat(ahorroMensual_aguaEmbotellada) + parseFloat(ahorroMensual_jabon) + parseFloat(ahorroMensual_productos_limpieza) +
parseFloat(ahorroMensual_agua_caliente)+parseFloat(ahorroMensual_plomeria_electrodomesticos) + parseFloat(ahorroMensual_ropa_lenceria)
// console.log(">>>>*SUMATORIA AHORRO MENSUAL *<<<<");
// console.log(sumaAhorroMensual);
// console.log(">>>>*------------------------*<<<<");
const sumaAhorroAnual = parseFloat(ahorroAnual_aguaEmbotellada) + parseFloat(ahorroAnual_jabon) + parseFloat(ahorroAnual_productos_limpieza) +
parseFloat(ahorroAnual_agua_caliente)+parseFloat(ahorroAnual_plomeria_electrodomesticos) + parseFloat(ahorroAnual_ropa_lenceria)
// console.log(">>>>*SUMATORIA AHORRO ANUAL *<<<<");
// console.log(sumaAhorroAnual);
// console.log(">>>>*------------------------*<<<<");

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
      ahorroMensual_ropa_lenceria, ahorroAnual_ropa_lenceria,sumaGastoMensual,sumaAhorroMensual,sumaAhorroAnual, id_cliente  
    
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

// todo ===========>>>  Elegir Sistema
exports.elegirSistema= async (req, res) => {

  const id_clienteCodigo = req.body.id_clienteCodigo;
  const id_cliente = req.body.id_consecutivo;
  const sistema	 = req.body.sistemaElegido;
  const estado_del_credito = 1
  const monto_aprobado = req.body.montoAprobadoPorFuera.replace(/[$ ,]/g, '');
  let monto_maximo = 8500

  let porcentaje_aprobado = ((monto_aprobado*100)/monto_maximo).toFixed(1)

  if (sistema == "Reverse Osmosis System") {
    monto_maximo = 4250
    porcentaje_aprobado = ((monto_aprobado*100)/monto_maximo).toFixed(1)
  } 

  const datosElegirSistema= { id_cliente, sistema, estado_del_credito, monto_aprobado, porcentaje_aprobado, monto_maximo };

  await conexion.query("INSERT INTO solicitar_credito SET ?", [datosElegirSistema], (err, result) => {
    if (err) throw err;
    if (result) { res.redirect('/perfil-clientes/'+id_clienteCodigo) }
  })

// todo ===============================>>> Estado del solicitar credito
let creditoVista_interna = await conexion.query('SELECT * FROM solicitar_credito WHERE id_cliente = ? LIMIT 1', [clientes2.id])
let estadoPorfuera = []
estadoPorfuera.verBtn = true;

if (creditoVista_interna.length > 0) {
  creditoVista_interna = creditoVista_interna[0]

  if (creditoVista_interna.estado_del_credito == 1) {
     estadoPorfuera.verBtn = false;
  } 
}

};

exports.getRegistrarInstalacion = async (req, res) => {
  const id = req.params.id

  await conexion.query('SELECT * FROM nuevos_cliente WHERE id_cliente = ? LIMIT 1', [id], (err, result) => {
    if (err) throw err;
    res.render('./1-admin/registro-instalacion', { user: req.user, cl_instalacion: result[0] });

  })

}

// todo ====>>>>  Generar codigo numero aleatorio del cliente
const generateRandomNumber = (num) => {
  const characters = '0123456789';
  let result1 = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result1;
}
// todo ====>>> Formateando precios a una moneda 
const formatear = new Intl.NumberFormat('en-US', {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

// todo ====>>>> Numero de clientes añadidos
exports.numeroClientes = async (req, res) => {
 const id_vendedor = req.user.id_consecutivo;
   const id_vendedores = req.user.id_vendedor;

  let countCliente = await conexion.query('SELECT count(correo) as totalClientes FROM nuevos_cliente WHERE id_vendedor = ?', [id_vendedor]) 
    console.log("Numero de clientes ===>>>");
        console.log(countCliente[0].totalClientes);
        
  let countAfiliados = await conexion.query('SELECT count(codigo_afiliado) as totalAfiliados FROM registro_de_vendedores WHERE codigo_afiliado = ?', [id_vendedores]) 
    console.log("Numero de vendedores afilaidos ===>>>");
       console.log(countAfiliados[0].totalAfiliados);

 res.render('dashboard', { user: req.user, totalCliente : countCliente[0].totalClientes,totalAfiliado : countAfiliados[0].totalAfiliados });
     
 }



