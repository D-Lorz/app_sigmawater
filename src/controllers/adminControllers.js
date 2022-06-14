const { promisify } = require("util");
const conexion = require("../database/db");
const {} = require("../controllers/adminControllers");

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

  const datosNivel = {
    nivel,
    id_vendedor,
  };

  await conexion.query(
    "UPDATE registro_de_vendedores SET ? WHERE id_vendedor = ? ",
    [datosNivel, id_vendedor],
    (err, result) => {
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
  const datosEstado_vendedor = {
    estado_de_la_cuenta,
    id_consecutivo,
    id_vendedor,
  };

  await conexion.query(
    "UPDATE usuarios SET ? WHERE id_vendedor = ? ",
    [datosEstado_vendedor, id_vendedor],
    (err, result) => {
      if (err) throw err;

      if (result) {
        res.redirect("/perfil-vendedores/" + id_vendedor);
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
      c.estadoCredito.txt = "Pagado";
      c.estadoCredito.color = "badge-soft-success";
    }

    if (c.estado_del_credito == 3) {
      c.estadoCredito.txt = "Rechazado";
      c.estadoCredito.color = "badge-soft-danger";
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

// ! >>>> Tarjetas en la vista perfil clientes <<<<<<<<<<<
exports.listarClientes_PerfilClientes = async (req, res) => {
  const id_cliente = req.params.id;
  let info_clientes = await conexion.query("SELECT * FROM nuevos_cliente  WHERE id_cliente = ?",[id_cliente]);
  info_clientes = info_clientes[0];

  // * >>> Renderizado <<<<<
  res.render("./1-admin/perfil-cliente", {
    user: req.user,
    info_clientes,
  });
};

// ? ========>>> ZONA DE CLIENTES <<<========

// todo ===========>>> Generar codigo numero aleatorio del cliente
const generarPass_vendedor = (num) => {
  const characters = "0123456789";
  let result1 = "";
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result1;
};
