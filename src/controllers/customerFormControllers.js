const conexion = require("../database/db");

// todo ==> Formulario para crear un nuevo cliente
exports.registrarClientes = async (req, res) => {
//  ? NOTA: ==>> Esta es la forma para obtener el año actual <<<<<
  const year = new Date().getFullYear();

  let mes = new Date().getMonth()
  mes == 0 ? mes = 12 : mes = mes + 1

//  ? NOTA: ==>> Esta es la forma para obtener el numero de la semana actual del año entero <<<<<
  currentdate = new Date();
  const oneJan = new Date(currentdate.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
  const semana = Math.ceil((currentdate.getDay() + numberOfDays) / 7) - 1 ;
  console.log("ESTA ES LA SEMANA ACTUAL ==>> ", semana);

//  ? NOTA: ==>> Esta es la forma para obtener la fecha actual <<<<<
  const dia = new Date().getDate();
  console.log(dia);

  const nombre = req.body.nombre;
  const segundo_nombre = req.body.segundo_nombre;
  const apellido = req.body.apellido;
  const correo = req.body.correo;
  const telefono = req.body.telefono;
  const direccion = req.body.direccion;
  const direccion2 = req.body.direccion2;
  const ciudad = req.body.ciudad;
  const latitud = req.body.latitud;
  const longitud = req.body.longitud;
  const estado_ubicacion = req.body.estado_ubicacion;
  const codigo_postal = req.body.codigo_postal;
  const id_cliente = generateRandomNumber(6); // * Se almacena el ID del cliente codigo numerico
  const id_vendedor = req.user.id_consecutivo //del admin saca el id consecutivo del vendedor aprobado 
  const codigo_id_vendedor = req.user.id_vendedor//del admin saca el id alfanumero del vendedor aprobado
  const nuevoRegistroClientes = {
    year, mes, semana, dia, nombre, segundo_nombre, apellido, correo, telefono, direccion, direccion2,
    ciudad, latitud, longitud, estado_ubicacion, codigo_postal, id_cliente, id_vendedor, codigo_id_vendedor
  }

   await conexion.query('INSERT INTO nuevos_cliente SET ?', [nuevoRegistroClientes], (err, result) => {
    if (err) throw err;
    res.redirect('/lista-clientes')
  })

}

//------------------------------------------------

exports.getSolicitudCreditos = async (req, res) => {
  const id = req.params.id
  let infoCl = await conexion.query('SELECT * FROM nuevos_cliente WHERE id_cliente = ? LIMIT 1', [id])
  infoCl = infoCl[0];
  res.render('usuario/solicitar-credito', {headerSolicitarC:true, footerSolicitarC:true, user: req.user, infoCl });
}

exports.getAhorro = async (req, res) => {
  const id = req.params.id
  await conexion.query('SELECT * FROM nuevos_cliente WHERE id_cliente = ? LIMIT 1', [id], (err, result) => {
    if (err) throw err;
    res.render('usuario/calcular-ahorro', { header:true, footer:true, user: req.user, ahorroCliente: result[0] });

  })

}
exports.getTestAgua = async (req, res) => {
  const id = req.params.id
  await conexion.query('SELECT * FROM nuevos_cliente WHERE id_cliente = ? LIMIT 1', [id], (err, result) => {
    if (err) throw err;
    res.render('usuario/test-de-agua', { header: true, footer:true, user: req.user, testAgua: result[0] });

  })

}
exports.getAgendarinstalacion = async (req, res) => {
  const id = req.params.id
  let infoCl = await conexion.query('SELECT * FROM nuevos_cliente WHERE id_cliente = ? LIMIT 1', [id])
  infoCl = infoCl[0]
  res.render('usuario/agendar-instalacion', { header:true, footer:true, user: req.user, infoCl });
}

//------------------------------------------------
// todo ==> Formulario para solicitar credito
exports.solicitarCredito = async (req, res) => {
  const monto_financiar_cliente = req.body.monto_financiar_cliente.replace(/[$ ,]/g, '');
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
  const nombre_banco = req.body.nombre_banco;
  const fecha_tarjeta = req.body.fecha_tarjeta;
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
  const frontal = '../licences_customers/' + urlLicencias[0]
  const trasera = '../licences_customers/' + urlLicencias[1]
  const licencia_cliente = JSON.stringify({'frontal': frontal,'trasera': trasera });
  const acuerdo_firmado = req.body.acuerdo_firmado
  const id_cliente = req.body.id_cliente
  const estado_del_credito = "En revisión"

  const objeto_datos = {
    monto_financiar_cliente, sistema, numero_licencia_cliente, estado_licencia_cliente,
    fecha_expedicion_licencia_cliente, fecha_vencimiento_licencia_cliente, seguro_social_licencia,
    tipo_de_seguro, fecha_nacimiento_cliente, telefono_secundario_cliente, condicion_vivienda,
    compa_hipotecaria_cliente, anio_residencia_cliente, meses_residencia_cliente,
    empleador_aplicante_cliente, anios_trabajando_ingresos, meses_trabajando_ingresos,
    salario_mensual_ingresos, bancarrota, sacc_pendiente, ocupacion_ingresos,
    anio_bancarrota_ingresos, telefono_trabajo_ingresos, tipo_bancarrota_ingresos,
    empleador_anterior_ingresos, otros_ingresos_ingresos, ingresos_adicionales_ingresos,
    tipo_cuenta_bancaria, numero_ruta_bancaria, numero_cuenta_bancaria, nombre_banco, fecha_tarjeta,
    licencia_co_solicitante, expedicion_licencia_co_solicitante, vencimiento_licencia_co_solicitante,
    numero_se_social_co_solicitante, tipo_seguro_co_solicitante, fecha_nacimiento_co_solicitante,
    nombre_co_solicitante, segundo_nombre_co_solicitante, apellido_co_solicitante,
    telefono_movil_co_solicitante, tel_secundario_co_solicitante, direccion_co_solicitante,
    relacion_parentesco_co_solicitante, militar_active, empleador_co_solicitante,
    anios_trabajando_co_solicitante, meses_trabajando_co_solicitante, salario_mensual_co_solicitante,
    ocupacion_co_solicitante, telefono_trabajo_co_solicitante, empleador_anterior_co_solicitante,
    ingresos_co_solicitante, ingresos_adicionales_co_solicitante, nom_referencia1_co_solicitante,
    parentesco1_co_solicitante, tel_movil1_co_solicitante, nom_referencia2_co_solicitante,
    parentesco2_co_solicitante, tel_movil2_co_solicitante, nom_referencia3_co_solicitante,
    parentesco3_co_solicitante, tel_movil3_co_solicitante, licencia_cliente, acuerdo_firmado, id_cliente,estado_del_credito

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
    if (result) { res.redirect('/perfil-clientes/' + numCliente) }
  })

}

