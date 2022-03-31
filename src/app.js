const express = require('express');
const session = require('express-session')
const morgan = require('morgan');
const bodyParser = require('body-parser')
const passport = require('passport') // Modulo para realizar la autenticación (Local o con Redes Sociales)
const path = require('path');
const csrf = require('csurf')
const flash = require('connect-flash') // Para enviar mensajes de Flash en cualquier vista

// Inicializaciones
const app = express();
// require('./lib/passport') // Para autenticación de usuarios

// Configuraciones
app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/******* Middlewares *******/
app.use(morgan('dev'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
app.use(session({
  secret: 'secret_3csigma-water',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session()); // Inicio de sesiones persistentes
//Protección contra los ataques csrf
//app.use(csrf())

/******** Variables Globales ********/
app.use((req, res, next) => {
  app.locals.user = req.user; //Variable de sesión de usuario
  //app.locals.csrfToken = req.csrfToken(); //Token de seguridad
  next();
})

// Carpeta de archivos publicos
app.use(express.static(path.join(__dirname, 'public')))

// Rutas
app.use(require('./routes'));           //Llamando a las Rutas del archivo index.js
app.use(require('./routes/registro'));  //Llamando a las Rutas del archivo registro.js

// Servidor corriendo desde el puerto asignado en este caso 3000
app.listen(app.get('port'), () => {
  console.log('Servidor corriendo in http://localhost:'+app.get('port'));
});