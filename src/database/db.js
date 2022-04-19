// const mysql = require('mysql')

// const conexion = mysql.createConnection({
//     host : process.env.DB_HOST,
//     user : process.env.DB_USER,
//     password : process.env.DB_PASS,
//     database : process.env.DB_DATABASE,
// });

// conexion.connect( (error)=> {
//     if(error){
//         console.log('El error de conexión es: '+error)
//         return
//     }
//     console.log('=========> CONECTADO A LA BASE DE DATOS')
//     console.log("***********************************************************")
// })

// module.exports = conexion


const mysql = require('mysql');
const {promisify} = require('util');

const {database} = require('../keys')

// Método para ejecutar diferentes hilos para varias tareas al tiempo
const pool = mysql.createPool(database)

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('LA CONEXIÓN A LA BASE DE DATOS FUE CERRADA')
        }
        if (err.code === 'ER_CON_COUNT_ERROR'){
            console.error('LA BASE DE DATOS TIENE MUCHAS CONEXIONES')
        }
        if (err.code === 'ECONNREFUSED'){
            console.error('LA BASE DE DATOS FUE RECHAZADA')
        }
    } else {
        if (connection) connection.release();
        console.log('CONEXIÓN EXITOSA A LA BASE DE DATOS');
        return;
    }
})

// Convirtiendo Callbacks a Promesas o async - await
pool.query = promisify(pool.query)

module.exports = pool