// todo ==> Mostrar lista general de clientes 
exports.listarClientes = async (req, res) => {

  // todo ===============================>>> Estado del solicitar credito
  // Capturando el id del Vendedor actual
  const id_vendedor = req.user.id_consecutivo;
  // Consultando en DB los clientes que pertenecen al vendedor logueado
  let listaCl = await conexion.query('SELECT nc.nombre, nc.apellido, nc.correo, nc.telefono, nc.direccion, nc.id_cliente, nc.id as idd, sc.id_cliente as idd_cliente, sc.estado_del_credito as eestado_del_credito, ai.id_cliente as id_clienteAi, ai.estado_agenda FROM nuevos_cliente nc LEFT JOIN solicitar_credito sc ON nc.id = sc.id_cliente LEFT JOIN agendar_instalacion ai ON nc.id = ai.id_cliente WHERE nc.id_vendedor = ?;', [id_vendedor])

  listaCl.forEach((v) => {
    v.estadopro = {};
    v.estadopro.txt = "No solicitado";
    v.estadopro.color = "badge-soft-dark";

    if (listaCl.length > 0) {
      if (v.idd == v.idd_cliente) {
        if (v.eestado_del_credito === 'En revisión') { v.estadopro.txt = "En revisión"; v.estadopro.color = "badge-soft-warning"; }
        if (v.eestado_del_credito === 'Aprobado') { v.estadopro.txt = "Aprobado"; v.estadopro.color = "badge-soft-success"; }
        if (v.eestado_del_credito === 'Rechazado') { v.estadopro.txt = "Rechazado"; v.estadopro.color = "badge-soft-danger"; }
        if (v.eestado_del_credito === 'Pagado(cash)') { v.estadopro.txt = "Pagado(cash)"; v.estadopro.color = "badge-soft-info"; }
      }
    }
    v.estadoAgenda = {};
    v.estadoAgenda.txt = "No solicitado";
    v.estadoAgenda.color = "badge-soft-dark";
    if (listaCl.length > 0) {
      if (v.idd == v.id_clienteAi) {
        if (v.estado_agenda == 0) { v.estadoAgenda.txt = "Listo para instalar"; v.estadoAgenda.color = "badge-soft-warning"; }
         else if (v.estado_agenda == 1) { v.estadoAgenda.txt = "Instalado";v.estadoAgenda.color = "badge-soft-success"; }
      }
    }
  });
  res.render('usuario/lista-clientes', { header:true, footer:true, user: req.user, listaCl })
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
    if (creditoVista_interna.estado_del_credito === 'En revisión') {
      estado.txt = "En revisión"; estado.color = 'badge-soft-warning'
      estado.verBtn = false;
    } else if (creditoVista_interna.estado_del_credito == 'Aprobado') {
      estado.txt = "Aprobado"; estado.color = 'badge-soft-success'
      estado.verBtn = false;
    } else if (creditoVista_interna.estado_del_credito == 'Rechazado') {
      estado.txt = "Rechazado"; estado.color = 'badge-soft-danger'
      estado.verBtn = false;
    } else {
      estado.txt = "Pagado(cash)"; estado.color = 'badge-soft-info'
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
    if (validarBtnInstalacion.estado_del_credito == 'En revisión') { estadoBtn.btnAgenda = false; }
    else if (validarBtnInstalacion.estado_del_credito == 'Aprobado') { estadoBtn.btnAgenda = true; estadoBtn.txt = "Solicitar instalación"; }
    else if (validarBtnInstalacion.estado_del_credito == 'Rechazado') { estadoBtn.btnAgenda = false; }
    else if (validarBtnInstalacion.estado_del_credito == 'Pagado(cash)') { estadoBtn.btnAgenda = true; estadoBtn.txt = "Solicitar instalación"; }
  } else if (!validarBtnInstalacion) { estadoBtn.btnAgenda = false; }

  // todo ===========>>> Desactivar btn: Solicitar instalación cuando el admin ya subío la evidencia 
  let validarBtnAgenda = await conexion.query('SELECT * FROM agendar_instalacion WHERE id_cliente = ? LIMIT 1', [clientes2.id])
  estadoBtn.txt = "Solicitar instalación";

  if (validarBtnAgenda.length > 0) { validarBtnAgenda = validarBtnAgenda[0]
    if (validarBtnAgenda.estado_agenda == 1) { estadoBtn.btnAgenda = false; estadoBtn.txt = "Solicitar instalación"; }
  }
  // todo ===========>>> Formatear mascara de campos /pendientes los demas campos numericos el formulario credito/
  let mostrarProducto = await conexion.query('SELECT * FROM solicitar_credito WHERE id_cliente = ? LIMIT 1', [clientes2.id])
      mostrarProducto = mostrarProducto[0]
  if (mostrarProducto) { mostrarProducto.monto_aprobado = formatear.format(mostrarProducto.monto_aprobado)}

  // todo =========================>> Mostrar información del test de agua del cliente
  let informacionTestAgua = await conexion.query('SELECT * FROM test_agua WHERE id_cliente = ?  ', [clientes2.id])
  // let countCliente = await conexion.query("SELECT count(id) as test FROM test_agua WHERE id_cliente = ?", [clientes2.id]);
  // console.log("=================....>>>", countCliente);
   let cont = 1
  informacionTestAgua.forEach(x => {
    x.cont = cont
    cont++

  });

  // * >>> Estados del testeo (visita al cliente)
  let consultaEstado_testAgua = await conexion.query('SELECT * FROM test_agua WHERE id_cliente = ? ORDER BY id DESC LIMIT 1', [clientes2.id])
    let estadoVisita_testAgua = []
    estadoVisita_testAgua.txt = "A la fecha el cliente aun no ha sido visitado";
    estadoVisita_testAgua.color = '';
    estadoVisita_testAgua.background = 'noVisitado';

  if (consultaEstado_testAgua.length > 0) {consultaEstado_testAgua = consultaEstado_testAgua[0]
    if (consultaEstado_testAgua.estado_visita_test === '0') { estadoVisita_testAgua.txt = "Se realizó un test de agua el";
       estadoVisita_testAgua.background = 'visitado'; }
  }

  // todo =========================>> Consulta del PRIMER test de agua para la fecha y grafica
  let consulta_PrimerTestAgua = await conexion.query('SELECT * FROM test_agua WHERE id_cliente = ? ORDER BY id DESC LIMIT 1, 1', [clientes2.id])

  if (consulta_PrimerTestAgua.length > 0) { consulta_PrimerTestAgua = consulta_PrimerTestAgua[0] }
  const datosJson_PrimerTestagua = JSON.stringify(consulta_PrimerTestAgua);

  // todo =========================>> Consulta del ULTIMO test de agua para la fecha y grafica
  let consulta_UltimoTestAgua = await conexion.query('SELECT * FROM test_agua WHERE id_cliente = ? ORDER BY id DESC LIMIT 1; ', [clientes2.id])
  if (consulta_UltimoTestAgua.length > 0) {consulta_UltimoTestAgua = consulta_UltimoTestAgua[0] }
  const datosJson_UltimoTestagua = JSON.stringify(consulta_UltimoTestAgua);

  // todo =========================>> Mostrar información del ahorro del cliente
  let ahorroCalculado = await conexion.query('SELECT * FROM ahorro WHERE id_cliente = ? ORDER BY id DESC LIMIT 1', [clientes2.id])
  if (ahorroCalculado.length > 0) { 
   ahorroCalculado = ahorroCalculado[0]
  }
  var datosJson_ahorroCalculado = JSON.stringify(ahorroCalculado);

  // todo =========================>> Estados de la agenda para instalar el producto
  let consultaEstado_instalacion = await conexion.query('SELECT * FROM agendar_instalacion WHERE id_cliente = ? LIMIT 1 ', [clientes2.id])

  let estado_intalacion = []
  estado_intalacion.txt = "La instalación del producto no ha sido agendada";
  estado_intalacion.txtt = "Aun no se ha solicitado la instalación";
  estado_intalacion.background = 'noVisitado';

  if (consultaEstado_instalacion.length > 0) { consultaEstado_instalacion = consultaEstado_instalacion[0]
    if (consultaEstado_instalacion.estado_agenda === '0') { estado_intalacion.txt = "Listo para instalar";
        estado_intalacion.background = 'producto_instalado'; estado_intalacion.txtt = "Instalación solicitada";
        estadoBtn.btnAgenda = false;
    } else if (consultaEstado_instalacion.estado_agenda == 1) { estado_intalacion.txt = "Instalado";
       estado_intalacion.background = 'visitado';}
  }

  // todo ===============================>>> Desactivar boton de registro de instalacion
  let clRegistro_instalacion = await conexion.query('SELECT * FROM servicios_de_instalacion WHERE id_cliente = ? LIMIT 1', [clientes2.id])
  let evidenciaF
  if (clRegistro_instalacion.length > 0) { 
        clRegistro_instalacion = clRegistro_instalacion[0]
        evidenciaF = clRegistro_instalacion.evidencia_fotografica
    }

  // * >>> Renderizado <<<<<
  res.render('usuario/perfil-clientes', {
    footerClientes:true, headerClientes:true,
    user: req.user, clientes2, estado, estadoBtn,
    informacionTestAgua, estadoVisita_testAgua, consulta_PrimerTestAgua,
    datosJson_PrimerTestagua, consulta_UltimoTestAgua, datosJson_UltimoTestagua,
    ahorroCalculado, datosJson_ahorroCalculado, estado_intalacion, mostrarProducto,
    evidenciaF, clRegistro_instalacion
  })
}

