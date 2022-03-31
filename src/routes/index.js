const  express = require('express');
const router = express.Router();

// Rutas Principales
router.get('/', (req, res)=> {
   res.render('index');
});

router.get('/inicio', (req, res) => {
    res.send("Hola desde la Ruta INICIO");
});

module.exports = router;