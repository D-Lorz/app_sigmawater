const { promisify } = require("util");
const conexion = require("../database/db");



// ? ========>>> ZONA DE VENDEDORES <<<========
// todo ===========>>>  Mostrar lista de VENDEDORES
exports.listarVendedores = async (req, res) => {
  const lista_vendedores = await conexion.query(
    "SELECT * FROM registro_de_vendedores"
  );
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
          v.estadoDe_laCuenta = u.estado_de_la_cuenta;

          if (u.estado_de_la_cuenta === "aprobado") {
            v.estadoVendedor.txt = "Aprobado";
            v.estadoVendedor.color = "badge-soft-success";
          }

          if (u.estado_de_la_cuenta === "bloqueado") {
            v.estadoVendedor.txt = "Bloqueado";
            v.estadoVendedor.color = "badge-soft-danger";
          }
        }
      });
    }
  });

  res.render("./1-admin/vendedores", {
    user: req.user,
    lista_vendedores,
  });
};
// ! >>>>>>>>> Vista perfil vendedores <<<<<<<<<<<
exports.listarVendedores_PerfilVendedores = async (req, res) => {
  const id_vendedor = req.params.id;
  let info_vendedor = await conexion.query("SELECT * FROM registro_de_vendedores WHERE id_vendedor = ? ",[id_vendedor] );
  info_vendedor = info_vendedor[0];

 
  const licencia = JSON.parse(info_vendedor.licencia_conduccion);

  // todo===========>>>  Mostrar afiliados a tal vendedor
  let afiliados = await conexion.query(
    "SELECT * FROM registro_de_vendedores WHERE codigo_afiliado = ?",
    [info_vendedor.id_vendedor]
  );

  // todo===========>>>  Mostrar afiliado a este vendedor
  // Consultando en DB los clientes que pertenecen al vendedor actual
  let referente = await conexion.query(
    "SELECT * FROM registro_de_vendedores WHERE id_vendedor = ? LIMIT 1",
    [info_vendedor.codigo_afiliado]
  );
  referente = referente[0];

  // todo===========>>>  Mostrar estado actual de un vendedor
  let viewsUser = await conexion.query(
    "SELECT * FROM usuarios WHERE id_vendedor = ? LIMIT 1",
    [info_vendedor.id_vendedor]
  );
  viewsUser = viewsUser[0];

  // todo ===============================>>> Estado del solicitar credito y estado de instalacion + cliente por vendedor
  let infoClientes = await conexion.query("SELECT * FROM nuevos_cliente WHERE codigo_id_vendedor = ?", [id_vendedor]);
  let clCredito = await conexion.query("SELECT * FROM solicitar_credito");
  let clAgenda = await conexion.query("SELECT * FROM agendar_instalacion");
  let cltestAgua = await conexion.query("SELECT * FROM test_agua");

  infoClientes.forEach((info) => {

    info.estadoCreditoCliente = {};
    info.estadoCreditoCliente.txt = "No solicitado";
    info.estadoCreditoCliente.color = "badge-soft-dark";

    info.estadoAgendar = {}
    info.estadoAgendar.txt = "No instalado";
    info.estadoAgendar.color = "badge-soft-dark";

    info.sistema = {};
    info.sistema.txt = "N/A";
  
    if (clCredito.length > 0) {
      clCredito.forEach((c) => {
        if (info.id == c.id_cliente) {
          if (c.estado_del_credito == 0) {
            info.estadoCreditoCliente.txt = "Pendiente";
            info.estadoCreditoCliente.color = "badge-soft-warning";
          }

          if (c.estado_del_credito == 1) {
            info.estadoCreditoCliente.txt = "Aprobado";
            info.estadoCreditoCliente.color = "badge-soft-success";
          }
          if (c.estado_del_credito == 2) {
            info.estadoCreditoCliente.txt = "Bloqueado";
            info.estadoCreditoCliente.color = "badge-soft-danger";
          }
        }
      });
    }

    if (clCredito.length > 0) {
      clCredito.forEach((x) => {
        if (info.id == x.id_cliente) {

          if (x.sistema === "Reverse Osmosis System" ) {
            info.sistema.txt = "Reverse Osmosis System";
        
          } 
          if (x.sistema === "Whole System" ) {
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
        }
      });
    }
  });
console.log();
console.log(infoClientes);

  // * >>> Renderizado <<<<<
  res.render("./1-admin/perfil-vendedores", {
    user: req.user,
    info_vendedor,
    afiliados,
    referente,
    licencia,
    viewsUser,
    infoClientes,
  });
};
// todo ===========>>>  Actualizar nivel de vendedores
exports.ActualizarNivel = async (req, res) => {

  const id_vendedor = req.body.coodigoActualizarxs;
  const nivel = req.body.nivel;

  const datosNivel = { nivel,id_vendedor};

  await conexion.query( "UPDATE registro_de_vendedores SET ? WHERE id_vendedor = ? ", [datosNivel, id_vendedor], (err, result) => {
      if (err) throw err;

      if (result) {
        res.redirect("/perfil-vendedores/" + id_vendedor);
      }
    }
  );
};
// todo ===========>>>  Actualizar estado de vendedores
exports.ActualizarEstado = async (req, res) => {
  const id_vendedor = req.body.id_vendedorEnviar;
  const id_consecutivo = req.body.id_consecutivo;
  const estado_de_la_cuenta = req.body.estadoDe_laCuenta;
  const datosEstado_vendedor = {estado_de_la_cuenta, id_consecutivo, id_vendedor, };

  await conexion.query( "UPDATE usuarios SET ? WHERE id_vendedor = ? ", [datosEstado_vendedor, id_vendedor], (err, result) => {
      if (err) throw err;

      if (result) {
        res.redirect("/perfil-clientes/" + id_vendedor);
      }
    }
  );
};
// ? ========>>> ZONA DE VENDEDORES <<<========



// ? ========>>> ZONA DE CLIENTES <<<========
// todo ===========>>>  Mostrar lista de CLIENTES y referencia de su vendedor
exports.listarClientes = async (req, res) => {
  let lista_clientes = await conexion.query(
    "SELECT N.*, S.sistema,S.estado_del_credito, A.estado_agenda FROM nuevos_cliente N LEFT JOIN solicitar_credito S ON N.id = S.id_cliente LEFT JOIN agendar_instalacion A ON N.id = A.id_cliente LEFT JOIN test_agua T ON A.id_cliente = T.id;"
  );

  lista_clientes.forEach((c) => {
    /** Estado del Crédito */
    c.estadoCredito = {};
    c.estadoCredito.txt = "No solicitado";
    c.estadoCredito.color = "badge-soft-dark";

    if (c.estado_del_credito == 0) {
      c.estadoCredito.txt = "En revisión";
      c.estadoCredito.color = "badge-soft-warning";
    }
    if (c.estado_del_credito == 1) {
      c.estadoCredito.txt = "Aprobado";
      c.estadoCredito.color = "badge-soft-success";
    }
    if (c.estado_del_credito == 2) {
      c.estadoCredito.txt = "Rechazado";
      c.estadoCredito.color = "badge-soft-danger";
    }
    if (c.estado_del_credito == 3) {
      c.estadoCredito.txt = "Pagado (cash)";
      c.estadoCredito.color = "badge-soft-info";
    }
    /** Estado de la instalación */
    c.estadoAgenda = {};
    c.estadoAgenda.txt = "No instalado";
    c.estadoAgenda.color = "badge-soft-dark";

    if (c.estado_agenda == 0) {
      c.estadoAgenda.txt = "Listo para instalar";
      c.estadoAgenda.color = "badge-soft-warning";
    }

    /** Formateando la fecha */
    // const f = new Date(c.fecha_test)
    // c.fecha_test = f.toLocaleDateString("en-US")
  });

  // * >>> Renderizado <<<<<
  res.render("./1-admin/listar-clientes", {
    user: req.user,
    lista_clientes,
  });
};

//* Formateando precios a una moneda 
const formatear = new Intl.NumberFormat('en-US', {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});


// ! >>>> Tarjetas en la vista perfil clientes <<<<<<<<<<<
exports.listarClientes_PerfilClientes = async (req, res) => {
  const id_cliente = req.params.id;
  let info_clientes = await conexion.query("SELECT * FROM nuevos_cliente  WHERE id_cliente = ?",[id_cliente]);
  info_clientes = info_clientes[0];

// todo ===============================>>> Estado del solicitar credito
let credito = await conexion.query('SELECT * FROM solicitar_credito WHERE id_cliente = ? LIMIT 1', [info_clientes.id])
let estado = []
estado.txt = "No solicitado";
estado.color = 'badge-soft-dark'

if (credito.length > 0) {
  credito = credito[0]
  if (credito.estado_del_credito === '0') {
    estado.txt = "En revisión";
    estado.color = 'badge-soft-warning'
 
  } else if (credito.estado_del_credito == 1) {
    estado.txt = "Aprobado";
    estado.color = 'badge-soft-success'
 
  } else if (credito.estado_del_credito == 2) {
    estado.txt = "Rechazado";
    estado.color = 'badge-soft-danger'
  
  } else if (credito.estado_del_credito == 3) {
    estado.txt = "Pagado";
    estado.color = 'badge-soft-info'
   
  }
}


// todo =========================>> Mostrar información del test de agua del cliente
let informacionTestAgua = await conexion.query('SELECT * FROM test_agua WHERE id_cliente = ?  ', [info_clientes.id])
  
// * >>> Estados del testeo (visita al cliente)
let consultaEstado_testAgua = await conexion.query('SELECT * FROM test_agua WHERE id_cliente = ?  ORDER BY id DESC LIMIT 1', [info_clientes.id])
 
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
    let consulta_PrimerTestAgua = await conexion.query('SELECT * FROM test_agua ORDER BY id DESC LIMIT 1, 1', [info_clientes.id])
      
    if(consulta_PrimerTestAgua.length > 0 ){
      consulta_PrimerTestAgua = consulta_PrimerTestAgua[0]
    }
    const datosJson_PrimerTestagua = JSON.stringify(consulta_PrimerTestAgua);

// todo =========================>> Consulta del ULTIMO test de agua para la fecha y grafica
 let consulta_UltimoTestAgua = await conexion.query('SELECT * FROM test_agua WHERE estado_visita_test = 0 ORDER BY id DESC LIMIT 1; ', [info_clientes.id])
 
    if(consulta_UltimoTestAgua.length > 0 ){
      consulta_UltimoTestAgua = consulta_UltimoTestAgua[0]
    }
    const datosJson_UltimoTestagua = JSON.stringify(consulta_UltimoTestAgua);

// todo =========================>> Mostrar información del ahorro del cliente
    let ahorroCalculado = await conexion.query('SELECT * FROM ahorro WHERE id_cliente = ?  ORDER BY id DESC LIMIT 1', [info_clientes.id])
    if(ahorroCalculado.length > 0 ){
      ahorroCalculado = ahorroCalculado[0]
    }
    const datosJson_ahorroCalculado = JSON.stringify(ahorroCalculado);

// todo =========================>> Estados de la agenda para instalar el producto
    let consultaEstado_instalacion = await conexion.query('SELECT * FROM agendar_instalacion WHERE id_cliente = ? LIMIT 1 ', [info_clientes.id])

    let estado_intalacion = []
    estado_intalacion.txt = "La instalación del producto no ha sido agendada";
    estado_intalacion.background = 'noVisitado';

    if (consultaEstado_instalacion.length > 0) {
      consultaEstado_instalacion = consultaEstado_instalacion[0]

    if (consultaEstado_instalacion.estado_agenda === '0') {
      estado_intalacion.txt= "Listo para instalar";
      estado_intalacion.background= 'producto_instalado';
      
    } else if (consultaEstado_instalacion.estado_agenda == 1) {
      estado_intalacion.txt= "Instalado";
      estado_intalacion.background= 'visitado';

    } 
}
// todo ===============================>>> Desactivar boton de registro de instalacion
let clRegistro_instalacion = await conexion.query('SELECT * FROM servicios_de_instalacion WHERE id_cliente = ? LIMIT 1', [info_clientes.id])
let estadu = []
estadu.txt = "No hecho";
estadu.color = 'badge-soft-dark'
estadu.verbtnI = true;

if (clRegistro_instalacion.length > 0) {
  clRegistro_instalacion = clRegistro_instalacion[0]
  
  if (clRegistro_instalacion.estadoRegistro == 0) {
    estadu.txt = "si hecho";
       estadu.verbtnI = false;
      
  } else if (clRegistro_instalacion.estadoRegistro == 1) {
        estadu.verbtnI = false;

  } 

  var evidenciaF= JSON.parse(clRegistro_instalacion.evidencia_fotografica);

}

let clInstalacion = await conexion.query('SELECT * FROM solicitar_credito WHERE id_cliente = ? LIMIT 1', [info_clientes.id])

estadu.txt = "No hecho";
estadu.verbtnI = false;

if (clInstalacion.length > 0) {
  clInstalacion = clInstalacion[0]
  
  if (clInstalacion.estado_del_credito == 0) {
    estadu.txt = "si hecho";
       estadu.verbtnI = false;
      
  } else if (clInstalacion.estado_del_credito == 1) {
        estadu.verbtnI = true;

  } else if (clInstalacion.estado_del_credito == 2) {
    estadu.verbtnI = false;

  } else if (clInstalacion.estado_del_credito == 3) {
   estadu.verbtnI = true;
} 

}


// todo ===============================>>> Mostrar agenda sobre la instalacion del producto

let mostrarAgenda = await conexion.query("SELECT * FROM agendar_instalacion WHERE id_cliente = ?",[info_clientes.id]);
mostrarAgenda = mostrarAgenda[0]

let mostrarDatoscreditos= await conexion.query("SELECT * FROM solicitar_credito WHERE id_cliente = ?",[info_clientes.id]);
mostrarDatoscreditos = mostrarDatoscreditos[0]
if(mostrarDatoscreditos ) {
 
mostrarDatoscreditos.monto_financiar_cliente = formatear.format(mostrarDatoscreditos.monto_financiar_cliente)
}
let clbotonCredito = await conexion.query('SELECT * FROM solicitar_credito WHERE id_cliente = ? LIMIT 1', [info_clientes.id])

let estade = []
estade.txt = "No hecho";
estade.color = 'badge-soft-dark'
estade.btncredito = false;

if (clbotonCredito.length > 0) {
  clbotonCredito = clbotonCredito[0]
  
  if (clbotonCredito.estado_del_credito == 0) {
    estade.txt = "si hecho";
       estade.btncredito = true;
      
  } else if (clbotonCredito.estado_del_credito == 1) {
        estade.btncredito = true;

  }  else if (clbotonCredito.estado_del_credito == 2) {
    estade.btncredito = true;

} else if (clbotonCredito.estado_del_credito == 3) {
  estade.btncredito = true;

}
  var licenciacredito = JSON.parse(clbotonCredito.licencia_cliente);
  // var clfirmaAcuerdo  = clbotonCredito.acuerdo_firmado

}
// let validarBtnInstalacion = await conexion.query('SELECT * FROM solicitar_credito WHERE id_cliente = ? LIMIT 1', [info_clientes.id])
// let estadoBtn = []
// estadoBtn.btnAgenda = false;

//     if (validarBtnInstalacion.length > 0) {
//       validarBtnInstalacion = validarBtnInstalacion[0]

//      if (validarBtnInstalacion.estado_del_credito == 0) {
//         estadoBtn.btnAgenda = false;

//       } else if (validarBtnInstalacion.estado_del_credito == 1) {
//         estadoBtn.btnAgenda = true;
        
//       } else if (validarBtnInstalacion.estado_del_credito == 2) {
//         estadoBtn.btnAgenda = false;

//       } else if (validarBtnInstalacion.estado_del_credito == 3) {
//          estadoBtn.btnAgenda = true;
//      }
//     }



  // * >>> Renderizado <<<<<
  res.render("./1-admin/perfil-cliente", {
    user: req.user, estado,
    info_clientes,
    informacionTestAgua,
    estadoVisita_testAgua,
    consulta_PrimerTestAgua,
    datosJson_PrimerTestagua,
    consulta_UltimoTestAgua,
    datosJson_UltimoTestagua,
    ahorroCalculado,
    datosJson_ahorroCalculado,
    estado_intalacion,
    estadu,
    mostrarAgenda,
    mostrarDatoscreditos,
    estade,
    licenciacredito,    
    clRegistro_instalacion,
    evidenciaF
    
    });


};


exports.ActualizarCredito = async (req, res) => {

  const id_clienteEnviarrr = req.body.id_clienteEnviarrr; 
 const id_cliente = req.body.id_consecutivo; 
 const estado_del_credito = req.body.estadosCredito;


  const datosEstadoCredito = { estado_del_credito,id_cliente};

  await conexion.query( "UPDATE solicitar_credito SET ? WHERE id_cliente = ? ", [datosEstadoCredito, id_cliente], (err, result) => {
      if (err) throw err;

      if (result) {
        res.redirect("/perfil-cliente/" + id_clienteEnviarrr);
      }
    }
  );

};

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

// todo --> Formulario servicio instalado
exports.servicioInstaladosx = async (req, res) => {

  const fecha_instalacion = req.body.fechaDeInstalacion;
  const producto_instalado = req.body.productoInstalado;
  const serial_producto = req.body.serial_producto;
  const instalador = req.body.instalador;
  const evidencia = '../evidenciaServicio/' + urlLicencias[0]
  const evidencia_fotografica = JSON.stringify({'evidencia': evidencia,});
  const nota = req.body.nota;

   const id_cliente = req.body.id_cliente
   const codigo_cliente = req.body.codigo_cliente

   const estado_agenda = 1

 const Datos_servicio = {fecha_instalacion, producto_instalado,serial_producto, instalador,evidencia_fotografica,nota,id_cliente }
 const Datos_estado = { estado_agenda}

await conexion.query('UPDATE agendar_instalacion SET ? WHERE id_cliente = ?', [Datos_estado, id_cliente])
await conexion.query('INSERT INTO servicios_de_instalacion SET ?', [Datos_servicio], (err, result) => {
  if (err) throw err;
  if (result) { res.redirect('/perfil-cliente/'+codigo_cliente) }
    
   })

}

// ? ========>>> ZONA DE CLIENTES <<<========



