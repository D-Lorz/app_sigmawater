const conexion = require("../database/db");
const bcryptjs = require('bcryptjs');
const { aceptarVendedorHTML, sendEmail } = require('../lib/correo')

//* Formateando precios a una moneda
const formatear = new Intl.NumberFormat('en-US', {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

// ? ========>>> ***********  ZONA DE VENDEDORES ************************  <<<========
// todo ===========>>>  Mostrar lista de VENDEDORES
exports.listarVendedores = async (req, res) => {
  const lista_vendedores = await conexion.query("SELECT * FROM registro_de_vendedores");
  const usuarios = await conexion.query("SELECT * FROM usuarios");

  lista_vendedores.forEach((v) => {
    v.estadoVendedor = {};
    v.estadoVendedor.txt = "Pendiente";
    v.estadoVendedor.color = "badge-soft-warning";
    if (usuarios.length > 0) {
      // Validando si la tabla de usuarios tiene registros
      usuarios.forEach((u) => {
        // Comparando tabla de usuarios con vendedores
        if (v.id_vendedor == u.id_vendedor) {
          if(u.foto){
            v.foto = u.foto
          }else{
            v.foto = "../directorio_dash/images/users/userDefault.gif"
          }
          if (u.estado_de_la_cuenta === "aprobado") { v.estadoVendedor.txt = "Aprobado"; v.estadoVendedor.color = "badge-soft-success"; }
          if (u.estado_de_la_cuenta === "bloqueado") { v.estadoVendedor.txt = "Bloqueado"; v.estadoVendedor.color = "badge-soft-danger"; }
        }
      });
    }
  });

  res.render("./1-admin/vendedores", {
    user: req.user,
    lista_vendedores
  });
};
// ! >>>>>>>>> Vista perfil vendedores <<<<<<<<<<<
exports.listarVendedores_PerfilVendedores = async (req, res) => {
  const id_vendedor = req.params.id;

  let info_vendedor = await conexion.query(
    "SELECT r.*, u.id as idC_cl, u.id_vendedor as idVendedor, u.foto FROM registro_de_vendedores r JOIN usuarios u ON u.id_vendedor = r.id_vendedor WHERE r.id_vendedor =  ? ",
    [id_vendedor]
  );
  info_vendedor = info_vendedor[0];

  let licencia;
  if (info_vendedor) {
    licencia = JSON.parse(info_vendedor.licencia_conduccion);
  }

  let fotoUpdate;
  if (info_vendedor) {
    if (info_vendedor.foto) {
      fotoUpdate = info_vendedor.foto;
    } else {
      fotoUpdate = "../directorio_dash/images/users/userDefault.gif";
    }
  }

  if (!info_vendedor) {
    res.clearCookie("jwt");
    return res.redirect("/login");
  }

  // Consultando en la base de datos vendedores con facturas pendientes.
  let facturaCliente = false;
  let fCl = await conexion.query(
    "SELECT nc.id, nc.codigo_id_vendedor, f.estadoFactura FROM nuevos_cliente nc JOIN factura f ON nc.id = f.id_cliente WHERE nc.codigo_id_vendedor = ?",
    [id_vendedor]
  );
  if (fCl.length > 0) {
    fCl = fCl[0];
    if (fCl.estadoFactura == 0) {
      facturaCliente = true;
    }
  }
  console.log("----------\nEXISTE FACTURA DE CLIENTE ==> ", facturaCliente);
  console.log("\n");
  // FIN FACTURAS PENDIENTES -------------------------------------
  //_________________________________________________________________________________________________________
  // todo===========>>>  Mostrar afiliados a tal vendedor
  let afiliados = await conexion.query(
    "SELECT * FROM usuarios WHERE codigo_afiliado = ?",
    [info_vendedor.id_vendedor]
  );
  let afiliadosRV = await conexion.query(
    "SELECT * FROM registro_de_vendedores WHERE codigo_afiliado = ?",
    [info_vendedor.id_vendedor]
  );

  afiliados.forEach((afl_u) => {
    afl_u.datos = {};
    if (afiliadosRV.length > 0) {
      afiliadosRV.forEach((afl_rv) => {
        if (afl_u.id_vendedor == afl_rv.id_vendedor) {
          if (afl_u.foto) {
            afl_u.foto = afl_u.foto;
          } else {
            afl_u.foto = "../directorio_dash/images/users/userDefault.gif";
          }
        }
      });
    }
  });

  // todo===========>>>  Mostrar afiliado a este vendedor
  let referente = await conexion.query(
    "SELECT r.*, u.foto FROM registro_de_vendedores r JOIN usuarios u ON r.id_vendedor = u.id_vendedor WHERE r.id_vendedor = ? LIMIT 1",
    [info_vendedor.codigo_afiliado]
  );
  referente = referente[0];

  let fotoUpdateR;
  if (referente) {
    if (referente.foto) {
      fotoUpdateR = referente.foto;
    } else {
      fotoUpdateR = "../directorio_dash/images/users/userDefault.gif";
    }
  }

  // todo===========>>>  Mostrar estado actual de un vendedor
  let viewsUser = await conexion.query(
    "SELECT * FROM usuarios WHERE id_vendedor = ? LIMIT 1",
    [info_vendedor.id_vendedor]
  );
  viewsUser = viewsUser[0];

  // todo ===============================>>> Estado del solicitar credito y estado de instalacion + cliente por vendedor
  let infoClientes = await conexion.query(
    "SELECT * FROM nuevos_cliente WHERE codigo_id_vendedor = ?",
    [id_vendedor]
  );
  let clCredito = await conexion.query("SELECT * FROM solicitar_credito");
  let clAgenda = await conexion.query("SELECT * FROM agendar_instalacion");
  // let cltestAgua = await conexion.query("SELECT * FROM test_agua");

  infoClientes.forEach((info) => {
    info.estadoCreditoCliente = {};
    info.estadoCreditoCliente.txt = "No solicitado";
    info.estadoCreditoCliente.color = "badge-soft-dark";

    info.estadoAgendar = {};
    info.estadoAgendar.txt = "No instalado";
    info.estadoAgendar.color = "badge-soft-dark";

    info.sistema = {};
    info.sistema.txt = "N/A";

    if (clCredito.length > 0) {
      clCredito.forEach((c) => {
        if (info.id == c.id_cliente) {
          if (c.estado_del_credito == 'En revisión') {
            info.estadoCreditoCliente.txt = "Pendiente";
            info.estadoCreditoCliente.color = "badge-soft-warning";
          }
          if (c.estado_del_credito == 'Aprobado') {
            info.estadoCreditoCliente.txt = "Aprobado";
            info.estadoCreditoCliente.color = "badge-soft-success";
          }
          if (c.estado_del_credito == 'Rechazado') {
            info.estadoCreditoCliente.txt = "Rechazado";
            info.estadoCreditoCliente.color = "badge-soft-danger";
          }
        }
      });
    }
    if (clCredito.length > 0) {
      clCredito.forEach((x) => {
        if (info.id == x.id_cliente) {
          if (x.sistema === "Reverse Osmosis System") {
            info.sistema.txt = "Reverse Osmosis System";
          }
          if (x.sistema === "Whole System") {
            info.sistema.txt = "Whole System";
          }
        }
      });
    }

    if (clAgenda.length > 0) {
      clAgenda.forEach((a) => {
        if (info.id == a.id_cliente) {
          if (a.estado_agenda == 0) {
            info.estadoAgendar.txt = "Listo para instalar";
            info.estadoAgendar.color = "badge-soft-warning";
          }
          if (a.estado_agenda == 1) {
            info.estadoAgendar.txt = "Instalado";
            info.estadoAgendar.color = "badge-soft-success";
          }
        }
      });
    }
  });

  // * >>> Renderizado <<<<<
  res.render("./1-admin/perfil-vendedores", {
    user: req.user,
    info_vendedor,
    fotoUpdate,
    afiliados,
    referente,
    fotoUpdateR,
    licencia,
    viewsUser,
    infoClientes,
    facturaCliente,
  });
};

// todo ===========>>>  Actualizar nivel de vendedores
exports.ActualizarNivel = async (req, res) => {
  const id_vendedor = req.body.id_vendedor;
  const nivel = req.body.nivel;
  let ventas_individuales = parseFloat(req.body.ventas_individuales)
  let total_ventas = parseFloat(req.body.total_ventas)
  let ventas_afiliados = parseFloat(req.body.ventas_afiliados)
  let codigo_afiliado

  if (nivel == 2) {
    ventas_individuales = ventas_individuales + (20.5 - total_ventas)
    total_ventas = ventas_individuales + ventas_afiliados
    codigo_afiliado = "N/A"
  } else if (nivel == 3) {
    ventas_individuales = ventas_individuales + (40.5 - total_ventas)
    total_ventas = ventas_individuales + ventas_afiliados
    codigo_afiliado = "N/A"
  } else if (nivel == 4) {
    ventas_individuales = ventas_individuales + (60.5 - total_ventas)
    total_ventas = ventas_individuales + ventas_afiliados
    codigo_afiliado = "N/A"
  }

  console.log("VENTAS INDIVIDUALES ACTUALIZADO ==>> (", ventas_individuales, ")");
  console.log("TOTAL VENTAS ACTUALIZADO ==>> (", total_ventas, ")");
  const datosNivel = { nivel, ventas_individuales, total_ventas, codigo_afiliado, id_vendedor };
  const datosNivel_usuarios = { codigo_afiliado };
  await conexion.query("UPDATE usuarios SET ? WHERE id_vendedor = ? ", [datosNivel_usuarios, id_vendedor])
  await conexion.query("UPDATE registro_de_vendedores SET ? WHERE id_vendedor = ? ", [datosNivel, id_vendedor], (err, result) => {
    if (err) res.send(false)
    res.send(true)
  });
};

const generateRandomString = (num) => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result1 = "";
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result1;
};

// todo ===========>>>  Actualizar estado de vendedores
exports.actualizarEstadoVendedor = async (req, res) => {

  const id_vendedor = req.body.idGenerado;
  const id_consecutivo = req.body.id_consecutivoVendedor;
  const estado_de_la_cuenta = req.body.estadoElegido;
  const clave = generateRandomString(8);
  pass = await bcryptjs.hash(clave, 12);
  const datosEstado_vendedor = { pass, estado_de_la_cuenta, id_consecutivo };

  let codigo_afiliado
  if(estado_de_la_cuenta == "bloqueado") {
    codigo_afiliado = " "
    dato_vacio = {codigo_afiliado}
    dato_vacioUsuario = {codigo_afiliado,estado_de_la_cuenta}
    await conexion.query("UPDATE registro_de_vendedores SET ? WHERE id_vendedor = ? ", [dato_vacio, id_vendedor])
    await conexion.query("UPDATE registro_de_vendedores SET ? WHERE codigo_afiliado = ? ", [dato_vacio, id_vendedor])
    await conexion.query("UPDATE usuarios SET ? WHERE id_vendedor = ? ", [dato_vacioUsuario, id_vendedor])
    await conexion.query("UPDATE usuarios SET ? WHERE codigo_afiliado = ? ", [dato_vacio, id_vendedor])

 }else{
  await conexion.query("UPDATE usuarios SET ? WHERE id_vendedor = ? ", [datosEstado_vendedor, id_vendedor])
    let datosUser = await conexion.query("SELECT * FROM usuarios u JOIN registro_de_vendedores rv ON rv.id_vendedor = u.id_vendedor WHERE estado_de_la_cuenta = 'aprobado' && u.id_vendedor = ?", [id_vendedor]);
    datosUser = datosUser[0]

  // ! ************* PROCESO DEL EMAIL PARA VENDEDOR ************
  const email =  datosUser.correo
  const asunto = "Bienvenido a 3C Sigma Water System"
  const plantilla = aceptarVendedorHTML(datosUser.nombres, clave)
  // Enviar email
  const resultEmail = await sendEmail(email, asunto, plantilla)
 
    if (!resultEmail) {
      res.json("Ocurrio un error inesperado al enviar el email al vendedor")
    } else {
        console.log("\n<<<<< Email - Enviado >>>>>\n")
    }
  // ! **************************************************************

  }
  res.send(true)
 }

// ? ========>>> ***********  ZONA DE VENDEDORES ****************************  <<<========

// ? ========>>> ***********  ZONA DE CLIENTES **************************** <<<========
// todo ===========>>>  Mostrar lista de CLIENTES y referencia de su vendedor
exports.listarClientes = async (req, res) => {
  let lista_clientes = await conexion.query(
    "SELECT N.*, S.sistema,S.estado_del_credito, A.estado_agenda, N.fecha_test FROM nuevos_cliente N LEFT JOIN solicitar_credito S ON N.id = S.id_cliente LEFT JOIN agendar_instalacion A ON N.id = A.id_cliente;");

    lista_clientes.forEach((c) => {
    /** Estado del Crédito */
    c.estadoCredito = {};
    c.estadoCredito.txt = "No solicitado";
    c.estadoCredito.color = "badge-soft-dark";

    if (c.estado_del_credito == 'En revisión') { c.estadoCredito.txt = "En revisión"; c.estadoCredito.color = "badge-soft-warning"; }
    if (c.estado_del_credito == 'Aprobado') { c.estadoCredito.txt = "Aprobado"; c.estadoCredito.color = "badge-soft-success"; }
    if (c.estado_del_credito == 'Rechazado') { c.estadoCredito.txt = "Rechazado"; c.estadoCredito.color = "badge-soft-danger"; }
    if (c.estado_del_credito == 'Pagado(cash)') { c.estadoCredito.txt = "Pagado(cash)"; c.estadoCredito.color = "badge-soft-info";}
    /** Estado de la instalación */
    c.estadoAgenda = {};
    c.estadoAgenda.txt = "No instalado";
    c.estadoAgenda.color = "badge-soft-dark";

    if (c.estado_agenda == 0) {c.estadoAgenda.txt = "Listo para instalar"; c.estadoAgenda.color = "badge-soft-warning"; }
    if (c.estado_agenda == 1) { c.estadoAgenda.txt = "Instalado"; c.estadoAgenda.color = "badge-soft-success"; }
  });

  // * >>> Renderizado <<<<<
  res.render("./1-admin/listar-clientes", { user: req.user, lista_clientes });
};

// ! >>>> Tarjetas en la vista perfil clientes <<<<<<<<<<<
exports.listarClientes_PerfilClientes = async (req, res) => {
  const id_cliente = req.params.id;
  let info_clientes = await conexion.query("SELECT * FROM nuevos_cliente WHERE id_cliente = ?", [id_cliente]);
  info_clientes = info_clientes[0];

  if(!info_clientes){
    res.clearCookie('jwt')
    return res.redirect('/login')
  }

  // todo ===============================>>> Estado del solicitar credito
  let credito = await conexion.query('SELECT * FROM solicitar_credito WHERE id_cliente = ? LIMIT 1', [info_clientes.id])
  let estado = []
  estado.txt = "No solicitado";
  estado.color = 'badge-soft-dark'

  if (credito.length > 0) {
    credito = credito[0]
    if (credito.estado_del_credito === 'En revisión') {estado.txt = "En revisión";estado.color = 'badge-soft-warning' }
     else if (credito.estado_del_credito == 'Aprobado') {estado.txt = "Aprobado"; estado.color = 'badge-soft-success'}
      else if (credito.estado_del_credito == 'Rechazado') { estado.txt = "Rechazado"; estado.color = 'badge-soft-danger' }
       else if (credito.estado_del_credito == 'Pagado(cash)') {estado.txt = "Pagado(cash)"; estado.color = 'badge-soft-info'}
  }

  // todo =========================>> Mostrar información del test de agua del cliente
  let informacionTestAgua = await conexion.query('SELECT * FROM test_agua WHERE id_cliente = ?  ', [info_clientes.id])

  // * >>> Estados del testeo (visita al cliente)
  let consultaEstado_testAgua = await conexion.query('SELECT * FROM test_agua WHERE id_cliente = ?  ORDER BY id DESC LIMIT 1', [info_clientes.id])
  let estadoVisita_testAgua = []
  estadoVisita_testAgua.txt = "A la fecha el cliente aun no ha sido visitado";
  estadoVisita_testAgua.color = '';

  estadoVisita_testAgua.background = 'noVisitado';
  if (consultaEstado_testAgua.length > 0) {consultaEstado_testAgua = consultaEstado_testAgua[0]
    if (consultaEstado_testAgua.estado_visita_test === '0') { estadoVisita_testAgua.txt = "Se realizó un test de agua el";
      estadoVisita_testAgua.background = 'visitado'; }
  }

// todo =========================>> Consulta del PRIMER test de agua para la fecha y grafica
  let consulta_PrimerTestAgua = await conexion.query('SELECT * FROM test_agua WHERE id_cliente = ? ORDER BY id DESC LIMIT 1, 1', [info_clientes.id])
      if (consulta_PrimerTestAgua.length > 0) { consulta_PrimerTestAgua = consulta_PrimerTestAgua[0]}
          const datosJson_PrimerTestagua = JSON.stringify(consulta_PrimerTestAgua);

// todo =========================>> Consulta del ULTIMO test de agua para la fecha y grafica
  let consulta_UltimoTestAgua = await conexion.query('SELECT * FROM test_agua WHERE id_cliente = ? ORDER BY id DESC LIMIT 1; ', [info_clientes.id])
      if (consulta_UltimoTestAgua.length > 0) { consulta_UltimoTestAgua = consulta_UltimoTestAgua[0] }
           const datosJson_UltimoTestagua = JSON.stringify(consulta_UltimoTestAgua);

// todo =========================>> Mostrar información del ahorro del cliente
  let ahorroCalculado = await conexion.query('SELECT * FROM ahorro WHERE id_cliente = ? ORDER BY id DESC LIMIT 1', [info_clientes.id])
      if (ahorroCalculado.length > 0) { ahorroCalculado = ahorroCalculado[0] }
          const datosJson_ahorroCalculado = JSON.stringify(ahorroCalculado);

// todo =========================>> Estados de la agenda para instalar el producto
  let consultaEstado_instalacion = await conexion.query('SELECT * FROM agendar_instalacion WHERE id_cliente = ? LIMIT 1 ', [info_clientes.id])
  let estado_intalacion = []
  estado_intalacion.txt = "La instalación del producto no ha sido agendada";
  estado_intalacion.background = 'noVisitado';

  if (consultaEstado_instalacion.length > 0) { consultaEstado_instalacion = consultaEstado_instalacion[0]
    if (consultaEstado_instalacion.estado_agenda === '0') { estado_intalacion.txt = "Listo para instalar";
         estado_intalacion.background = 'producto_instalado';}
       else if (consultaEstado_instalacion.estado_agenda == 1) { estado_intalacion.txt = "Instalado";
           estado_intalacion.background = 'visitado';}
  }
// todo ===============================>>> Mostrar evidencia de la instalacion
  let clRegistro_instalacion = await conexion.query('SELECT * FROM servicios_de_instalacion WHERE id_cliente = ? LIMIT 1', [info_clientes.id])
  let evidenciaF
  if (clRegistro_instalacion.length > 0) {
        clRegistro_instalacion = clRegistro_instalacion[0]
        evidenciaF = clRegistro_instalacion.evidencia_fotografica
    }
  // todo ===============================>>> Desactivar boton de registro de instalacion ubicado en Perfil-cliente
  let clInstalacion = await conexion.query('SELECT * FROM agendar_instalacion WHERE id_cliente = ? LIMIT 1', [info_clientes.id])
    let estadu = []
    estadu.txt = "No hecho";
    estadu.color = 'badge-soft-dark'
    estadu.verbtnI = false;

  if (clInstalacion.length > 0) { clInstalacion = clInstalacion[0]
     if (clInstalacion.estado_agenda == 0) { estadu.verbtnI = true; }
       else if (clInstalacion.estado_agenda == 1) { estadu.verbtnI = false;}
  }

// todo ===============================>>> Mostrar agenda sobre la instalacion del producto
  let mostrarAgenda = await conexion.query("SELECT * FROM agendar_instalacion WHERE id_cliente = ?", [info_clientes.id]);
  mostrarAgenda = mostrarAgenda[0]

  let mostrarDatoscreditos = await conexion.query("SELECT * FROM solicitar_credito WHERE id_cliente = ?", [info_clientes.id]);
  mostrarDatoscreditos = mostrarDatoscreditos[0]
  if (mostrarDatoscreditos) {
    mostrarDatoscreditos.monto_financiar_cliente = formatear.format(mostrarDatoscreditos.monto_financiar_cliente)
  }

  console.log("\n");
  let licenciacredito
  if (mostrarDatoscreditos ) {
   licenciacredito = JSON.parse(mostrarDatoscreditos.licencia_cliente);
        console.log("IMPRIMIENDO VARIABLE NUEVA ===>>>", licenciacredito);
  }else {

  }
  console.log("IMPRIMIENDO VARIABLE ===>>>", licenciacredito);
  console.log("\n");

  let clbotonCredito = await conexion.query('SELECT * FROM solicitar_credito WHERE id_cliente = ? LIMIT 1', [info_clientes.id])
  let estade = []
  estade.txt = "No hecho";
  estade.color = 'badge-soft-dark'
  estade.btncredito = false;

  if (clbotonCredito.length > 0) {
     clbotonCredito = clbotonCredito[0]
     if (clbotonCredito.estado_del_credito == 'En revisión') { estade.txt = "si hecho"; estade.btncredito = true; }
     else if (clbotonCredito.estado_del_credito == 'Aprobado') { estade.btncredito = false;}
     else if (clbotonCredito.estado_del_credito == 'Rechazado') { estade.btncredito = false;}
     else if (clbotonCredito.estado_del_credito == 'Pagado(cash)') { estade.btncredito = false;}

  }

  // todo ========>>> Mostrar producto
  let mostrarProducto = await conexion.query('SELECT * FROM solicitar_credito WHERE id_cliente = ? LIMIT 1', [info_clientes.id])
  mostrarProducto = mostrarProducto[0]

  // * >>> Renderizado <<<<<
  res.render("./1-admin/perfil-cliente", {
    user: req.user, estado,
    info_clientes, informacionTestAgua, estadoVisita_testAgua,
    consulta_PrimerTestAgua, datosJson_PrimerTestagua,
    consulta_UltimoTestAgua, datosJson_UltimoTestagua,
    ahorroCalculado, datosJson_ahorroCalculado, estado_intalacion,
    estadu, mostrarAgenda, mostrarDatoscreditos, estade,
    licenciacredito, clRegistro_instalacion, evidenciaF, mostrarProducto
  });
};

// todo =======>>> Actualizar Estado del credito desde el panel de administrador - perfil-cliente
exports.ActualizarCredito = async (req, res) => {
  const id_cliente = req.body.id_cliente;
  const estado_del_credito = req.body.estado_del_credito;
  const datosEstadoCredito = { estado_del_credito, id_cliente };
  await conexion.query("UPDATE solicitar_credito SET ? WHERE id_cliente = ? ", [datosEstadoCredito, id_cliente], (err, result) => {
    if (err) { res.send(false) }
    res.send(true)
  });
};

// todo =======>>> Actualizar monto aprobado desde el panel de administrador - perfil-cliente
exports.ActualizarMontoAprobado = async (req, res) => {
  const id_cliente = req.body.id_cliente;
  const monto_aprobado = req.body.monto_aprobado.replace(/[$ ,]/g, '');
  const datosUpdateMontoAprobado = { monto_aprobado, id_cliente };
  await conexion.query("UPDATE solicitar_credito SET ? WHERE id_cliente = ? ", [datosUpdateMontoAprobado, id_cliente], (err, result) => {
    if (err) res.send(false)
    res.send(true)
  });
};

// todo =======>>> Actualizar información del cliente - perfil-cliente
exports.ActualizarInfoCl = async (req, res) => {
  const id_cliente = req.body.id_cliente;
  const correo = req.body.correo;
  const telefono = req.body.telefono;
  const nombre = req.body.nombre;
  const segundo_nombre = req.body.segundo_nombre;
  const apellido = req.body.apellido;
  const direccion = req.body.direccion;
  const ciudad = req.body.ciudad;
  const estado_ubicacion = req.body.estado_ubicacion;
  const codigo_postal = req.body.codigo_postal;
  const direccion2 = req.body.direccion2;

  const datosUpdateinfoCL= { correo,telefono, nombre, segundo_nombre,apellido, direccion,ciudad,
                            estado_ubicacion,codigo_postal,direccion2, id_cliente };
  await conexion.query("UPDATE nuevos_cliente SET ? WHERE id_cliente = ? ", [datosUpdateinfoCL, id_cliente], (err, result) => {
    if (err) res.send(false)
    res.send(true)
  });
};

//todo =======>>> Adjuntar firma en el documento del contrato - form credito interno
exports.clfirmas = async (req, res) => {
  const id_cliente = req.params.id;
  let info_clientes2 = await conexion.query("SELECT * FROM nuevos_cliente  WHERE id_cliente = ?",[id_cliente]);
  info_clientes2 = info_clientes2[0];

  let clfirmasAcuerdo = await conexion.query('SELECT * FROM solicitar_credito WHERE id_cliente = ? LIMIT 1', [info_clientes2.id])
  let estade = []
  estade.txt = "No hecho";
  estade.color = 'badge-soft-dark'
  estade.btncredito = false;
  if (clfirmasAcuerdo.length > 0) {
      clfirmasAcuerdo = clfirmasAcuerdo[0]
        var firmas  = clfirmasAcuerdo.acuerdo_firmado
    }
  // * >>> Renderizado <<<<<
  res.render("./1-admin/acuerdo", { user: req.user,info_clientes2, firmas  });
}

// todo --> Formulario servicio instalado y registro de ventas
exports.servicioInstaladosx = async (req, res) => {
  const fecha_instalacion = req.body.fechaDeInstalacion;
  const generacion_factura = new Date().toLocaleString('en-US');
  const producto_instalado = req.body.productoinstaladO;
  const serial_producto1 = req.body.serial_producto1;
  const serial_producto2 = req.body.serial_producto2;
  const instalador = req.body.instalador;
  const evidencia_fotografica = "../evidenciaServicio/" + urlEvidencia
  const nota = req.body.nota;
  const id_cliente = req.body.id_cliente
  const codigo_cliente = req.body.codigo_cliente
  const estado_agenda = 1
  const Datos_servicio = { fecha_instalacion,generacion_factura, producto_instalado, serial_producto1,serial_producto2, instalador, evidencia_fotografica, nota, id_cliente }
  const Datos_estado = { estado_agenda }

  const Datos_factura = { producto_instalado, fecha_instalacion,generacion_factura, id_cliente }

  await conexion.query('UPDATE agendar_instalacion SET ? WHERE id_cliente = ?', [Datos_estado, id_cliente])
  await conexion.query('INSERT INTO factura SET ?', [Datos_factura])
  await conexion.query('INSERT INTO servicios_de_instalacion SET ?', [Datos_servicio], async (err, result) => {
    if (err) throw err;
    if (result) { res.redirect('/perfil-cliente/' + codigo_cliente) }

  })
}

// ? ========>>> ***********  ZONA DE CLIENTES **************************** <<<========
//todo ******************************** --INICIO-- FACTURAS DE VENTAS + DISPERSIONES DE COMISIONES & GANANCIAS DE LA EMPRESA *************************** */
let ventasTotales;
exports.factura = async (req, res) => {

  const clientes = await conexion.query("SELECT cl.*, cr.id_cliente AS idCliente, cr.monto_aprobado, cr.porcentaje_aprobado, cr.monto_maximo, cr.sistema FROM nuevos_cliente AS cl JOIN solicitar_credito AS cr ON cl.id = cr.id_cliente")
  const vendedores = await conexion.query("SELECT id, nombres, apellidos, codigo_afiliado, id_vendedor, nivel, telefono_movil FROM registro_de_vendedores")
  const factura = await conexion.query("SELECT * FROM factura")

  let gananciasE = 0 // ==>> Ganancias empresa

  const arrayVentas = []
  let sumaValor = 0, comisionesPagadas = 0;
  clientes.forEach(cl => {

    cl.monto_aprobado = parseFloat(cl.monto_aprobado)
    cl.porcentaje_aprobado = parseFloat(cl.porcentaje_aprobado)
    cl.monto_maximo = parseFloat(cl.monto_maximo)
    cl.factura = {}
    cl.vendedores = []

    // Comisiones máximas para el producto grande ($8.500 USD)
    let comisionMax_nivel1 = 1400.0, comisionMax_nivel2 = 1900.0, comisionMax_nivel3 = 2400.0, gastos_empresa = 3000.0

    // Comisiones máximas para el producto pequeño ($4.250 USD)
    if (cl.sistema == "Reverse Osmosis System") {
      comisionMax_nivel1 = 700.0
      comisionMax_nivel2 = 950.0
      comisionMax_nivel3 = 1200.0
      gastos_empresa = 1500.0
    }

    let v = vendedores.find(item => item.id == cl.id_vendedor)
    const vendedor = {}, vendedor2 = {}, vendedor3 = {}, vendedor4 = {};
    let v2 = false, v3 = false, v4 = false;
    
    if (v) {
      vendedor.id = v.id
      vendedor.codigo = v.id_vendedor
      vendedor.nombre = v.nombres + " " + v.apellidos
      vendedor.nivel = parseInt(v.nivel)
      vendedor.afiliado = v.codigo_afiliado
      vendedor.telefono = v.telefono_movil
      vendedor.deducciones = []

      // ---------------------------------------------- INICIO ** SECCIÓN DEDUCCIONES ----------------------------------------------
      /******* DEDUCCIONES VENDEDOR 1  *******/
      const ded = factura.find(i => i.id_cliente == cl.id)
      if (ded) {vendedor.deducciones = JSON.parse(ded.deducciones)}
      console.log("DEDUCCIONES v1: " + JSON.stringify(vendedor.deducciones))
      /** FIN DEDUCCIONES 1 **/

      v.codigo_afiliado != '' ? v2 = vendedores.find(item => item.id_vendedor == v.codigo_afiliado) : v2;

      // VALIDAR SI TIENE UN VENDEDOR 2
      if (v2) {
        vendedor2.id = v2.id
        vendedor2.codigo = v2.id_vendedor
        vendedor2.nombre = v2.nombres + " " + v2.apellidos
        vendedor2.nivel = parseInt(v2.nivel)
        vendedor2.afiliado = v2.codigo_afiliado
        vendedor2.telefono = v2.telefono_movil
        vendedor2.deducciones = []

        /******* DEDUCCIONES VENDEDOR 2 *******/
        const ded = factura.find(i => i.factura_cliente == cl.id)
        if (ded) { vendedor2.deducciones = JSON.parse(ded.deducciones) }
        console.log("DEDUCCIONES v2: " + JSON.stringify(vendedor2.deducciones))
        /** FIN DEDUCCIONES 2 **/

        v2.codigo_afiliado != '' ? v3 = vendedores.find(item => item.id_vendedor == v2.codigo_afiliado) : v3;
      }

      // VALIDAR SI TIENE UN VENDEDOR 3
      if (v3) {
        vendedor3.id = v3.id
        vendedor3.codigo = v3.id_vendedor
        vendedor3.nombre = v3.nombres + " " + v3.apellidos
        vendedor3.nivel = parseInt(v3.nivel)
        vendedor3.afiliado = v3.codigo_afiliado
        vendedor3.telefono = v3.telefono_movil
        vendedor3.deducciones = []

        /******* DEDUCCIONES VENDEDOR 3 *******/
        const ded = factura.find(i => i.factura_cliente == cl.id)
        if (ded) { vendedor3.deducciones = JSON.parse(ded.deducciones) }
        console.log("DEDUCCIONES v3: " + JSON.stringify(vendedor3.deducciones))
        /** FIN DEDUCCIONES 2 **/

        v3.codigo_afiliado != '' ? v4 = vendedores.find(item => item.id_vendedor == v3.codigo_afiliado) : v4;
      }

      // VALIDAR SI TIENE UN VENDEDOR 4
      if (v4) {
        vendedor4.id = v4.id
        vendedor4.codigo = v4.id_vendedor
        vendedor4.nombre = v4.nombres + " " + v4.apellidos
        vendedor4.nivel = parseInt(v4.nivel)
        vendedor4.afiliado = v4.codigo_afiliado
        vendedor4.telefono = v4.telefono_movil
        vendedor4.deducciones = []

        /******* DEDUCCIONES VENDEDOR 4 *******/
        const ded = factura.find(i => i.factura_cliente == cl.id)
        if (ded) { vendedor4.deducciones = JSON.parse(ded.deducciones) }
        console.log("DEDUCCIONES v4: " + JSON.stringify(vendedor4.deducciones))
        /** FIN DEDUCCIONES 2 **/
      }
      // ---------------------------------------------- FIN ** SECCIÓN DEDUCCIONES ----------------------------------------------

      /********  Comisión Directa al Vendedor cuando el porcentaje aprobado es mayor al 80% ********/
      if (cl.porcentaje_aprobado >= 80) {

        switch (vendedor.nivel) {
          //VENDEDOR PRINCIPAL NIVEL 1
          case 1:
            vendedor.comision_base = comisionMax_nivel1;
            vendedor.comision_final = vendedor.comision_base;

            cl.vendedores.push(vendedor)
            //COMISIÓN VENDEDOR 2 (NIVEL 2, 3 o 4)
            if (v2) {
              if (vendedor2.nivel == 2) {
                vendedor2.comision_base = (comisionMax_nivel2 - comisionMax_nivel1)
                vendedor2.comision_final = vendedor2.comision_base;
              } else if (vendedor2.nivel == 3) {
                vendedor2.comision_base = (comisionMax_nivel3 - comisionMax_nivel1)
                vendedor2.comision_final = vendedor2.comision_base;
              } else {
                vendedor2.comision_base = (cl.monto_aprobado - gastos_empresa - comisionMax_nivel1);
                vendedor2.comision_final = vendedor2.comision_base/2;
              }
              cl.vendedores.push(vendedor2)
            }

            //COMISIÓN VENDEDOR 3 (NIVEL 3 o 4)
            if (v3) {
              if (v3.nivel == 3) {
                vendedor3.comision_base = (comisionMax_nivel3 - vendedor2.comision_base - vendedor.comision_base);
                vendedor3.comision_final = vendedor3.comision_base;
              } else {
                vendedor3.comision_base = (cl.monto_aprobado - gastos_empresa - vendedor2.comision_base - vendedor.comision_base);
                vendedor3.comision_final = vendedor3.comision_base/2;
              }

              cl.vendedores.push(vendedor3)
            }

            //COMISIÓN VENDEDOR 4 (NIVEL 4)
            if (v4) {
              // Asignando comisión base vendedor nivel 4 -> (Comisión máxima del vendedor nivel 4 menos las comisiones niveles anteriores)
              vendedor4.comision_base = (cl.monto_aprobado - gastos_empresa - vendedor3.comision_base - vendedor2.comision_base - vendedor.comision_base);
              vendedor4.comision_final = vendedor4.comision_base/2;
              cl.vendedores.push(vendedor4)
            }

            break;

          //VENDEDOR PRINCIPAL NIVEL 2
          case 2:
            vendedor.comision_base = comisionMax_nivel2;
            vendedor.comision_final = vendedor.comision_base;
            cl.vendedores.push(vendedor)

            //COMISIÓN VENDEDOR 2 (NIVEL 3 o 4)
            if (v2) {
              if (v2.nivel == 3) {
                vendedor2.comision_base = (comisionMax_nivel3 - comisionMax_nivel2)
                vendedor2.comision_final = vendedor2.comision_base;
              } else {
                vendedor2.comision_base = (cl.monto_aprobado - gastos_empresa - comisionMax_nivel3 - comisionMax_nivel2)
                vendedor2.comision_final = vendedor2.comision_base/2;
              }
              cl.vendedores.push(vendedor2)
            }

            //COMISIÓN VENDEDOR 3 (NIVEL 4)
            if (v3) {
              vendedor3.comision_base = (cl.monto_aprobado - gastos_empresa - vendedor2.comision_base - vendedor.comision_base);
              vendedor3.comision_final = vendedor3.comision_base/2;
              cl.vendedores.push(vendedor3)
            }

            break;

          //VENDEDOR PRINCIPAL NIVEL 3
          case 3:
            vendedor.comision_base = comisionMax_nivel3;
            vendedor.comision_final = vendedor.comision_base;
            cl.vendedores.push(vendedor)

            //COMISIÓN VENDEDOR 2 (NIVEL 4)
            if (v2) {
              vendedor2.comision_base = (cl.monto_aprobado - gastos_empresa - comisionMax_nivel3 - comisionMax_nivel2 - comisionMax_nivel1)
              vendedor2.comision_final = vendedor2.comision_base/2;
              cl.vendedores.push(vendedor2)
            }

            break;

          //VENDEDOR PRINCIPAL NIVEL 4
          default:
            vendedor.comision_base = (cl.monto_aprobado - gastos_empresa);
            vendedor.comision_final = vendedor.comision_base/2;
            cl.vendedores.push(vendedor)
            break;
        }

      }
      // /******** Comisión Directa al Vendedor cuando el porcentaje aprobado es MENOR al 80% ------------------------------ ---********/
      else {
        //Convirtiendo porcentaje entero a decimal
        const porcentaje = parseFloat(cl.porcentaje_aprobado/100)

        switch (vendedor.nivel) {
          //VENDEDOR PRINCIPAL NIVEL 1
          case 1:
            vendedor.comision_base = parseFloat(porcentaje * comisionMax_nivel1)
            vendedor.comision_final = vendedor.comision_base;
            cl.vendedores.push(vendedor)

            //COMISIÓN VENDEDOR 2 (NIVEL 2, 3 o 4)
            if (v2) {
              if (v2.nivel == 2) {
                vendedor2.comision_base = (parseFloat(porcentaje * comisionMax_nivel2) - vendedor.comision_base)
                vendedor2.comision_final = vendedor2.comision_base;
              } else if (v2.nivel == 3) {
                vendedor2.comision_base = (parseFloat(porcentaje * comisionMax_nivel3) - vendedor.comision_base)
                vendedor2.comision_final = vendedor2.comision_base;
              } else {
                vendedor2.comision_base = (cl.monto_aprobado - gastos_empresa - vendedor.comision_base);
                vendedor2.comision_final = vendedor2.comision_base/2;
              }

              cl.vendedores.push(vendedor2)
            }

            //COMISIÓN VENDEDOR 3 (NIVEL 3 o 4)
            if (v3) {
              if (v3.nivel == 3) {
                vendedor3.comision_base = (parseFloat(porcentaje * comisionMax_nivel3) - vendedor2.comision_base - vendedor.comision_base)
                vendedor3.comision_final = vendedor3.comision_base;
              } else {
                vendedor3.comision_base = (cl.monto_aprobado - gastos_empresa - vendedor2.comision_base - vendedor.comision_base);
                vendedor3.comision_final = vendedor3.comision_base/2;
              }

              cl.vendedores.push(vendedor3)
            }

            //COMISIÓN VENDEDOR 4 (NIVEL 4)
            if (v4) {
              vendedor4.comision_base = (cl.monto_aprobado - gastos_empresa - vendedor3.comision_base - vendedor2.comision_base - vendedor.comision_base);
              vendedor4.comision_final = vendedor4.comision_base/2;
              cl.vendedores.push(vendedor4)
            }

            break;

          //VENDEDOR PRINCIPAL NIVEL 2
          case 2:
            vendedor.comision_base = parseFloat(porcentaje * comisionMax_nivel2)
            vendedor.comision_final = vendedor.comision_base;
            cl.vendedores.push(vendedor)

            //COMISIÓN VENDEDOR 2 (NIVEL 3 o 4)
            if (v2) {
              if (v2.nivel == 3) {
                vendedor2.comision_base = (parseFloat(porcentaje * comisionMax_nivel3) - vendedor.comision_base)
                vendedor2.comision_final = vendedor2.comision_base;
              } else {
                vendedor2.comision_base = (cl.monto_aprobado - gastos_empresa - vendedor.comision_base);
                vendedor2.comision_final = vendedor2.comision_base/2;
              }
              cl.vendedores.push(vendedor2)
            }

            //COMISIÓN VENDEDOR 3 (NIVEL 4)
            if (v3) {
              vendedor3.comision_base = (cl.monto_aprobado - gastos_empresa - vendedor2.comision_base - vendedor.comision_base);
              vendedor3.comision_final = vendedor3.comision_base/2;
              cl.vendedores.push(vendedor3)
            }

            break;

          //VENDEDOR PRINCIPAL NIVEL 3
          case 3:
            vendedor.comision_base = parseFloat(porcentaje * comisionMax_nivel3)
            vendedor.comision_final = vendedor.comision_base;
            cl.vendedores.push(vendedor)

            //COMISIÓN VENDEDOR 2 (NIVEL 4)
            if (v2) {
              vendedor2.comision_base = (cl.monto_aprobado - gastos_empresa - vendedor.comision_base);
              vendedor2.comision_final = vendedor2.comision_base/2;
              cl.vendedores.push(vendedor2)
            }

            break;

          //VENDEDOR PRINCIPAL NIVEL 4
          default:
            vendedor.comision_base = (cl.monto_aprobado - gastos_empresa);
            vendedor.comision_final = vendedor.comision_base/2;
            cl.vendedores.push(vendedor)
            break;
        }

      }

    } else {
      console.log("\n <<<<<<<<<<<<<<<< No hay coincidencias de vendedor >>>>>>>>>>>>>>>>>>>\n")
    }

    //Sumar comisiónes base de todos los vendedores
    cl.comision_total = cl.vendedores.map(item => item.comision_base).reduce((prev, curr) => prev + curr, 0);
    cl.comision_total = parseFloat(cl.comision_total).toFixed(1)
    
    /******* ASIGNANDO FACTURA AL CLIENTE *******/
    if (factura.length > 0) {
      factura.forEach(f => {
        if (f.id_cliente == cl.id) {
          cl.factura.id = f.id_factura
          cl.factura.fecha  = f.fecha_instalacion

          // SUMANDO TODOS LOS VALORES DEL MONTO APROBADO x CLIENTE
          sumaValor += parseFloat(cl.monto_aprobado)

          if (f.estadoFactura == 0) {
            cl.factura.estadoTxt = "Pendiente";
            cl.factura.estadoColor = "badge-soft-warning";
          }
          if (f.estadoFactura == 1) {
            cl.factura.estadoTxt = "Pagada";
            cl.factura.estadoColor = "badge-soft-success";
            cl.comision_total = parseFloat(f.comision_total).toFixed(1);
            /** DATOS COMISIONES SIDEBAR DESPLEGADO */
            const vendedoresFactura = JSON.parse(f.vendedores)

            if(vendedoresFactura.length > 0) {
              cl.vendedores = []
              vendedoresFactura.forEach((x) => {
                cl.vendedores.push(x);
              });
            }
            /** COSTOS ADICIONALES + GANANCIAS DE LA EMPRESA */
            cl.ganancias = JSON.parse(f.ganancias_empresa)
            cl.costos_adicionales = JSON.parse(f.costos_adicionales)
            gananciasE += parseFloat(cl.ganancias.total)
            comisionesPagadas += parseFloat(cl.comision_total)
          }
        }
      });
    }
    /** FIN DATOS DE LA FACTURA **/
    arrayVentas.push(cl)
  });

   // ==> CONSULTA PARA SACARLA INFORMACION DE VENDEDORES  
   let info_vendedores = await conexion.query("SELECT * FROM registro_de_vendedores ");

   // ==> SUMANDO EL NUMERO TOTAL DE VENTAS EN GENERAL
   let sumaTotalVentas = 0;
   info_vendedores.forEach(iv => {
     sumaTotalVentas += parseFloat(iv.ventas_individuales)
   })

  ventasTotales = arrayVentas;

  res.render("./1-admin/ventas", { user: req.user, arrayVentas, sumaTotalVentas, sumaValor, gananciasE,comisionesPagadas });
}
//todo ******************************** --FIN-- FACTURAS DE VENTAS + DISPERSIONES DE COMISIONES ******************************** */

//todo ************* -- INICIO DEDUCCIONES ************* */
exports.deducciones = async (req, res) => {
  const {idFactura} = req.body;
  let f = ventasTotales.find(item => item.factura.id == idFactura)
  console.log("\n<<<<< RESULTADO FACTURA SELECCIONADA >>>> ", JSON.stringify(f)+"\n")
  if (f){
    res.send(f);
  } else {
    res.send(false)
  }
}
//todo ************* -- FIN  DEDUCCIONES ************* */


//todo ************* -- INICIO GUARDAR COMISIONES + DEDUCCIONES EN DB ************* */
exports.efectuarVenta = async (req, res) => {
  const {factura, dataVendedores, costos_adicionales, ganancias_empresa, idCliente, producto_instalado} = req.body;

  let comision_total = 0, deducciones = [];
  const vendedores = await conexion.query("SELECT * FROM registro_de_vendedores")

  dataVendedores.forEach(async dv => {
    dv.comision_base = parseFloat(dv.comision_base)
    dv.comision_final = parseFloat(dv.comision_final)
    comision_total += dv.comision_final;

    dv.deducciones == null || dv.deducciones.length == 0 ? dv.deducciones == null : deducciones.push(dv.deducciones);
    const ve = vendedores.find(i => i.id_vendedor == dv.codigo)

    if (ve) {
      const ganancias = parseFloat(ve.ganancias)+dv.comision_final
      const actualizarGanancia = {ganancias}
      await conexion.query("UPDATE registro_de_vendedores SET ? WHERE id_vendedor = ?", [actualizarGanancia, dv.codigo])

  // * ==>> Insertar ganancias con su fecha a la tabla ganancias
      const year = new Date().getFullYear();
      let mes = new Date().getMonth();
      mes == 0 ? (mes = 12) : (mes = mes + 1);
      const ganancia = ganancias
      const idVendedor = dv.codigo

      const insertarGanancia = {mes, year, ganancia, idVendedor}
      await conexion.query("INSERT INTO ganancias SET ?", [insertarGanancia])
    }
  });

  deducciones.length > 0 ? deducciones = JSON.stringify(deducciones) : deducciones = null

  const currentdate = new Date();
  const oneJan = new Date(currentdate.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
  const semana = Math.ceil((currentdate.getDay() + numberOfDays) / 7) - 1;
  const datos = {
    mes: new Date().getMonth()+1,
    semana,
    dia: new Date().getDate(),
    year: new Date().getFullYear(),
    vendedores: JSON.stringify(dataVendedores),
    comision_total: comision_total.toFixed(1),
    deducciones,
    costos_adicionales: JSON.stringify(costos_adicionales),
    ganancias_empresa: JSON.stringify(ganancias_empresa),
    estadoFactura: 1
  }

  let respuesta = undefined;
  const actualizarFactura = await conexion.query("UPDATE factura SET ? WHERE id_factura = ?", [datos, factura])
  actualizarFactura ? respuesta = true : respuesta = false;
  //* ************************

  //* ******* CONSULTAS PARA LA CADENA
    const clientes = await conexion.query("SELECT cl.*, cr.id_cliente AS idCliente, cr.sistema FROM nuevos_cliente AS cl JOIN solicitar_credito AS cr ON cl.id = cr.id_cliente;")
    const seller = await conexion.query("SELECT id, nombres, apellidos, codigo_afiliado, id_vendedor, nivel, telefono_movil, total_ventas, ventas_individuales, ventas_afiliados FROM registro_de_vendedores")
  //* ************************

  //* ==>> Apartado para sumar ventas individuales <<==
  let cl = clientes.find(item => item.id == idCliente)
  let nuevaVenta = 0;

  if (cl) {
    const v1 = seller.find(item => item.id_vendedor == cl.codigo_id_vendedor)

    if (v1) {
      producto_instalado == "Whole System" ? nuevaVenta = 1 : nuevaVenta  = 0.5;
      const ventas_individuales = (parseFloat(v1.ventas_individuales) + nuevaVenta)
      const ventas_afiliados = v1.ventas_afiliados
      const total_ventasV1 = ventas_individuales + ventas_afiliados

      // VALIDANDO SI NECESITA SUBIR DE NIVEL EL VENDEDOR PRINCIPAL
      const nivel = _subirNivelVendedor(total_ventasV1)

      // OBJETO PARA ENVIAR A LA BASE DE DATOS
      const vendedorPrincipal = {nivel, ventas_individuales, ventas_afiliados, total_ventas: total_ventasV1}
      console.log("---------\nDATOS DE VENDEDOR PRINCIPAL", vendedorPrincipal);

      // Actualizando numero de ventas del vendedor que la hizo (Indivuales, afiliados, totales)
      await conexion.query("UPDATE registro_de_vendedores SET ? WHERE id_vendedor = ?", [vendedorPrincipal, cl.codigo_id_vendedor])

      // Desvinculando Vendedor de la cadena superior
      if (nivel == 4) { 
        const desvincular = { codigo_afiliado: "N/A" }
        await conexion.query("UPDATE registro_de_vendedores SET ? WHERE id_vendedor = ?", [desvincular, cl.codigo_id_vendedor])
        await conexion.query("UPDATE usuarios SET ? WHERE id_vendedor = ?", [desvincular, cl.codigo_id_vendedor])
      }

      // Registrando ventas en la tabla Filtro de Número de ventas
      const year = new Date().getFullYear();
      let mes = new Date().getMonth()
      mes == 0 ? mes = 12 : mes = mes + 1
      const dia = new Date().getDate();
      const idVendedor = v1.id_vendedor;
      const codigo_afiliado = vendedorPrincipal.codigo_afiliado;
      const dataVentas = { year, mes, semana, dia, numVentas: nuevaVenta, idVendedor, codigo_afiliado }
      let fecha = new Date().toLocaleDateString("en-CA");
      const dataVentas_adm = {fecha, year, semana, numVentas: nuevaVenta }
      console.log("========>>>>>>>>>>>>>>>>>>>>>>>" , dataVentas_adm);
      await conexion.query('INSERT INTO filtro_numventas SET ?', [dataVentas])
      await conexion.query("INSERT INTO filtro_numventas_admin SET ?", [dataVentas_adm]);

      //* ==>> *** FIN **** sumar ventas individuales <<===

      //* ==>> Apartado para sumar ventas a la cadena <<===
      cl.seller = []
      let v2 = false, v3 = false, v4 = false;

      //* =======>>> VALIDAR SI EL VENDEDOR 2 ESTÁ AFILIADO A OTRO DE UN NIVEL SUPERIOR (NIVEL 2, 3 o 4)
      v1.codigo_afiliado != '' || v1.codigo_afiliado != 'N/A' ? v2 = seller.find(item => item.id_vendedor == v1.codigo_afiliado) : v2;
      if (v2) {
        // Sumando ventas de afiliados actuales con Total de ventas del vendedor anterior
        const ventas_afiliados = (parseFloat(v2.ventas_afiliados) + nuevaVenta)
        const total_ventasV2 = v2.ventas_individuales + ventas_afiliados

        // VALIDANDO SI NECESITA SUBIR DE NIVEL EL VENDEDOR PRINCIPAL
        const nivel = _subirNivelVendedor(total_ventasV2)
        // OBJETO PARA ENVIAR A LA BASE DE DATOS
        const vendedor2 = { nivel, ventas_afiliados, total_ventas: total_ventasV2 }
        console.log("---------\nDATOS DE VENDEDOR 2", vendedor2);
        // Actualizando numero de ventas del vendedor que la hizo (Indivuales, afiliados, totales)
        await conexion.query("UPDATE registro_de_vendedores SET ? WHERE id_vendedor = ?", [vendedor2, v2.id_vendedor])

        // Desvinculando Vendedor de la cadena superior
        if (nivel == 4) { 
          const desvincular = { codigo_afiliado: "N/A" }
          await conexion.query("UPDATE registro_de_vendedores SET ? WHERE id_vendedor = ?", [desvincular, v2.id_vendedor])
          await conexion.query("UPDATE usuarios SET ? WHERE id_vendedor = ?", [desvincular, v2.id_vendedor])

        }

        //* =======>>> VALIDAR SI EL VENDEDOR 2 ESTÁ AFILIADO A OTRO DE UN NIVEL SUPERIOR (NIVEL 3 o 4)
        v2.codigo_afiliado != '' || v2.codigo_afiliado != 'N/A' ? v3 = seller.find(item => item.id_vendedor == v2.codigo_afiliado) : v3;
        if (v3) {
          // Sumando ventas de afiliados actuales con Total de ventas del vendedor anterior
          const ventas_afiliados = (parseFloat(v3.ventas_afiliados) + nuevaVenta)
          const total_ventasV3 = v3.ventas_individuales + ventas_afiliados

          // VALIDANDO SI NECESITA SUBIR DE NIVEL EL VENDEDOR PRINCIPAL
          const nivel = _subirNivelVendedor(total_ventasV3)
          // OBJETO PARA ENVIAR A LA BASE DE DATOS
          const vendedor3 = { nivel, ventas_afiliados, total_ventas: total_ventasV3 }
          console.log("---------\nDATOS DE VENDEDOR 3", vendedor3);
          // Actualizando numero de ventas del vendedor que la hizo (Indivuales, afiliados, totales)
          await conexion.query("UPDATE registro_de_vendedores SET ? WHERE id_vendedor = ?", [vendedor3, v3.id_vendedor])

          // Desvinculando Vendedor de la cadena superior
          if (nivel == 4) { 
            const desvincular = { codigo_afiliado: "N/A" }
            await conexion.query("UPDATE registro_de_vendedores SET ? WHERE id_vendedor = ?", [desvincular, v3.id_vendedor])
            await conexion.query("UPDATE usuarios SET ? WHERE id_vendedor = ?", [desvincular, v3.id_vendedor])

          }

          //* =======>>> VALIDAR SI EL VENDEDOR 3 ESTÁ AFILIADO A OTRO DE UN NIVEL SUPERIOR (NIVEL 4)
          v3.codigo_afiliado != '' || v3.codigo_afiliado != 'N/A' ? v4 = seller.find(item => item.id_vendedor == v3.codigo_afiliado) : v4;
          if (v4) {
             // Sumando ventas de afiliados actuales con Total de ventas del vendedor anterior
            const ventas_afiliados = (parseFloat(v4.ventas_afiliados) + nuevaVenta)
            const total_ventasV4 = v4.ventas_individuales + ventas_afiliados

            // VALIDANDO SI NECESITA SUBIR DE NIVEL EL VENDEDOR PRINCIPAL
            const nivel = _subirNivelVendedor(total_ventasV4)
            // OBJETO PARA ENVIAR A LA BASE DE DATOS
            const vendedor4 = { nivel, ventas_afiliados, total_ventas: total_ventasV4 }
            console.log("---------\nDATOS DE VENDEDOR 4", vendedor4);
            // Actualizando numero de ventas del vendedor que la hizo (Indivuales, afiliados, totales)
            await conexion.query("UPDATE registro_de_vendedores SET ? WHERE id_vendedor = ?", [vendedor4, v4.id_vendedor])

            // Desvinculando Vendedor de la cadena superior
            if (nivel == 4) { 
              const desvincular = { codigo_afiliado: "N/A" }
              await conexion.query("UPDATE registro_de_vendedores SET ? WHERE id_vendedor = ?", [desvincular, v4.id_vendedor])
              await conexion.query("UPDATE usuarios SET ? WHERE id_vendedor = ?", [desvincular, v4.id_vendedor])

            }

          } // FIN V4

        } // FIN V3

      } // FIN V2

    } else {
      console.log("\n <<<<<<<<<<<<<<<< No hay coincidencias de vendedor >>>>>>>>>>>>>>>>>>>\n")
    }

  } else {
    console.log("No se encontró el cliente");
  }
  res.send(respuesta);
}
//todo ************* -- FIN  GUARDAR COMISIONES + DEDUCCIONES EN DB ************* */


/********************************************************************************************************************************************************************** */
function _subirNivelVendedor(ventasTotales) {
  let nivel = 1;
  if (ventasTotales > 20 && ventasTotales <= 40) {
    nivel = 2
  } else if (ventasTotales > 40 && ventasTotales <= 60) {
    nivel = 3
  } else if (ventasTotales > 60 ) {
    nivel = 4
  } else {
    nivel = 1
  }
  return nivel;
}
/********************************************************************************************************************************************************************** */

// todo ======>>> DASHBOARD DE ADMINISTRADOR
exports.dashboardAdministrador = async (req, res) => {
  // ==> CONSULTA PARA SACARLA INFORMACION DE VENDEDORES  
  let info_vendedores = await conexion.query("SELECT * FROM registro_de_vendedores ");

  // ==> SUMANDO EL NUMERO TOTAL DE VENTAS EN GENERAL
  let sumaTotalVentas = 0;
  info_vendedores.forEach(iv => {
    sumaTotalVentas += parseFloat(iv.ventas_individuales)
  });

  // ==>>  CONSULTA PARA SACAR LOS DATOS PARA LA GRAFICA "NÚMERO DE VENTAS" 
  //  flnumVentas_admin = filtro número de ventas admin
  let flnumVentas_admin = await conexion.query("SELECT * FROM (SELECT * FROM historial_numventas_admin ORDER BY id DESC LIMIT 7) sub ORDER BY id ASC;");
  let datosJson_flnumVentas_admin, rendimientoNumventas = 0
  if (flnumVentas_admin.length > 0) {
    datosJson_flnumVentas_admin = JSON.stringify(flnumVentas_admin);

    let ultimo, penultimo = 0;
    ultimo = flnumVentas_admin[flnumVentas_admin.length - 1].numVentas;
    if (flnumVentas_admin.length >= 2) {
      penultimo = flnumVentas_admin[flnumVentas_admin.length - 2].numVentas;
      rendimientoNumventas = (parseFloat(ultimo - penultimo) / penultimo) * 100;
      rendimientoNumventas = rendimientoNumventas.toFixed(1);
    }
    if (ultimo == 0 && penultimo == 0) { rendimientoNumventas = 0 }
    if (penultimo == 0 && ultimo >= 1) { rendimientoNumventas = 100 }
  
  } 
  console.log(" JSON DE ADMINISTRADOR NUMERO VENDEDORES ==>>>>> " , datosJson_flnumVentas_admin);

  // ==> CONSULTA PARA CONTAR LA CANTIDAD DE VENDEDORES 
  let countVendedores= await conexion.query("SELECT count(correo) as totalVendedores FROM usuarios WHERE rol = 'vendedor'AND estado_de_la_cuenta = 'aprobado';");
  console.log(countVendedores[0].totalVendedores)

  // ==>>  CONSULTA PARA SACAR LOS DATOS PARA LA GRAFICA "VENDEDORES" 
  let vdAgregados_admin = await conexion.query("SELECT * FROM (SELECT * FROM historial_vendedores_admin ORDER BY id DESC LIMIT 7) sub ORDER BY id ASC;");
  let datosJson_vdAgregados_Admin, rendimientoVd = 0
  if (vdAgregados_admin.length > 0) {
    datosJson_vdAgregados_Admin = JSON.stringify(vdAgregados_admin);

    let ultimoVd, penultimoVd = 0;
    ultimoVd = vdAgregados_admin[vdAgregados_admin.length - 1].numVendedores;
    if (vdAgregados_admin.length >= 2) {
      penultimoVd = vdAgregados_admin[vdAgregados_admin.length - 2].numVendedores;
      rendimientoVd = (parseFloat(ultimoVd - penultimoVd) / penultimoVd) * 100;
      rendimientoVd = rendimientoVd.toFixed(1);
    }
    if (ultimoVd == 0 && penultimoVd == 0) { rendimientoVd = 0 }
    if (penultimoVd == 0 && ultimoVd >= 1) { rendimientoVd = 100 }

  } 
  console.log(" JSON DE ADMINISTRADOR NUMERO VENDEDORES ==>>>>> " , datosJson_vdAgregados_Admin, );

  // ==> CONSULTA PARA CONTAR LA CANTIDAD DE CLIENTES 
  let countCliente = await conexion.query("SELECT count(correo) as totalClientes FROM nuevos_cliente");
  console.log(countCliente[0].totalClientes);

  // ==>>  CONSULTA PARA SACAR LOS DATOS PARA LA GRAFICA "CLIENTES" 
  let clAgregados_admin = await conexion.query("SELECT * FROM (SELECT * FROM historial_clientes_admin ORDER BY id DESC LIMIT 7) sub ORDER BY id ASC;");
  let datosJson_clAgregados_Admin, rendimientoCl = 0
  if (clAgregados_admin.length > 0) {
    datosJson_clAgregados_Admin = JSON.stringify(clAgregados_admin);

    let ultimoCl, penultimoCl = 0;
    ultimoCl = clAgregados_admin[clAgregados_admin.length - 1].numClientes;
    if (clAgregados_admin.length >= 2) {
      penultimoCl = clAgregados_admin[clAgregados_admin.length - 2].numClientes;
      rendimientoCl = (parseFloat(ultimoCl - penultimoCl) / penultimoCl) * 100;
      rendimientoCl = rendimientoCl.toFixed(1);
    }
    if (ultimoCl == 0 && penultimoCl == 0) { rendimientoCl = 0 }
    if (penultimoCl == 0 && ultimoCl >= 1) { rendimientoCl = 100 }
  } 
  console.log(" JSON DE ADMINISTRADOR NUMERO CLIENTES ==>>>>> " , datosJson_clAgregados_Admin);

  // ==>> CONSULTA PARA SACAR LOS DATOS PARA EL MAPA Y MOSTRAR LOS CLIENTES 
  let ventasCiudades = await conexion.query("SELECT nc.ciudad, nc.latitud, nc.longitud, nc.codigo_postal FROM nuevos_cliente nc JOIN servicios_de_instalacion si ON nc.id = si.id_cliente");
  let datosJson_ventasCiudades_admin
  if (ventasCiudades.length > 0) {
    datosJson_ventasCiudades_admin = JSON.stringify(ventasCiudades);
  }

  // * CAPTURANDO DATOS PARA LA GRÁFICA DE VENTAS MENSUALES
  let historialGananciasAdm = await conexion.query("SELECT * FROM (SELECT * FROM ganancias_mensuales_admin ORDER BY id DESC LIMIT 12) sub ORDER BY id ASC;");
  let datosJson_historialG_adm
  if (historialGananciasAdm.length > 0) {
    datosJson_historialG_adm = JSON.stringify(historialGananciasAdm);
    console.log("\n");
    console.log("IMPIMIENDO datosJson_historialG_adm ====>>>", datosJson_historialG_adm);
  }

   //* ==>> COMPARATIVA DE VENTAS 
   let topVendedores = []
   let icono = false;
   const top_vendedores = await conexion.query("SELECT id, nombres, apellidos, codigo_afiliado, total_ventas, id_vendedor, ganancias FROM registro_de_vendedores ORDER BY ganancias DESC LIMIT 5");
 
   if (top_vendedores.length > 0) {
     let cont = 1;
     const vActual = top_vendedores.find(i => i.id_vendedor)
     if (vActual) {
       top_vendedores.forEach(x => {
         topVendedores.push({
           nombre: x.nombres + " " + x.apellidos,
           total_ventas : x.total_ventas ,
           pos: cont,
           gananciaA: vActual.ganancias,
           gananciaB: x.ganancias,
           
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

     // CAPTURANDO LAS FACTURAS RECIENTES x VENDEDOR (7 REGISTROS MÁXIMO)
  const clientes_ = await conexion.query("SELECT * FROM nuevos_cliente ORDER BY id DESC LIMIT 7");
  const total_facturas = await conexion.query("SELECT * FROM factura");
  const total_creditos = await conexion.query("SELECT id_cliente, monto_aprobado FROM solicitar_credito");
  const facturas_recientes = []
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

  // ==>> CONSULTA PARA MOSTRAR ACCESO DIRECTO EL ESTADO DE LA INSTALACIÓN 
  let Agenda= await conexion.query(
    "SELECT N.*, S.monto_aprobado, A.estado_agenda FROM nuevos_cliente N LEFT JOIN solicitar_credito S ON N.id = S.id_cliente LEFT JOIN agendar_instalacion A ON N.id = A.id_cliente WHERE A.estado_agenda = 0");

    Agenda.forEach((c) => {
    /** Estado de la instalación */
    c.estadoAgenda = {};
    c.estadoAgenda.txt = "No instalado";
    c.estadoAgenda.color = "badge-soft-dark";

    if (c.estado_agenda == 0) {c.estadoAgenda.txt = "Instalación pendiente"; c.estadoAgenda.color = "badge-soft-warning"; }
    if (c.estado_agenda == 1) { c.estadoAgenda.txt = "Instalado"; c.estadoAgenda.color = "badge-soft-success"; }
  });

   res.render("administrador", { user: req.user, info_vendedores, 
    sumaTotalVentas,numClientes: countCliente[0].totalClientes,
    numVendedores: countVendedores[0].totalVendedores,
    datosJson_flnumVentas_admin,rendimientoNumventas,
    datosJson_vdAgregados_Admin,rendimientoVd,
    datosJson_clAgregados_Admin, rendimientoCl, datosJson_ventasCiudades_admin,datosJson_historialG_adm,
    topVendedores,facturas_recientes,Agenda});
} 

// todo ===>>> INSERTAR DATOS A LA TABLA HISTORIAL CLIENTES ADMIN 
exports.historial_clientes_admin = async (req, res) => {

  let clientes = await conexion.query("SELECT * FROM nuevos_cliente");
  let fecha = new Date().toLocaleDateString("en-CA");
  let yearActual = new Date(fecha).getFullYear();

  currentdate = new Date();
  const oneJan = new Date(currentdate.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
  const semanaActual = Math.ceil((currentdate.getDay() + numberOfDays) / 7) - 1;
  console.log("Semana actual ==>> ", semanaActual);
  let numClientes
  
  // ==> FILTRANDO CLIENTES POR SEMANA Y AÑO DE REGISTRO CON LA ACTUAL
  const resultado = clientes.filter((item) => item.semana == semanaActual && item.year == yearActual);

  if (resultado.length > 0) {
    numClientes = resultado.length;
    console.log("NUMERO DE CLIENTES >>>>>", numClientes);

    // ==> ENVIANDO A LA TABLA HISTORIAL CLIENTES DEL ADMIN FILTRADOS POR SEMANA Y AÑO 
    const datosHcl_admin = { fecha, numClientes }; //==> DATOS HISTORIAL CLIENTES ADMIN
    await conexion.query("INSERT INTO historial_clientes_admin SET ?", [datosHcl_admin]);
    console.log("Realizando registro en DB HISTORIAL CLIENTES ADMINISTRADOR....")
  } else {
    let numRepetido = await conexion.query("SELECT * FROM historial_clientes_admin ORDER BY id DESC LIMIT 1");
    numClientes = numRepetido[0].numClientes
    // ==> ENVIANDO A LA TABLA HISTORIAL CLIENTES DEL ADMIN FILTRADOS POR SEMANA Y AÑO 
    const datosHcl_admin = { fecha, numClientes }; //==> DATOS HISTORIAL CLIENTES ADMIN
    await conexion.query("INSERT INTO historial_clientes_admin SET ?", [datosHcl_admin]);
    console.log("Realizando registro en DB HISTORIAL CLIENTES ADMINISTRADOR....")
  }


  res.send("todo ok...");
};

// todo ===>>> INSERTAR DATOS A LA TABLA HISTORIAL CLIENTES ADMIN 
exports.historial_vendedores_admin = async (req, res) => {

  let vendedores = await conexion.query("SELECT * FROM registro_de_vendedores");
  let numVendedores
  let fecha = new Date().toLocaleDateString("en-CA");
  let yearActual = new Date(fecha).getFullYear();

  currentdate = new Date();
  const oneJan = new Date(currentdate.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
  const semanaActual = Math.ceil((currentdate.getDay() + numberOfDays) / 7) - 1;
  console.log("Semana actual ==>> ", semanaActual);
  
  // ==> FILTRANDO CLIENTES POR SEMANA Y AÑO DE REGISTRO CON LA ACTUAL
  const resultado = vendedores.filter((item) => item.semana == semanaActual && item.year == yearActual);
  if (resultado.length > 0) {
    numVendedores = resultado.length;
    // ==> ENVIANDO A LA TABLA HISTORIAL VENDEDORES DEL ADMIN FILTRADOS POR SEMANA Y AÑO 
    const datosHvd_admin = { fecha, numVendedores }; //==> DATOS HISTORIAL CLIENTES ADMIN
    await conexion.query("INSERT INTO historial_vendedores_admin SET ?", [datosHvd_admin]);
    console.log("Realizando registro en DB HISTORIAL VENDEDORES ADMINISTRADOR....")
  } else {
    let numRepetido = await conexion.query("SELECT * FROM historial_vendedores_admin ORDER BY id DESC LIMIT 1");
    numVendedores = numRepetido[0].numVendedores
    // ==> ENVIANDO A LA TABLA HISTORIAL  VENDEDORES DEL ADMIN FILTRADOS POR SEMANA Y AÑO 
    const datosHcl_admin = { fecha, numVendedores }; //==> DATOS HISTORIAL VENDEDORES ADMIN
    await conexion.query("INSERT INTO historial_vendedores_admin SET ?", [datosHcl_admin]);
    console.log("Realizando registro en DB HISTORIAL VENDEDORES ADMINISTRADOR....")
  }
  console.log("NUMERO DE VENDEDORES >>>>>", numVendedores);

 res.send("todo ok...");
};

// todo ===>>> INSERTAR DATOS A LA TABLA FILTRO NUMVENTAS ADMIN 
exports.filtro_numventas_admin = async (req, res) => {

  // ==> CONSULTA PARA SACARLA INFORMACION DE FILTRO NUMVENTAS ADMINISTRADOR  
  let flNumventasAdm = await conexion.query("SELECT * FROM filtro_numventas_admin ");

  let numVentas 
  let fecha = new Date().toLocaleDateString("en-CA");
  let year = new Date(fecha).getFullYear();
  currentdate = new Date();
  const oneJan = new Date(currentdate.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
  const semana = Math.ceil((currentdate.getDay() + numberOfDays) / 7) - 1;

  // ==>> FILTRANDO LA SEMANA DEL DATO VACIO DE LA TABLA "FILTRO NUMVENTAS ADMINISTRADOR"
  const resultado = flNumventasAdm.filter((item) => item.semana == semana && item.year == year);
  let rsemana
  resultado.forEach(r => {
    rsemana = r.semana;
    numVentas = r.numVentas
  });
  // ==>> VALIDANDO SI EXISTE SEMANA ACTUAL CON LA QUE SE ENCUENTRA EN EL VALOR POR DEDFECTO DE LA TABLA
  const datos_insert = {fecha, numVentas}
  if (rsemana == semana) {
    await conexion.query("INSERT INTO historial_numventas_admin SET ?", [datos_insert]);
  }
  
  res.send("todo ok...");

};

// todo ===>>> INSERTAR DATOS A LA TABLA FILTRO NUMVENTAS ADMIN 
exports.ganancias_mensuales_admin = async (req, res) => {

  const factura = await conexion.query("SELECT * FROM factura")
  let gananciaObtenida
  let comisionObtenida

  let fecha = new Date().toLocaleDateString("en-CA");
  let mesActual = new Date().getMonth();
  mesActual == 0 ? (mesActual = 12) : (mesActual = mesActual + 1);
  const mesAnterior = mesActual - 1
  const year = new Date().getFullYear();

  let filtroGanancias, gananciasEmpresa = 0, comisionEmpresa = 0 ;
  filtroGanancias = factura.filter((item) => mesAnterior == item.mes && year == item.year);
  if (filtroGanancias.length > 0) {

    filtroGanancias.forEach(fg => {
      gananciaObtenida = JSON.parse(fg.ganancias_empresa);
      console.log("/gananciaObtenida/ ===>>>>>>", gananciaObtenida.total);
      gananciasEmpresa += parseFloat(gananciaObtenida.total)

      comisionObtenida = fg.comision_total
      console.log("/comisionObtenida/ ===>>>>>>", comisionObtenida);
      comisionEmpresa += parseFloat(comisionObtenida)
    });
  }
  comisionEmpresa = comisionEmpresa * (-1)

  console.log("/SUMAAA/ ===>>>>>>", gananciasEmpresa);
  console.log("/SUMAAA/ ===>>>>>>", comisionEmpresa);

  const f = new Date()
  f.setMonth(mesAnterior - 1);
  let txtMes = f.toLocaleDateString("es", { month: "short" })
  const mes = txtMes.charAt(0).toUpperCase() + txtMes.slice(1);

  const guardarGanancias = { fecha, mes, gananciasEmpresa, comisionEmpresa }
  await conexion.query("INSERT INTO ganancias_mensuales_admin SET ?", [guardarGanancias]);
  
  res.send("todo ok...");

};