// todo ==> Formulario Test de agua
exports.testAgua = async (req, res) => {
  const event = new Date();
  let fecha_test = event.toLocaleDateString("en-US");
  const dureza_gmXgalon = parseFloat(req.body.dureza_gmXgalon)
  const hierro = req.body.hierro
  let totalDureza_compensada 
  if(hierro){
    totalDureza_compensada = (parseFloat(dureza_gmXgalon) * 4) + parseFloat(hierro);
  }else {
    totalDureza_compensada = (parseFloat(dureza_gmXgalon) * 4)
  }
  const tsd = req.body.tsd;
  const cloro = req.body.cloros;
  const ph = req.body.ph;
  const azufre = req.body.azufre;
  const tanino = req.body.tanino;
  const nitrato = req.body.nitrato;
  const alcalinidad = req.body.alcalinidad;
  const otro1 = req.body.otro1[0];
  const concentracion1 = req.body.concentracion1[0];
  const otro2 = req.body.otro1[1];
  const concentracion2 = req.body.concentracion1[1];
  const otro3 = req.body.otro1[2];
  const concentracion3 = req.body.concentracion1[2];
  const nota = req.body.nota;
  const id_cliente = req.body.id_cliente;
  const codigo_cliente = req.body.codigo_cliente;
  const Datos_testAgua = {
    fecha_test, dureza_gmXgalon, hierro, totalDureza_compensada, tsd, cloro, ph, azufre, tanino, nitrato, alcalinidad,
    otro1, concentracion1, otro2, concentracion2, otro3, concentracion3, nota, id_cliente
  }
  const Datosfecha_test ={fecha_test}
  await conexion.query('INSERT INTO test_agua SET ?', [Datos_testAgua])
  await conexion.query("UPDATE nuevos_cliente SET ? WHERE id = ?", [Datosfecha_test, id_cliente]);

    res.redirect('/perfil-clientes/' + codigo_cliente) 

}

