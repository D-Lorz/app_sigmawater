const conexion = require("../database/db");
const bcryptjs = require("bcryptjs");
const { nuevoVendedorHTML, sendEmail } = require('../lib/correo')

// todo: ==> Generar codigo de vendedor alphanumerico
const generateRandomString = (num) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result1 = "";
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result1;
};

// todo: ==> Registrar vendedor
exports.registrar = async (req, res) => {
  const year = new Date().getFullYear();
  let mes = new Date().getMonth();
  mes == 0 ? (mes = 12) : (mes = mes + 1);
  // ? NOTA: ==>> Esta es la forma para obtener el numero de la semana actual del año entero <<<<<
  currentdate = new Date();
  const oneJan = new Date(currentdate.getFullYear(), 0, 1);
  const numberOfDays = Math.floor(
    (currentdate - oneJan) / (24 * 60 * 60 * 1000)
  );
  const semana = Math.ceil((currentdate.getDay() + numberOfDays) / 7) - 1;
  // ? NOTA: ==>> Esta es la forma para obtener la fecha actual <<<<<
  const dia = new Date().getDate();
  const nombres = req.body.nombres;
  const apellidos = req.body.apellidos;
  const fecha_nacimiento = req.body.fecha_nacimiento;
  const telefono_movil = req.body.telefono_movil;
  const correo = req.body.correo;
  const seguro_social = req.body.seguro_social;
  const ciudad = req.body.ciudad;
  const direccion = req.body.direccion;
  const apt_suite_unidad = req.body.apt_suite_unidad;
  const codigo_postal = req.body.codigo_postal;
  let codigo_afiliado = req.body.codigo_afiliado;
  let codigo_historial_afiliado = req.body.codigo_afiliado;
  const nombre_banco = req.body.nombre_banco;
  const numero_cuenta = req.body.numero_cuenta;
  const ruta = req.body.ruta;
  const beneficiario = req.body.beneficiario;
  const frontal = "../licences/" + urlLicencias[0];
  const trasera = "../licences/" + urlLicencias[1];
  const licencia_conduccion = JSON.stringify({
    frontal: frontal,
    trasera: trasera,
  });
  const id_vendedor = generateRandomString(6);


  const sellerB = await conexion.query(
    "SELECT id_vendedor, estado_de_la_cuenta FROM usuarios WHERE id_vendedor = ? AND estado_de_la_cuenta = 'aprobado'",
    [codigo_afiliado]
  );
  if (sellerB.length == 0) {
    codigo_afiliado = "N/A";
    codigo_historial_afiliado = null;
  }

  const nuevoRegistro = { year, mes, semana, dia, nombres,
    apellidos, fecha_nacimiento, telefono_movil,
    correo, seguro_social, ciudad, direccion,
    apt_suite_unidad,codigo_postal,  codigo_afiliado,
    codigo_historial_afiliado,nombre_banco, numero_cuenta,
    ruta, beneficiario, licencia_conduccion, id_vendedor,
  };

  const nombresUser = nombres;
  const apellidosUser = apellidos;
  const usuarios = { nombresUser, apellidosUser,
    correo, id_vendedor, codigo_afiliado,
    codigo_historial_afiliado,
  };

  await conexion.query("INSERT INTO usuarios SET ?", [usuarios]);
  await conexion.query("INSERT INTO registro_de_vendedores SET ?", [ nuevoRegistro]);

  console.log("\n+========= >>>>>> HUBO UN NUEVO REGISTRO <<<<<<<<<<============\n"); 

  let admin = await conexion.query(" SELECT * FROM usuarios WHERE rol = 'administrador';");
  admin = admin[0]

  // ! ************* PROCESO DEL EMAIL PARA EL ADMIN ************
  const nomAdmin = admin.nombresUser
  const vendedor = nombresUser + " " + apellidosUser
  const email = "3csigmagroup@gmail.com"
  const asunto = "Nuevo vendedor registrado"
  const plantilla = nuevoVendedorHTML(nomAdmin, vendedor)
  // Enviar email
  console.log("ENVIANDO CORREO DEL EMAIL PARA EL ADMIN...");
  const resultEmail = await sendEmail(email, asunto, plantilla)
  // ESTO ES PARA EL ADMIN ****************
  // console.log("==================>>>", resultEmail);
  // if (resultEmail) {
  //   console.log("\n<<<<< Email - Enviado >>>>>\n")
  // } else {
  //   console.log("Ocurrio un error inesperado al enviar el email al administrador" )
  // }
  // ! **************************************************************

  let idConsecutivo = await conexion.query("SELECT id FROM registro_de_vendedores WHERE id_vendedor = ?",[id_vendedor]);
  let fecha = new Date().toLocaleDateString("en-CA");
  const numClientes = 00;
  const idVendedor = idConsecutivo[0].id;
  const datos_PorDefectosCl = { fecha, numClientes, idVendedor };
  await conexion.query("INSERT INTO historialnuevosclientes SET ?", [
    datos_PorDefectosCl,
  ]);

  let codeAfiliado = await conexion.query(
    "SELECT codigo_afiliado, id_vendedor FROM registro_de_vendedores WHERE id_vendedor = ?",
    [id_vendedor]
  );
  codeVendedor = codeAfiliado[0].id_vendedor;
  const numAfiliados = 00;
  const datos_PorDefectosAfl = {
    fecha,
    numAfiliados: numAfiliados,
    idVendedor: codeVendedor,
  };
  await conexion.query("INSERT INTO historialvendedores SET ?", [
    datos_PorDefectosAfl,
  ]);

  // Insertando datos en la tabla historial_numventas
  const dataVentas = {
    fecha,
    numVentas: 0,
    idVendedor: id_vendedor,
    codigo_afiliado,
  };
  await conexion.query("INSERT INTO historial_numventas SET ?", [dataVentas]);
  res.redirect("https://3csigmawater.com");
};

