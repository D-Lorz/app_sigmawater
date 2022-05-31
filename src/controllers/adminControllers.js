const {
    promisify
  } = require("util");
  const conexion = require("../database/db");
  
  
  
  

  
// todo ===========>>>  Mostrar lista de vendedores
  exports.listarVendedores = async (req, res) => {
    // Capturando el id del Vendedor actual
    const id_vendedor = req.user.id_vendedorAceptado;
  
    // Consultando en DB los clientes que pertenecen al vendedor actual
         conexion.query('SELECT * FROM registro_de_vendedores WHERE estado_de_la_cuenta = 0', [id_vendedor], (err, result) => {
                   
     
       res.render('vendedores', { user: req.user,lista_vendedores: result })
    })
  
  }
  
// ! >>>>>>>>>  Tarjetas en la vista perfil vendedores <<<<<<<<<<<
  exports.listarClientes_PerfilClientes = async (req, res) => {
  
    const id_vendedor = req.params.id;
     let info_vendedor = await conexion.query('SELECT * FROM registro_de_vendedores WHERE id_vendedor = ? ', [id_vendedor])
      info_vendedor = info_vendedor[0]

    // * >>> Renderizado <<<<<
    res.render('perfil-vendedores', { user: req.user, info_vendedor })
  
  
  }

// todo ===========>>> Enviar contraseña y usuario a la tabla USUARIOS
    exports.generar_usuario_vendedor = async (req, res) => {
           
       const correo = req.body.correo; 
       const pass= generarPass_vendedor(6);

       const id_vendedorAceptado = req.body.id_consecutivo
       const id_vendedor = req.body.id_vendedor
       
        const Datos_agendarSolicitud = {correo,pass,id_vendedorAceptado,id_vendedor}
       
       await conexion.query('INSERT INTO usuarios SET ? ', [Datos_agendarSolicitud], (err, result) => {
         if (err) throw err;
         if (result) { res.redirect('/perfil-vendedores/'+id_vendedor) }
           
          })
       
       }
// todo ===========>>> Generar codigo numero aleatorio del cliente
const generarPass_vendedor = (num) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result1 = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result1;
  }
