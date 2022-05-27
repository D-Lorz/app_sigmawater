const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan'); // registra las solicitudes junto con alguna otra información
const cookieParser = require('cookie-parser')
const path = require('path');

// Inicializaciones
const app = express()

// Configuraciones
app.set('port', process.env.PORT || 3000);

//seteamos el motor de plantillas
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.set('trust proxy', 1) // Proxy de confianza

/** Middlewares */
app.use(morgan('dev'))
//para procesar datos enviados desde forms
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//seteamos la carpeta public para archivos estáticos
app.use(express.static(path.join(__dirname, './public')));

//seteamos las variables de entorno
dotenv.config({path: './env/.env'})

//para poder trabajar con las cookies
app.use(cookieParser())

/** VARIABLES GLOBALES */
global.urlLicencias = ['front', 'back'];
global.urlLicenciasClientes = ['front', 'back','acuerdo'];
global.urlEvidenciaServicioInstalado = ['front'];



// No almacenar caché
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });

//llamar al router
app.use('/', require('./routes/router'));
app.use('/', require('./routes/sellers'));
app.use('/', require('./routes/customer'));


/*========= ESCUCHANDO AL SERVIDOR EN EL PUERTO 3000 O EL QUE TENGA LA VARIABLE DE ENTORNO ===========*/
app.listen(app.get('port'), () => {
        console.log("***********************************************************")
        console.log('===>  SERVIDOR CORRIENDO en http://localhost:'+app.get('port'))
});