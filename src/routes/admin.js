const express = require('express')
const router = express.Router()
const { isAuthenticated } = require('../controllers/authController');
const { listarVendedores, listarVendedores_PerfilVendedores, listarClientes_PerfilClientes, listarClientes_PerfilClientess, listarClientes,
  ActualizarNivel, actualizarEstadoVendedor, ActualizarCredito, ActualizarMontoAprobado,
  clfirmas, factura, deducciones, efectuarVenta } = require('../controllers/adminControllers');

// * RUTAS PARA VENDEDORES
router.post('/estadoDelVendedor', isAuthenticated, actualizarEstadoVendedor);
router.post('/ActualizarNivel', isAuthenticated, ActualizarNivel);
router.post('/ActualizarCredito', isAuthenticated, ActualizarCredito);
router.post('/ActualizarMontoAprobado', isAuthenticated, ActualizarMontoAprobado);
router.get('/vendedores', isAuthenticated, listarVendedores)
router.get('/perfil-vendedores/:id', isAuthenticated, listarVendedores_PerfilVendedores)
/*=============================================================*/

router.get('/listar-clientes', isAuthenticated, listarClientes)
router.get('/perfil-cliente/:id', isAuthenticated, listarClientes_PerfilClientes)

router.get('/acuerdo/:id', isAuthenticated, clfirmas)
router.get('/create/:id', isAuthenticated, listarClientes_PerfilClientess)
/*=============================================================*/

// * RUTAS PARA VENDEDORES
router.post('/estadoDelVendedor', isAuthenticated, actualizarEstadoVendedor);
router.post('/ActualizarNivel', isAuthenticated, ActualizarNivel);
router.post('/ActualizarCredito', isAuthenticated, ActualizarCredito);
router.post('/ActualizarMontoAprobado', isAuthenticated, ActualizarMontoAprobado);
/*=============================================================*/

// * RUTAS PARA VENTAS, COMISIONES, DEDUCCIONES
router.get('/ventas', isAuthenticated, factura)
router.post('/deducciones', isAuthenticated, deducciones)
router.post('/efectuarVenta', isAuthenticated, efectuarVenta)
/*=============================================================*/

module.exports = router