const {
  promisify
} = require("util");
const conexion = require("../database/db");



// todo --> formulario para crear un nuevo cliente
exports.registrarClientes = async (req, res) => {
  try {
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
      nombre,
      segundo_nombre,
      apellido,
      correo,
      telefono,
      direccion,
      direccion2,
      ciudad,
      estado_ubicacion,
      codigo_postal,
      id_cliente,
      id_vendedor
    }
    console.log(nuevoRegistroClientes)

    await conexion.query('INSERT INTO nuevos_cliente SET ?', [nuevoRegistroClientes], (err, result) => {
      if (err) throw err;
      console.log(" ========>> 1 Registro Cliente ");
      console.log(result)
      console.log(" ========>> 1 Registro Cliente ");
      res.redirect('/lista-clientes')
    })
  } catch (error) {
    console.log(error);

  }

}

exports.getSolicitudCreditos = async (req, res) => {
  const id = req.params.id

  await conexion.query('SELECT * FROM nuevos_cliente WHERE id_cliente = ? LIMIT 1', [id], (err, result) => {
    if (err) throw err;

    res.render('solicitar-credito', {
      user: req.user,
      cliente: result[0]
    });

  })

}

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
    monto_financiar_cliente,
    sistema,
    numero_licencia_cliente,
    estado_licencia_cliente,
    fecha_expedicion_licencia_cliente,
    fecha_vencimiento_licencia_cliente,
    seguro_social_licencia,
    tipo_de_seguro,
    fecha_nacimiento_cliente,
    telefono_secundario_cliente,
    condicion_vivienda,
    compa_hipotecaria_cliente,
    anio_residencia_cliente,
    meses_residencia_cliente,
    empleador_aplicante_cliente,
    anios_trabajando_ingresos,
    meses_trabajando_ingresos,
    salario_mensual_ingresos,
    bancarrota,
    sacc_pendiente,
    ocupacion_ingresos,
    anio_bancarrota_ingresos,
    telefono_trabajo_ingresos,
    tipo_bancarrota_ingresos,
    empleador_anterior_ingresos,
    otros_ingresos_ingresos,
    ingresos_adicionales_ingresos,
    tipo_cuenta_bancaria,
    numero_ruta_bancaria,
    numero_cuenta_bancaria,
    licencia_co_solicitante,
    expedicion_licencia_co_solicitante,
    vencimiento_licencia_co_solicitante,
    numero_se_social_co_solicitante,
    tipo_seguro_co_solicitante,
    fecha_nacimiento_co_solicitante,
    nombre_co_solicitante,
    segundo_nombre_co_solicitante,
    apellido_co_solicitante,
    telefono_movil_co_solicitante,
    tel_secundario_co_solicitante,
    direccion_co_solicitante,
    relacion_parentesco_co_solicitante,
    militar_active,
    empleador_co_solicitante,
    anios_trabajando_co_solicitante,
    meses_trabajando_co_solicitante,
    salario_mensual_co_solicitante,
    ocupacion_co_solicitante,
    telefono_trabajo_co_solicitante,
    empleador_anterior_co_solicitante,
    ingresos_co_solicitante,
    ingresos_adicionales_co_solicitante,
    nom_referencia1_co_solicitante,
    parentesco1_co_solicitante,
    tel_movil1_co_solicitante,
    nom_referencia2_co_solicitante,
    parentesco2_co_solicitante,
    tel_movil2_co_solicitante,
    nom_referencia3_co_solicitante,
    parentesco3_co_solicitante,
    tel_movil3_co_solicitante,
    licencia_cliente,
    acuerdo_firmado,
    id_cliente


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
  // * --> Insertar datos de la solicitud de crédito del cliente
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
    res.render('lista-clientes', {
      user: req.user,
      clientes: result
    })

  })


}

// todo -->  tarjetas en la vista perfil clientes
exports.listarClientes_PerfilClientes = async (req, res) => {

  const id_cliente = req.params.id
  let clientes2 = await conexion.query('SELECT * FROM nuevos_cliente WHERE id_cliente = ? LIMIT 1', [id_cliente])
  clientes2 = clientes2[0]

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
  
    res.render('perfil-clientes', { user: req.user, clientes2, estado})
}


// todo --> Formulario de calcular ahorro
exports.registrarClientes = async (req, res) => {
  try {
    const agua_embotellada = req.body.agua_embotellada;
    const jabones = req.body.jabones;
    const productos_limpieza = req.body.productos_limpieza;
    const agua_caliente = req.body.agua_caliente;
    const plomeria_electrodomesticos = req.body.plomeria_electrodomesticos;
    const ropa_lenceria = req.body.ropa_lenceria;
 
    const datos_calcular_ahorros = {
      agua_embotellada,
      jabones,
      productos_limpieza,
      agua_caliente,
      plomeria_electrodomesticos,
      ropa_lenceria
    }
    console.log(datos_calcular_ahorros)

    await conexion.query('INSERT INTO ahorro SET ?', [datos_calcular_ahorros], (err, result) => {
      if (err) throw err;
      console.log(" ========>> 1 Registro Cliente ");
      console.log(result)
      console.log(" ========>> 1 Registro Cliente ");
      res.redirect('/lista-clientes')
    })
  } catch (error) {
    console.log(error);

  }

}



















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

const generateRandomNumber = (num) => {
  const characters = '0123456789';
  let result1 = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result1;
}