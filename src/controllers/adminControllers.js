const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const { promisify } = require('util')




// exports.consultaGraficas = async (req, res) => {
//     // ? ===============================
//       const id_cliente = req.params.id
//       let clientes2 = await conexion.query('SELECT * FROM nuevos_cliente WHERE id_cliente = ? LIMIT 1', [id_cliente])
//        clientes2 = clientes2[0]

//        const id = req.params.id
//        let ahorroCalculado = await conexion.query('SELECT * FROM ahorro WHERE id_cliente = ?  ORDER BY id DESC LIMIT 1')
//      if(ahorroCalculado.length > 0 ){
//       ahorroCalculado = ahorroCalculado[0]
//      }

//      res.send(ahorroCalculado)
// }