// todo ==> Formulario de calcular ahorro
exports.ahorro = async (req, res) => {
  const agua_embotellada = req.body.agua_embotellada.replace(/[$ ,]/g, '');
  const ahorroMensual_aguaEmbotellada = parseFloat(agua_embotellada * 1)
  const ahorroAnual_aguaEmbotellada = parseFloat(ahorroMensual_aguaEmbotellada * 12)
  const jabones = req.body.jabones.replace(/[$ ,]/g, '');
  const ahorroMensual_jabon = parseFloat(jabones * 0.75)
  const ahorroAnual_jabon = parseFloat(ahorroMensual_jabon * 12)
  const productos_limpieza = req.body.productos_limpieza.replace(/[$ ,]/g, '');
  const ahorroMensual_productos_limpieza = parseFloat(productos_limpieza * 0.75)
  const ahorroAnual_productos_limpieza = parseFloat(ahorroMensual_productos_limpieza * 12)
  const agua_caliente = req.body.agua_caliente.replace(/[$ ,]/g, '');
  const ahorroMensual_agua_caliente = parseFloat(agua_caliente * 0.2)
  const ahorroAnual_agua_caliente = parseFloat(ahorroMensual_agua_caliente * 12)
  const plomeria_electrodomesticos = req.body.plomeria_electrodomesticos.replace(/[$ ,]/g, '');
  const ahorroMensual_plomeria_electrodomesticos = parseFloat(plomeria_electrodomesticos * 0.75)
  const ahorroAnual_plomeria_electrodomesticos = parseFloat(ahorroMensual_plomeria_electrodomesticos * 12)
  const ropa_lenceria = req.body.ropa_lenceria.replace(/[$ ,]/g, '');
  const ahorroMensual_ropa_lenceria = parseFloat(ropa_lenceria * 0.3)
  const ahorroAnual_ropa_lenceria = parseFloat(ahorroMensual_ropa_lenceria * 12)
  const sumaGastoMensual = parseFloat(agua_embotellada) + parseFloat(jabones) + parseFloat(productos_limpieza) +
    parseFloat(agua_caliente) + parseFloat(plomeria_electrodomesticos) + parseFloat(ropa_lenceria)
  const sumaAhorroMensual = parseFloat(ahorroMensual_aguaEmbotellada) + parseFloat(ahorroMensual_jabon) + parseFloat(ahorroMensual_productos_limpieza) +
    parseFloat(ahorroMensual_agua_caliente) + parseFloat(ahorroMensual_plomeria_electrodomesticos) + parseFloat(ahorroMensual_ropa_lenceria)
  const sumaAhorroAnual = parseFloat(ahorroAnual_aguaEmbotellada) + parseFloat(ahorroAnual_jabon) + parseFloat(ahorroAnual_productos_limpieza) +
    parseFloat(ahorroAnual_agua_caliente) + parseFloat(ahorroAnual_plomeria_electrodomesticos) + parseFloat(ahorroAnual_ropa_lenceria)
  const id_cliente = req.body.id_cliente
  const codigo_cliente = req.body.codigo_cliente
  const datos_calcular_ahorros = {
    agua_embotellada, jabones, productos_limpieza, agua_caliente,
    plomeria_electrodomesticos, ropa_lenceria,
    ahorroMensual_aguaEmbotellada, ahorroAnual_aguaEmbotellada,
    ahorroMensual_jabon, ahorroAnual_jabon,
    ahorroMensual_productos_limpieza, ahorroAnual_productos_limpieza,
    ahorroMensual_agua_caliente, ahorroAnual_agua_caliente,
    ahorroMensual_plomeria_electrodomesticos, ahorroAnual_plomeria_electrodomesticos,
    ahorroMensual_ropa_lenceria, ahorroAnual_ropa_lenceria, sumaGastoMensual, sumaAhorroMensual, sumaAhorroAnual, id_cliente
  }
  await conexion.query('INSERT INTO ahorro SET ?', [datos_calcular_ahorros], (err, result) => {
    if (err) throw err;
    if (result) { res.redirect('/perfil-clientes/' + codigo_cliente) }
  })
}

