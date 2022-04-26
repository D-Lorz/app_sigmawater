const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const path = require('path');
const multer = require('multer');
const formularioControllers = require('../controllers/formularioControllers');









router.get('/nuevo-cliente', authController.isAuthenticated, (req, res) => {
    res.render('nuevo-cliente', { correo: req.correo })
});

router.post('/registrarclientela', formularioControllers.registrarclientela);

/*==================RUTAS =====================*/

//TODO: router para los métodos del sellerControllers

/*=============================================================*/

/*=============================================================*/


module.exports = router