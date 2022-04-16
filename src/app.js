const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const path = require('path');
const app = express()



//seteamos el motor de plantillas
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//seteamos la carpeta public para archivos estáticos
app.use(express.static(path.join(__dirname, './public')));

//para procesar datos enviados desde forms
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//seteamos las variables de entorno
dotenv.config({path: './env/.env'})

//para poder trabajar con las cookies
app.use(cookieParser())

// No almacenar caché
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });

//llamar al router
app.use('/', require('./routes/router'))


/*========= ESCUCHANDO AL SERVIDOR EN EL PUERTO 3000 ===========*/
app.listen(3000, () => {
        console.log("***********************************************************")
        console.log('=========>  SERVIDOR CORRIENDO  <======== en http://localhost:3000')
        console.log("***********************************************************")

});