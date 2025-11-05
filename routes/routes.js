const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const senhaController = require("../controllers/senhaController");

const router = express.Router();

router.get("/login", (req, res) => res.render("login", { erro: null }));
router.post("/login", usuarioController.login);
router.get("/cadastro", (req, res) => res.render("cadastro"));
router.post("/cadastro", usuarioController.cadastro);
router.get("/logout", usuarioController.logout);

router.get("/senhas", senhaController.listar);
router.post("/senhas/add", senhaController.criar);
router.post("/senhas/edit/:id", senhaController.editar);
router.get("/senhas/delete/:id", senhaController.remover);

module.exports = router;