exports.consultarCorreo = async (req, res) => {
  const { correo } = req.body;
  let valido = true;
  console.log("correo =============>>>", correo);
  let resultCorreo = await conexion.query("SELECT correo FROM usuarios WHERE correo = ?", [correo]);
  if (resultCorreo.length > 0) {
    console.log("resultCorreo =============>>>", resultCorreo[0].correo);
    valido = false;
  }
  res.send(valido)
};

// todo: ==> Mostrar informacion del vendedor afiliado
exports.listarAfiliados = async (req, res) => {
  // Capturando el id del Vendedor actual
  const id_vendedorA = req.user.id_vendedor;
  // Consultando en DB los afiliados de ese vendedor
  conexion.query("SELECT rv.*, u.estado_de_la_cuenta, u.codigo_afiliado, u.codigo_historial_afiliado FROM registro_de_vendedores rv JOIN usuarios u ON u.id_vendedor = rv.id_vendedor WHERE rv.codigo_historial_afiliado = ?", [id_vendedorA], (err, result) => {
      if (err) throw err;
      res.render("usuario/afiliados", {footerVendedor:true, user: req.user, result: result });
    }
  );
};

// todo: ==> Mostrar perfil del vendedor
exports.perfilVendedores = async (req, res) => {
  // Capturando el id del Vendedor actual
  const id_vendedor = req.user.id_vendedor;
  // Consultando en DB los afiliados de ese vendedor

  let fotoUpdate;
  let vendedor = await conexion.query(
    "SELECT * FROM registro_de_vendedores rv JOIN usuarios u ON u.id_vendedor = rv.id_vendedor WHERE rv.id_vendedor = ?",
    [id_vendedor]
  );

  if (vendedor.length > 0) {
    vendedor = vendedor[0];
    if (vendedor.foto) {
      fotoUpdate = vendedor.foto;
    } else {
      fotoUpdate = "../directorio_dash/images/users/userDefault.gif";
    }
  }

  res.render("usuario/perfil-vendedor", { footerVendedor: true,  user: req.user, vendedor, fotoUpdate });
};

