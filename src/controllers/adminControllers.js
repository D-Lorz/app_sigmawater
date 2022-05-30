const {  promisify} = require("util");
const conexion = require("../database/db");
  

  

  // todo ====>>  Mostrar lista total de VENDEDORES
  exports.listar_vendedores = async (req, res) => {
         
    conexion.query('SELECT * FROM registro_de_vendedores', (err, result) => {
         if (err) throw err;
      res.render('vendedores', { user: req.user,vendedores: result })
    })
  
 }


  
