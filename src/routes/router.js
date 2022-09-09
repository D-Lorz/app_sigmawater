const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { isAuthenticated, nologueado, login, logout } = require("../controllers/authController");
const { dashboardVendedor } = require("../controllers/customerFormControllers");

// * ========== Renderizado de vistas generales ==========
//                           ↓↓
router.get("/login", nologueado, (req, res) => { res.render("login", { alert: false });});
router.post("/login", nologueado, login);
router.get("/logout", logout);
/*=========================================================================*/
// * ========== RUTAS DASHBOARD PRINCIPAL ADMIN & VENDEDOR ==========
//                           ↓↓
router.get("/", isAuthenticated, dashboardVendedor, (req, res) => {
   if (!(req.user.rol === "vendedor")) {
     res.redirect("./administrador");
   }
   res.render("dashboard", { user: req.user });
 });
 
 router.get("/administrador", isAuthenticated, (req, res) => {
   if (!(req.user.rol === "administrador")) {
     res.redirect("./");
   }
   res.render("administrador", { user: req.user });
 });

 router.get("/hola", (req, res) => {
  res.render("hola", { user: req.user });
});

module.exports = router;