// todo: ==> Actualizar informacion de vendedor
exports.editInfo = async (req, res) => {
  const id_vendedor = req.user.id_vendedor;
  const { correo, telefono_movil, direccion, ciudad, apt_suite_unidad, codigo_postal, nombre_banco, numero_cuenta, ruta, beneficiario } = req.body;
  let { pass } = req.body;
  
  let vendedor = await conexion.query("SELECT * FROM usuarios WHERE id_vendedor = ?",[id_vendedor]);
  vendedor = vendedor[0];
  const passDB = vendedor.pass;

  if (pass == '') {
    pass = passDB;
  } else {
    pass = await bcryptjs.hash(pass, 12);
  }

  // **** Información personal *****
  let datos_usuarios = { correo, pass };
  // **** Información bancaria *****
  let datosPersonales = ({ correo, telefono_movil, direccion, ciudad, apt_suite_unidad, codigo_postal, nombre_banco, numero_cuenta, ruta, beneficiario });


  const updateUser = await conexion.query("UPDATE usuarios SET ? WHERE id_vendedor = ?", [datos_usuarios, id_vendedor]);
  const updateSeller = await conexion.query("UPDATE registro_de_vendedores SET ? WHERE id_vendedor = ?", [datosPersonales, id_vendedor]);

  if (updateUser.affectedRows > 0 && updateSeller.affectedRows > 0) {
    res.redirect("/perfil-vendedor/" + id_vendedor);
  } else {
    console.log("OCURRIO UN ERROR AL ACTUALIZAR LOS DATOS");
  }
};

exports.actualizarFotoPerfil = async (req, res) => {
  const r = { ok: false };
  const { codigoVendedor } = req.body;
  const actualizar = {
    foto: "../fotoVendedor/" + urlProfile,
  };
  const vendedor = await conexion.query(
    "UPDATE usuarios SET ? WHERE id_vendedor = ?",
    [actualizar, codigoVendedor]
  );
  if (vendedor.affectedRows > 0) {
    r.ok = true;
  }
  res.send(r);
};

