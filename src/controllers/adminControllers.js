const {
  promisify
} = require("util");
const conexion = require("../database/db");
const {} = require('../controllers/adminControllers');



exports.isAdmin = async (req, res, next) => {
  try {
    if (!(req.user.rol === "administrador")) {
      res.redirect("./");
    }
  } catch (error) {
    console.log(error);
    return next();
  }
};





// ? ========>>> ZONA DE VENDEDORES <<<========
// todo ===========>>>  Mostrar lista de VENDEDORES
exports.listarVendedores = async (req, res) => {

  const lista_vendedores = await conexion.query("SELECT * FROM registro_de_vendedores");
  const usuarios = await conexion.query("SELECT * FROM usuarios");

  lista_vendedores.forEach(v => {

    v.estadoVendedor = {}
    v.estadoVendedor.txt = "Pendiente";
    v.estadoVendedor.color = "badge-soft-warning";

    if (usuarios.length > 0) { // Validando si la tabla de usuarios tiene registros

      usuarios.forEach(u => {
        // Comparando tabla de usuarios con vendedores
        if (v.id == u.id_vendedorAceptado) {
          v.estadoCuenta = u.estado_de_la_cuenta;

          if (u.estado_de_la_cuenta == 0) {
            v.estadoVendedor.txt = "Aprobado";
            v.estadoVendedor.color = "badge-soft-success";
          }

          if (u.estado_de_la_cuenta == 1) {
            v.estadoVendedor.txt = "Bloqueado";
            v.estadoVendedor.color = "badge-soft-danger";
          }

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
  let info_vendedor = await conexion.query("SELECT * FROM registro_de_vendedores WHERE id_vendedor = ? ", [id_vendedor]);
  info_vendedor = info_vendedor[0];

  const licencia = JSON.parse(info_vendedor.licencia_conduccion);

// todo===========>>>  Mostrar afiliados a tal vendedor
    // Consultando en DB los clientes que pertenecen al vendedor actual
 let afiliados = await conexion.query('SELECT * FROM registro_de_vendedores WHERE codigo_afiliado = ?', [info_vendedor.id_vendedor])



    // Consultando en DB los clientes que pertenecen al vendedor actual
let referente = await conexion.query('SELECT * FROM registro_de_vendedores WHERE id_vendedor = ? LIMIT 1', [info_vendedor.codigo_afiliado])
referente = referente[0];


  // * >>> Renderizado <<<<<
  res.render("./1-admin/perfil-vendedores", { user: req.user, info_vendedor, afiliados,referente,licencia});
};
// todo ===========>>>  Actualizar estado de vendedores 
exports.ActualizarNivel = async (req, res) => {
  const id_vendedor = req.body.coodigoActualizarxs;
  const nivel = req.body.nivel;

  const datosNivel = {nivel,id_vendedor}
  
  await conexion.query("UPDATE registro_de_vendedores SET ? WHERE id_vendedor = ? ", [datosNivel,id_vendedor], (err, result) => {
    if (err) throw err;


    if (result) { res.redirect('/perfil-vendedores/'+id_vendedor  )}
   
  })
};

// ? ========>>> ZONA DE VENDEDORES <<<========



// ? ========>>> ZONA DE CLIENTES <<<========
// todo ===========>>>  Mostrar lista de CLIENTES y referencia de su vendedor
exports.listarClientes = async (req, res) => {

  let lista_clientes = await conexion.query("SELECT N.* , S.sistema ,S.estado_del_credito , A.estado_agenda, T.fecha_test FROM nuevos_cliente N LEFT JOIN solicitar_credito S ON N.id = S.id_cliente LEFT JOIN agendar_instalacion A ON N.id = A.id_cliente LEFT JOIN test_agua T ON N.id = T.id_cliente;");

  lista_clientes.forEach(c => {

    /** Estado del Crédito */
    c.estadoCredito = {}
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
    c.estadoAgenda = {}
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
    lista_clientes
  });


}

// ! >>>> Tarjetas en la vista perfil clientes <<<<<<<<<<<
exports.listarClientes_PerfilClientes = async (req, res) => {

  const id_cliente = req.params.id;
  let info_clientes = await conexion.query("SELECT * FROM nuevos_cliente  WHERE id_cliente = ?", [id_cliente]);
  info_clientes = info_clientes[0];

  // * >>> Renderizado <<<<<
  res.render("./1-admin/perfil-cliente", {
    user: req.user,
    info_clientes
  });
};

// ? ========>>> ZONA DE CLIENTES <<<========





// todo ===========>>> Enviar contraseña y usuario a la tabla USUARIOS
exports.generar_usuario_vendedor = async (req, res) => {
  const correo = req.body.correo;
  const pass = generarPass_vendedor(6);

  const id_vendedorAceptado = req.body.id_consecutivo;
  const id_vendedor = req.body.id_vendedor;
  const codigo_afiliado = req.body.codigo_afiliado;

  const Datos_agendarSolicitud = {
    correo,
    pass,
    id_vendedorAceptado,
    id_vendedor,
    codigo_afiliado,
  };

  await conexion.query(
    "INSERT INTO usuarios SET ? ", [Datos_agendarSolicitud], (err, result) => {
      if (err) throw err;
      if (result) {
        res.redirect("./1-admin/perfil-vendedores/" + id_vendedor);
      }
    }
  );
};
// todo ===========>>> Generar codigo numero aleatorio del cliente
const generarPass_vendedor = (num) => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result1 = "";
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result1;
};