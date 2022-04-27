
// const jwt = require("jsonwebtoken");
// const bcryptjs = require("bcryptjs");
// const conexion = require("../database/db");
// const { promisify } = require("util");


// exports.pruebaprueba = async (req, res) =>{

// try {

  
//     console.log("FRONTAL:>>>  ", urlLicencias[0]);
//     console.log("TRASERA:>>>  ", urlLicencias[1]);

//     const frontal = '../licences/' + urlLicencias[0]
//     const trasera = '../licences/' + urlLicencias[1]
  
//     const licencia_prueba = JSON.stringify({
//         'frontal': frontal,
//         'trasera': trasera

//     });

//     const objeto_datos = {licencia_prueba}


//   await conexion.query('INSERT INTO prueba SET ?', [objeto_datos],  (err, result) => {
//     if (err) throw err;
//     console.log("1 Registro insertado");
//     console.log(result)
//     res.redirect('https://3csigmawater.com')

// })


    
// } catch (error) {
//     console.log(error);
// }


// }