// todo: ==> Mostrar tabs de facturas (propias y afiliados)
exports.facturacion = async (req, res) => {
  const id_vendedorA = req.user.id_vendedor;
  // Consultando en DB las ventas x vendedor
  const allSellers = await conexion.query(
    "SELECT id_vendedor, ventas_individuales, ventas_afiliados, total_ventas, ganancias FROM registro_de_vendedores"
  );
  const ventasVendedor = allSellers.find((i) => i.id_vendedor == id_vendedorA);

  const facturacionPropia = await conexion.query(
    "SELECT f.id_factura, f.fecha_instalacion, nc.nombre, nc.apellido, f.producto_instalado, sc.monto_aprobado, f.comision_total, nc.id as idCliente, f.id_cliente as cliente_factura, f.vendedores, f.estadoFactura FROM nuevos_cliente nc JOIN factura f ON nc.id = f.id_cliente JOIN solicitar_credito sc ON nc.id = sc.id_cliente WHERE nc.codigo_id_vendedor = ? ;",
    [id_vendedorA]
  );

  let sumaComisionPropia = 0;
  facturacionPropia.forEach((fp) => {
    fp.factura = {};
    if (fp.idCliente == fp.cliente_factura) {
      if (fp.estadoFactura == 0) {
        fp.factura.text = "Pendiente";
        fp.factura.color = "badge-soft-warning";
        fp.comision = "Por definir";
      } else {
        fp.factura.text = "Pagado";
        fp.factura.color = "badge-soft-success";
        const vendedores = JSON.parse(fp.vendedores);
        const v = vendedores.find((i) => i.codigo == id_vendedorA);
        fp.comision = v.comision_final;
        fp.comision = parseFloat(fp.comision).toFixed(1); 
        sumaComisionPropia += parseFloat(fp.comision)
      }
    }
  });

  const facturacionAfiliado = await conexion.query(
    "SELECT nc.id as idClientenc, f.id_cliente as idClientef, rv.id_vendedor, rv.nombres, nc.nombre, nc.apellido, f.id_factura, f.fecha_instalacion, f.producto_instalado, f.comision_total, f.vendedores, f.estadoFactura, sc.monto_aprobado, u.estado_de_la_cuenta, u.codigo_afiliado, u.codigo_historial_afiliado FROM registro_de_vendedores rv JOIN nuevos_cliente nc ON rv.id_vendedor = nc.codigo_id_vendedor JOIN factura f ON f.id_cliente = nc.id JOIN solicitar_credito sc ON sc.id_cliente = nc.id JOIN usuarios u ON rv.id_vendedor = u.id_vendedor WHERE rv.codigo_historial_afiliado = ? ;",
    [id_vendedorA]
  );

  let sumaComisionAfiliados = 0;
  facturacionAfiliado.forEach((afl) => {
    afl.facturaAfl = {};
    afl.estado = {};
    afl.estadoAfl = {};
    if (afl.idClientenc == afl.idClientef) {
      if (afl.estadoFactura == 0) {
        afl.facturaAfl.text = "Pendiente";
        afl.facturaAfl.color = "badge-soft-warning";
        afl.comision = "Por definir";
        if(afl.codigo_afiliado == 'N/A' && afl.codigo_historial_afiliado)
        {afl.estadoAfl.text = "Desvinculado"; afl.estadoAfl.color = "badge-soft-danger"; }
      } else {
        afl.facturaAfl.text = "Pagado";
        afl.facturaAfl.color = "badge-soft-success";
        if (afl.estado_de_la_cuenta == "bloqueado") {
          afl.estado.text = "Desvinculado";
          afl.estado.color = "badge-soft-danger";
        }
        if(afl.codigo_afiliado == 'N/A' && afl.codigo_historial_afiliado){
          afl.estadoAfl.text = "Desvinculado";
          afl.estadoAfl.color = "badge-soft-danger";
        }
        const vendedores = JSON.parse(afl.vendedores);
        const v = vendedores.find((i) => i.codigo == id_vendedorA);
        afl.comision = parseFloat(v.comision_final);
        sumaComisionAfiliados += afl.comision;
      }
    }
  });

  sumaComisionAfiliados != 0
    ? (sumaComisionAfiliados = parseFloat(sumaComisionAfiliados).toFixed(1))
    : (sumaComisionAfiliados = 0);
  const totalComisiones = parseFloat(ventasVendedor.ganancias);

  res.render("usuario/ventas-vendedor", {
    footerVendedor : true,
    user: req.user,
    facturacionPropia,
    facturacionAfiliado,
    ventasVendedor,
    sumaComisionPropia,
    sumaComisionAfiliados,
    totalComisiones,
  });
};

// todo: ==> Consultar factura para mostrar en el siderbar
exports.consultarFactura = async (req, res) => {
  const { idFactura } = req.body;
  const facturas = await conexion.query("SELECT * FROM factura");
  const f = facturas.find((i) => i.id_factura == idFactura);

  if (f) {
    const cliente = await conexion.query("SELECT * FROM nuevos_cliente");
    const c = cliente.find((i) => i.id == f.id_cliente);
    f.cliente = {
      nombre: c.nombre + " " + c.apellido,
      telefono: c.telefono,
      direccion: c.direccion,
    };
    f.vendedores = JSON.parse(f.vendedores);
    f.fecha_pago = f.mes + "/" + f.dia + "/" + f.year;

    console.log("\nFACTURA SELECCIONADA >>>>>> ", f);
    if (f.estadoFactura == 1) {
      res.send(f);
    } else {
      res.send(false);
    }
  }
};