// todo ==> Formulario agendar instalacion
exports.agendarInstalacionProducto = async (req, res) => {
  let {lunes,martes,miercoles,jueves,viernes,sabado,domingo,hora_inicial,hora_final,fecha_especifica,nota_solicitud,id_cliente } = req.body
  lunes ? lunes = 'lunes' : lunes = ''
  martes ? martes = 'martes': martes = ''
  miercoles ? miercoles = 'miercoles' : miercoles = ''
  jueves ? jueves = 'jueves' : jueves = ''
  viernes ? viernes = 'viernes' : viernes = ''
  sabado ? sabado = 'sabado' : sabado = ''
  domingo ? domingo = 'domingo' : domingo = ''
  const Datos_agendarSolicitud = { lunes, martes, miercoles, jueves, viernes, sabado, domingo, hora_inicial, hora_final, fecha_especifica, nota_solicitud, id_cliente }
  await conexion.query('INSERT INTO agendar_instalacion SET ?', [Datos_agendarSolicitud], (err, result) => {
    if (err) { res.send(false) }
    res.send(true)
  })
}

// todo ==> Elegir Sistema
exports.elegirSistema = async (req, res) => {
  const id_clienteCodigo = req.body.id_clienteCodigo;
  const id_cliente = req.body.id_consecutivo;
  const sistema = req.body.sistemaElegido;
  const estado_del_credito = 'Aprobado'
  const monto_aprobado = req.body.montoAprobadoPorFuera.replace(/[$ ,]/g, '');
  let monto_maximo = 11200
  let porcentaje_aprobado = ((monto_aprobado * 100) / monto_maximo).toFixed(1)
  if (sistema == "Reverse Osmosis System") {
    monto_maximo = 5600
    porcentaje_aprobado = ((monto_aprobado * 100) / monto_maximo).toFixed(1)
  }
  const datosElegirSistema = { id_cliente, sistema, estado_del_credito, monto_aprobado, porcentaje_aprobado, monto_maximo };
  await conexion.query("INSERT INTO solicitar_credito SET ?", [datosElegirSistema], (err, result) => {
    if (err) throw err;
    if (result) { res.redirect('/perfil-clientes/' + id_clienteCodigo) }
  })
  // todo ===============================>>> Estado del solicitar credito
  let creditoVista_interna = await conexion.query('SELECT * FROM solicitar_credito WHERE id_cliente = ? LIMIT 1', [clientes2.id])
  let estadoPorfuera = []
  estadoPorfuera.verBtn = true;
  if (creditoVista_interna.length > 0) {
    creditoVista_interna = creditoVista_interna[0]

    if (creditoVista_interna.estado_del_credito == 'Aprobado') {
      estadoPorfuera.verBtn = false;
    }
  }
};

exports.getRegistrarInstalacion = async (req, res) => {
  const id = req.params.id
  console.log("IMPIMIENDO ID: ==>>  ", id)
  let cl_instalacion = await conexion.query('SELECT n.id, n.id_cliente, c.sistema FROM nuevos_cliente n JOIN solicitar_credito c ON n.id = c.id_cliente WHERE n.id_cliente = ? LIMIT 1', [id])
      cl_instalacion = cl_instalacion[0]
    if (!cl_instalacion) {
      res.clearCookie("jwt");
      return res.redirect("/login");
    }
    res.render('./1-admin/registro-instalacion', { user: req.user, cl_instalacion });
}

