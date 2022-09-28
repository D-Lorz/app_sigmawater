const express = require('express');
const router = express.Router();
const { resetPassword, updatePassword } = require('../controllers/authController');

/* RUTA + VISTA PARA RESTABLECER LA CLAVE DE LA CUENTA */
router.get('/restablecer-clave', (req, res) => {
    res.render('restablecer-clave');
});

/* RUTA + PÁGINA DONDE SE COLOCARÁ LA NUEVA CLAVE DE LA CUENTA */
router.get('/reset-password', (req, res) => {
    res.render('reset-password', {
        title: 'Reset Password Page',
        token: req.query.token
    });
});

/* send reset pass link in correo */
router.post('/reset-password-correo', resetPassword)

/* update pass to database */
router.post('/update-password', updatePassword)
module.exports = router;