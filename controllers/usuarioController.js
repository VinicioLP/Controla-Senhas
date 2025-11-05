const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");

module.exports = {
  cadastro: async (req, res) => {
    const { nome, email, senha } = req.body;
    const hash = await bcrypt.hash(senha, 10);
    await Usuario.create({ nome, email, senha: hash });
    res.redirect("/login");
  },
  login: async (req, res) => {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.render("login", { erro: "Usuário ou senha inválidos" });
    }
    req.session.usuarioId = usuario.id;
    res.redirect("/senhas");
  },
  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/login");
  },
};
