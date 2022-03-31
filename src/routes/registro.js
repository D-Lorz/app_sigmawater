const  express = require('express');
const router = express.Router();

// Rutas relacionadas al registro
router.get('/registro', (req, res) => {
    res.send("Hola desde la Ruta REGISTRO");
});

module.exports = router;