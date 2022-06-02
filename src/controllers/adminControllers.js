const {
  promisify
} = require("util");
const conexion = require("../database/db");

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


// ! >>>>>>>>>  Tarjetas en la vista perfil vendedores <<<<<<<<<<<
exports.listarVendedores_PerfilVendedores = async (req, res) => {
  const id_vendedor = req.params.id;
  let info_vendedor = await conexion.query(
    "SELECT * FROM registro_de_vendedores WHERE id_vendedor = ? ",
    [id_vendedor]
  );
  info_vendedor = info_vendedor[0];

  // * >>> Renderizado <<<<<
  res.render("perfil-vendedores", {
    user: req.user,
    info_vendedor
  });
};

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
    "INSERT INTO usuarios SET ? ",
    [Datos_agendarSolicitud],
    (err, result) => {
      if (err) throw err;
      if (result) {
        res.redirect("/perfil-vendedores/" + id_vendedor);
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