const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const cron = require('node-cron');
const { isAuthenticated, nologueado, login, logout } = require("../controllers/authController");
const { dashboardVendedor } = require("../controllers/customerFormControllers");
const { dashboardAdministrador,historial_clientes_admin,
        historial_vendedores_admin,
        filtro_numventas_admin,
        ganancias_mensuales_admin } = require("../controllers/adminControllers");



// Ejecución Semanal (Domingo 10pm)
cron.schedule('0 22 * * Sun', () => {
  historial_clientes_admin();
  historial_vendedores_admin();
  filtro_numventas_admin();
});


// Ejecución Mensual
cron.schedule('0 1 1 * *',() => {
  ganancias_mensuales_admin();
});

// * ========== Renderizado de vistas generales ==========
//                           ↓↓
router.get("/login", nologueado, (req, res) => { res.render("login", { alert: false });});
router.post("/login", nologueado, login);
router.get("/logout", logout);
/*=========================================================================*/
// * ========== RUTAS DASHBOARD PRINCIPAL ADMIN & VENDEDOR ==========
//                           ↓↓
router.get("/", isAuthenticated, dashboardVendedor, (req, res) => {
   if (!(req.user.rol === "vendedor")) { res.redirect("./administrador"); }
   res.render("usuario/dashboard", { user: req.user });
 });
 
 router.get("/administrador", isAuthenticated,dashboardAdministrador, (req, res) => {
   if (!(req.user.rol === "administrador")) { res.redirect("./"); }
   res.render("administrador", { user: req.user });
 });

module.exports = router;