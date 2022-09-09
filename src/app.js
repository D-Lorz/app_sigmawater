var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var session = require('express-session');
var bodyParser = require('body-parser');
const dotenv = require('dotenv')
const morgan = require('morgan'); // registra las solicitudes junto con alguna otra información
var session = require('express-session');


var app = express();
 
 app.use(session({ 
    secret: '123458cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
 
//seteamos el motor de plantillas
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.set('trust proxy', 1) // Proxy de confianzaf

/** Middlewares */
app.use(morgan('dev'));
app.use(flash());

//para procesar datos enviados desde forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//seteamos la carpeta public para archivos estáticos
app.use(express.static(path.join(__dirname, './public')));

//seteamos las variables de entorno
dotenv.config({ path: './env/.env' });

//para poder trabajar con las cookies
 app.use(cookieParser());

/** VARIABLES GLOBALES */
global.urlLicencias = ['front', 'back'];
global.urlLicenciasClientes = ['front', 'back', 'acuerdo'];
global.urlEvidenciaServicioInstalado = ['front'];

global.urlProfile = ''
global.urlEvidencia = ''

// No almacenar caché
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

//llamar al router
app.use('/', require('./routes/router'));
app.use('/', require('./routes/customer'));
app.use('/', require('./routes/admin'));
app.use('/', require('./routes/sellers')); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//app.use('/', indexRouter);
app.use('/', usersRouter);

 // Configuraciones
 app.set('port', process.env.PORT || 3000);

 app.listen(app.get('port'), () => {
  console.log("***********************************************************")
  console.log('===> 🚀 SERVIDOR CORRIENDO en http://localhost:' + app.get('port')) 
});
 
module.exports = app;