// todo ==> Generar codigo numero aleatorio del cliente
const generateRandomNumber = (num) => {
  const characters = '0123456789';
  let result1 = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result1;
}
// todo ==> Formateando precios a una moneda 
const formatear = new Intl.NumberFormat('en-US', {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

// todo ==> Numero de clientes añadidos
exports.dashboardVendedor = async (req, res) => {
  const consecutivo = req.user.id_consecutivo;
  const idVendedor = req.user.id_vendedor;

  let countCliente = await conexion.query("SELECT count(correo) as totalClientes FROM nuevos_cliente WHERE id_vendedor = ?", [consecutivo]);
  console.log(countCliente[0].totalClientes);

  let countAfiliados = await conexion.query("SELECT count(codigo_afiliado) as totalAfiliados FROM registro_de_vendedores WHERE codigo_afiliado = ?", [idVendedor]);
  console.log(countAfiliados[0].totalAfiliados);

  // CAPTURANDO DATOS PARA LA GRÁFICA DE NUEVOS CLIENTES
  let clAgregados = await conexion.query("SELECT * FROM (SELECT * FROM historialnuevosclientes WHERE idVendedor = ? ORDER BY id DESC LIMIT 7) sub ORDER BY id ASC;", [consecutivo]);
  let datosJson_clAgregados, rendimientoCl = 0;
  if (clAgregados.length > 0) {
    datosJson_clAgregados = JSON.stringify(clAgregados);

    let ultimo, penultimo = 0;
    ultimo = clAgregados[clAgregados.length - 1].numClientes;
    if (clAgregados.length >= 2) {
      penultimo = clAgregados[clAgregados.length - 2].numClientes;
      rendimientoCl = (parseFloat(ultimo - penultimo) / penultimo) * 100;
      rendimientoCl = rendimientoCl.toFixed(1);
    }
    if (ultimo == 0 && penultimo == 0) { rendimientoCl = 0 }
    if (penultimo == 0 && ultimo >= 1) { rendimientoCl = 100 }
  }

  // CAPTURANDO DATOS PARA LA GRÁFICA DE VENDEDORES AFILAIDOS
  let aflAgregados = await conexion.query("SELECT * FROM (SELECT * FROM historialvendedores WHERE idVendedor = ? ORDER BY id DESC LIMIT 7) sub ORDER BY id ASC;", [idVendedor]);
  let datosJson_aflAgregados, rendimientoAfl = 0;
  if (aflAgregados.length > 0) {
    console.log("AFILIADOS AGREGADOS", aflAgregados);
    datosJson_aflAgregados = JSON.stringify(aflAgregados);
    console.log("DATOS - JSON - AFLAGREGADOS ==>> ", datosJson_aflAgregados);

    let ultimoafl, penultimoafl = 0;
    ultimoafl = aflAgregados[aflAgregados.length - 1].numAfiliados;
    if (aflAgregados.length >= 2) {
      penultimoafl = aflAgregados[aflAgregados.length - 2].numAfiliados;
      rendimientoAfl = (parseFloat(ultimoafl - penultimoafl) / penultimoafl) * 100;
      rendimientoAfl = rendimientoAfl.toFixed(1);
    }
    if (ultimoafl == 0 && penultimoafl == 0) { rendimientoAfl = 0 }
    if (penultimoafl == 0 && ultimoafl >= 1) { rendimientoAfl = 100 }
  }

  let ventasCiudades = await conexion.query("SELECT nc.ciudad, nc.latitud, nc.longitud, nc.codigo_postal FROM nuevos_cliente nc JOIN servicios_de_instalacion si ON nc.id = si.id_cliente WHERE nc.id_vendedor = ?;", [consecutivo]);

  if (ventasCiudades.length > 0) {
    // ventasCiudades = ventasCiudades[0]
    console.log("VENTAS CIUDADAES =>>>", ventasCiudades);

  }
  let datosJson_ventasCiudades = JSON.stringify(ventasCiudades);

  // todo ============
  /** CONSULTANDO # DE VENTAS DE VENDEDORES PROPIAS Y AFILIADOS */
  let numVentas_ = { propias:0, afiliados: 0 };
  const allSellers = await conexion.query("SELECT * FROM registro_de_vendedores");
  // Consulta para ganancias propias
  const sellerLogin = allSellers.find(i => i.id_vendedor == idVendedor) //Buscar usuario vendedor logueado en la tabla de vendedores.
  if (sellerLogin) {
    numVentas_.propias = parseFloat(sellerLogin.puntos_individuales)
  }
  // Consulta para ganancias de afiliados del vendedor logueado
  const vAfiliados = allSellers.filter(i => i.codigo_afiliado == idVendedor)
  if (vAfiliados) {
    vAfiliados.forEach(x => {
      numVentas_.afiliados += x.puntos_individuales
    })
  }

  // CAPTURANDO DATOS PARA LA GRÁFICA NÚMEROS DE VENTAS PROPIAS X VENDEDOR
  let historial_vPropias = await conexion.query("SELECT * FROM (SELECT * FROM historial_numventas WHERE idVendedor = ? ORDER BY id DESC LIMIT 7) sub ORDER BY id ASC;", [idVendedor]);
  let json_ventasVendedor, rendimiento_vPropias = 0;
  if (historial_vPropias.length > 0) {
    json_ventasVendedor = JSON.stringify(historial_vPropias);
    let ultimo, penultimo = 0;
    ultimo = historial_vPropias[historial_vPropias.length - 1].numVentas;
    if (historial_vPropias.length >= 2) {
      penultimo = historial_vPropias[historial_vPropias.length - 2].numVentas;
      rendimiento_vPropias = (parseFloat(ultimo - penultimo) / penultimo) * 100;
      rendimiento_vPropias = rendimiento_vPropias.toFixed(1);
    }
    if (ultimo == 0 && penultimo == 0) { rendimiento_vPropias = 0 }
    if (penultimo == 0 && ultimo >= 1) { rendimiento_vPropias = 100 }
  }

  // CAPTURANDO DATOS PARA LA GRÁFICA NÚMEROS DE VENTAS AFILIADOS X VENDEDOR
  let historial_vAfiliados = await conexion.query("SELECT * FROM (SELECT * FROM historial_ventas_afiliados WHERE idVendedor = ? ORDER BY id DESC LIMIT 7) sub ORDER BY id ASC;", [idVendedor]);
  console.log("\nAFILIADOS NUM VENTAS >>>", historial_vAfiliados)
  let json_ventasAfiliados,rendimiento_vAfiliados = 0;
  if (historial_vAfiliados.length > 0) {
    json_ventasAfiliados = JSON.stringify(historial_vAfiliados);
    let ultimo, penultimo = 0;
    ultimo = historial_vAfiliados[historial_vAfiliados.length - 1].numVentasAfiliados;
    if (historial_vAfiliados.length >= 2) {
      penultimo = historial_vAfiliados[historial_vAfiliados.length - 2].numVentasAfiliados;
      rendimiento_vAfiliados = (parseFloat(ultimo - penultimo) / penultimo) * 100;
      rendimiento_vAfiliados = rendimiento_vAfiliados.toFixed(1);
    }
    if (ultimo == 0 && penultimo == 0) { rendimiento_vAfiliados = 0 }
    if (penultimo == 0 && ultimo >= 1) { rendimiento_vAfiliados = 100 }
  }

  // CAPTURANDO LAS FACTURAS RECIENTES x VENDEDOR (7 REGISTROS MÁXIMO)
  const clientes_ = await conexion.query("SELECT * FROM nuevos_cliente WHERE codigo_id_vendedor = ? ORDER BY id DESC LIMIT 7", [idVendedor]);
  const total_facturas = await conexion.query("SELECT * FROM factura");
  const total_creditos = await conexion.query("SELECT id_cliente, monto_aprobado FROM solicitar_credito");
  const facturas_recientes = []
  // const clientes_ = total_clientes[0];
  // const clientes_ = total_clientes.filter(i => i.codigo_id_vendedor == )
  if (clientes_.length > 0) {
    clientes_.forEach(x => {
      const credito = total_creditos.find(i => i.id_cliente == x.id)
      const factura = total_facturas.find(i => i.id_cliente == x.id)
      console.log("CREDITO >>> ", credito)
      if (factura && credito) {
        let comision = "Por definir";
        if (factura.vendedores) {
          f = JSON.parse(factura.vendedores)
          comision =  f[0].comision_final
        }
        facturas_recientes.push({
          numFactura: factura.id_factura,
          productoVendido: factura.producto_instalado,
          valorVenta: credito.monto_aprobado,
          comision,
          estado: factura.estadoFactura
        })
      }
    })
  }

  // COMPARATIVA DE VENTAS x VENDEDOR LOGUEADO
  let topVendedores = []
  let icono = false;

  const top_vendedores = await conexion.query("SELECT id, nombres, apellidos, codigo_afiliado, id_vendedor, ganancias FROM registro_de_vendedores ORDER BY ganancias DESC LIMIT 5");

  if (top_vendedores.length > 0) {
    let cont = 1;
    const vActual = top_vendedores.find(i => i.id_vendedor == idVendedor)
    if (vActual) {
      top_vendedores.forEach(x => {
        let rendimiento = ((parseFloat(x.ganancias - vActual.ganancias) / vActual.ganancias) * 100).toFixed(1);
        rendimiento = parseFloat(rendimiento);

        if (x.id_vendedor == idVendedor) {
          icono = 2;
        } else {
          icono = 1
        }
                
        if (parseFloat(x.ganancias) == 0 && vActual.ganancias == 0) { rendimiento = 0 }
        if (vActual.ganancias == 0 && parseFloat(x.ganancias) >= 1) { rendimiento = 100 }

        topVendedores.push({
          nombre: x.nombres + " " + x.apellidos,
          rendimiento,
          pos: cont,
          gananciaA: vActual.ganancias,
          gananciaB: x.ganancias,
          icono
        })
        cont++;
      })

      const diferenciaTop = 5 - top_vendedores.length
      if (diferenciaTop != 0) {
        for (let i = 0; i < diferenciaTop; i++) {
          topVendedores.push({
            nombre: "----------------",
            pos: cont,
          })
          cont++;
        }
      }
    }
  }

   // * CAPTURANDO DATOS PARA LA GRÁFICA DE VENTAS MENSUALES X VENDEDOR
   let historialGanancias = await conexion.query("SELECT * FROM (SELECT * FROM historial_ganancias_vendedores WHERE idVendedor = ? ORDER BY id DESC LIMIT 12) sub ORDER BY id ASC;", [idVendedor]);
   let datosJson_historialG
   if (historialGanancias.length > 0) {
    datosJson_historialG = JSON.stringify(historialGanancias);
    console.log("\n");
    console.log("IMPIMIENDO datosJson_h istorialG ====>>>" , datosJson_historialG);
   }

  res.render("usuario/dashboard", { user: req.user,
    totalCliente: countCliente[0].totalClientes,
    totalAfiliado: countAfiliados[0].totalAfiliados,
    datosJson_clAgregados, rendimientoCl, datosJson_aflAgregados, rendimientoAfl,
    datosJson_ventasCiudades, numVentas_, json_ventasVendedor, json_ventasAfiliados,
    rendimiento_vPropias, rendimiento_vAfiliados, facturas_recientes, topVendedores,datosJson_historialG
  });
};

// todo ==> Funciones para tablas historiales
exports.historialClientes = async (req, res) => {

  let clientes = await conexion.query("SELECT * FROM nuevos_cliente");
  let vendedores = await conexion.query("SELECT * FROM registro_de_vendedores");
  let fecha = new Date().toLocaleDateString("en-CA");
  let yearActual = new Date(fecha).getFullYear();

  currentdate = new Date(fecha);
  const oneJan = new Date(currentdate.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
  const semanaActual = Math.ceil((currentdate.getDay() + numberOfDays) / 7) - 1;
  console.log("Semana actual ==>> ", semanaActual);

  let numClientes = 0
  vendedores.forEach(async (v) => {
    const resultado = clientes.filter((item) => item.id_vendedor == v.id && item.semana == semanaActual && item.year == yearActual);
    if (resultado.length > 0) {
      numClientes = resultado.length;
    }
    idVendedor = v.id;
    const customerObj = { fecha, numClientes, idVendedor };
    await conexion.query("INSERT INTO historialnuevosclientes SET ?", [customerObj]);
    console.log("Realizando registro en DB HISTORIAL CLIENTES....")
  });
  return "EJECUCIÓN FINALIZADA..!";
};

exports.historialVendedores = async (req, res) => {
  let fecha = new Date().toLocaleDateString("en-CA");
  let yearActual = new Date(fecha).getFullYear();
  console.log("AÑO => ", yearActual);

  let mesActual = new Date().getMonth()
  mesActual == 0 ? mesActual = 1 : mesActual = mesActual + 1
  console.log("------->>" , mesActual);

  let numAfiliados = 0
  let vendedor = await conexion.query("SELECT id_vendedor FROM registro_de_vendedores;");
  let cAfiliado = await conexion.query("SELECT codigo_afiliado, year, mes FROM registro_de_vendedores;");

  vendedor.forEach(async (v) => {
    const resultado = cAfiliado.filter((item) => item.codigo_afiliado == v.id_vendedor && item.mes == mesActual && item.year == yearActual);
    if (resultado.length > 0) {
      numAfiliados = resultado.length;
      console.log("Id del vendedor => [", v.id_vendedor, "]");
      console.log("# de afiliados => ", numAfiliados);
    } else {
      numAfiliados = resultado.length;
      console.log("Id del vendedor => [", v.id_vendedor, "]");
      console.log("# de afiliados => ", numAfiliados);
    }
    idVendedor = v.id_vendedor;
    const customerObj = { fecha, numAfiliados, idVendedor };
    await conexion.query("INSERT INTO historialvendedores SET ?", [customerObj]);
    console.log("Realizando registro en DB....")
  })
  return "EJECUCIÓN FINALIZADA..!";
};

exports.historial_numVentas = async (req, res) => {
  let ventasFiltro = await conexion.query("SELECT * FROM filtro_numventas");
  let fecha = new Date().toLocaleDateString("en-CA");
  let yearActual = new Date(fecha).getFullYear();

  currentdate = new Date(fecha);
  const oneJan = new Date(currentdate.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
  const semanaActual = Math.ceil((currentdate.getDay() + numberOfDays) / 7) - 1;

  const filtroV = ventasFiltro.filter(v => v.semana == semanaActual && v.year == yearActual)
  if (filtroV) {
    /** FILTRANDO NÚMERO DE VENTAS PROPIAS */
    filtroV.forEach(async v => {
      const numVentas = v.numVentas;
      const idVendedor = v.idVendedor;
      const codigo_afiliado = v.codigo_afiliado;
      const data = { fecha, numVentas, idVendedor, codigo_afiliado };
      await conexion.query("INSERT INTO historial_numventas SET ?", [data]);
      console.log("Realizando registro en DB historial ventas propias....")
    })

    /** FILTRANDO NÚMERO DE VENTAS DE AFILIADOS x VENDEDOR */
    const x = filtroV.reduce((prev, v) => {
      prev[v.codigo_afiliado] = ++prev[v.codigo_afiliado] || 1;
      return prev;
    }, {});
    const obj = new Map();
    filtroV.forEach((act) => {
        if (x[act.codigo_afiliado] > 1){
            if (!obj.has(act.codigo_afiliado)) {
                obj.set(act.codigo_afiliado, act.numVentas)
            } else {
                obj.set(act.codigo_afiliado, obj.get(act.codigo_afiliado)+act.numVentas)
            }
        }
    })
    const datos = Array.from(obj, ([codigo, numVentas]) => ({codigo, numVentas}));
    datos.forEach(x => {
      const dataDB = { fecha, numVentasAfiliados: x.numVentas, idVendedor: x.codigo }
      conexion.query("INSERT INTO historial_ventas_afiliados SET ?", [dataDB])
      console.log("Realizando registro en DB historial ventas afiliados....")
    })
    console.log("RESULT >> ", datos)
  }
  
  return "EJECUCIÓN FINALIZADA..!";
};

exports.historial_ganancias_vendedores = async (req, res) => {
  let tablaGanancias = await conexion.query("SELECT * FROM ganancias ");
  let vendedores = await conexion.query("SELECT id_vendedor FROM registro_de_vendedores");

  let mesActual = new Date().getMonth();
  mesActual == 0 ? (mesActual = 1) : (mesActual = mesActual + 1);
  const mesAnterior = mesActual - 1
  mesAnterior == 12 ? year = year - 1 : false
  const year = new Date().getFullYear();

  vendedores.forEach(async (v)=> {
  const filtroGanancias = tablaGanancias.filter((item) => item.idVendedor == v.id_vendedor && mesAnterior == item.mes && year == item.year);
   
  if(filtroGanancias.length > 0) {
  const ganancias = filtroGanancias.map(item => item.ganancia).reduce((prev, curr) => prev + curr, 0);
      
  const f = new Date()
  f.setMonth(mesAnterior - 1);

  let txtMes = f.toLocaleDateString("es", {month: "short"})
  const mes = txtMes.charAt(0).toUpperCase() + txtMes.slice(1);
  const idVendedor = v.id_vendedor
  const datos_ganancias = {mes, year, ganancias, idVendedor}
      const result = await conexion.query("SELECT * FROM historial_ganancias_vendedores WHERE idVendedor = ?", [idVendedor]);
      if(result.length == 0) {
        await conexion.query("INSERT INTO historial_ganancias_vendedores SET ?", [datos_ganancias]);
      }
    }
  });
  // return "EJECUCIÓN FINALIZADA..!";
  res.send("Todo ok...")
}